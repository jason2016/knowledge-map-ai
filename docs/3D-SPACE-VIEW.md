# 3D Space View — Build & Design Record

> How the Knowledge Map AI "3D Space" view was built, the decisions behind it,
> and the problems solved along the way. Companion to [FEATURES.md](FEATURES.md).

- **Product line:** "Explore in 3D. Work in 2D." — 3D Space is the exploration /
  demo layer; 2D Map is the operational layer. Both share the same mock data.
- **Default view:** **3D Space** on both desktop and mobile (`viewMode` defaults
  to `'3d'`; not device-dependent).
- **Status:** mock data only — no backend / database / auth / real AI.

---

## 1. Architecture

```
src/app/page.tsx                         ← view state, switcher, panel-on-demand
src/components/ThreeDSpaceGraph.tsx       ← dynamic ssr:false wrapper
src/components/graph/ThreeDSpaceGraphInner.tsx ← the real 3D implementation
src/components/graph/KnowledgeGraph.tsx   ← the 2D view (React Flow)
src/components/panel/NodeMemoryPanel.tsx  ← shared detail panel (overlay/sheet)
src/types/d3-force-3d.d.ts                ← ambient module decl (no @types)
```

**Libraries**
- `react-force-graph-3d` (wraps `3d-force-graph` / Three.js) — the 3D canvas.
- `three` + `@types/three` — geometry, materials, lights, sprites.
- `three-spritetext` — node labels as sprites.
- `d3-force-3d` — to pre-compute a 3D layout synchronously.

**Why a dynamic `ssr:false` wrapper:** Three.js/WebGL touch `window` and cannot
render during SSR. `ThreeDSpaceGraph.tsx` does
`dynamic(() => import('./graph/ThreeDSpaceGraphInner'), { ssr: false })`, so the
heavy module only loads on the client. The inner component uses a normal `ref`
to the `ForceGraph3D` instance — the ref never crosses the dynamic boundary, so
imperative methods (`controls()`, `cameraPosition()`, `scene()`) work reliably.

---

## 2. The core stability decision: pre-settle + freeze

The single most important design choice. Instead of letting `react-force-graph`
run its physics engine on screen (which caused several bugs — see §6), we:

1. **Pre-compute the layout synchronously** with `d3-force-3d` inside a `useMemo`
   (`forceSimulation(nodes, 3)` + link/charge/center/collide forces, 400 ticks).
2. **Pin every node** (`fx/fy/fz = x/y/z`) so positions never move.
3. Run `ForceGraph3D` with `warmupTicks={0}` and `cooldownTicks={0}` — its engine
   does nothing; the graph is **static from the first frame**.

Result: no warmup delay, no "sudden enlarge after a few seconds", no drift, and
clicking/hovering can never move the graph.

**Framing:** a `frameToFit(ms)` helper computes the camera distance from the
layout's bounding radius and the camera FOV/aspect, then calls
`cameraPosition({0,0,D})`. It runs once on mount and on size change (mobile /
desktop / orientation) — **never on selection or replay** (that previously caused
jumps). Margin factor `0.82` makes the graph fill the viewport.

---

## 3. Visual design

- **Background:** soft light radial gradient (`#ffffff → #eef2fb → #e6ebf6`).
  Canvas is transparent (`backgroundColor="rgba(255,255,255,0)"`).
- **Nodes:** glossy-but-true-colour spheres. `MeshStandardMaterial` with an
  **emissive floor** (`emissive = base colour, emissiveIntensity 0.22`) so the
  shaded side keeps the true entity colour and never darkens to brown; strong
  `AmbientLight (0.95)` + two point lights give the 3D shading. Sphere radius
  scales with node degree.
- **Node colour** = `ENTITY_COLORS[entityType]` (shared with 2D).
- **Labels:** `three-spritetext` below each node; the active node's label grows
  (`textHeight 3.6 → 5.4`) and darkens.
- **Links:** curved 3D arcs (`linkCurvature 0.28` + per-link `linkCurveRotation`
  so they bow on different planes). Idle colour `rgba(110,124,160,0.55)`; the
  active node's links turn deep indigo `#4338ca`; unrelated links fade.
- **Flow particles:** `linkDirectionalParticles` only on the active node's links,
  slow (`speed 0.0025`) — reads as the "data flow" of relationships.
- **Halo:** a soft same-colour additive glow sprite shown **only on the active
  node** (hover/selected). Halo and label have `raycast = () => {}` so they never
  intercept pointer events (this fixed nodes near a big halo being un-hoverable).
- **Depth:** two faint point-cloud "starfields" for a calm space feel.

---

## 4. Interaction

- **Hover** (desktop) or the touched node (mobile): highlights that node + its
  1-hop neighbours; their links go indigo + flow; everything else fades. Driven
  by mutating existing Three.js materials — **never rebuilding nodes** — so there
  is no flicker/jitter.
- **Click:** selects a node (drives the shared Node Memory Panel). No camera move.
- **Rotate / zoom / pan:** OrbitControls, with `minDistance`/`maxDistance` bounds
  (no infinite zoom). Node dragging is disabled (layout is frozen).
- **Node Memory Panel:** shared with 2D. On **desktop** it's an absolute overlay
  on the right (so opening it never resizes the canvas → no jump). On **mobile**
  it's a bottom sheet (`max-h 52vh`) that opens **on demand**: tapping a node
  first just highlights relationships on the graph; a **"View details"** button
  then opens the panel (limited screen space → graph first, details second).

---

## 5. Replay — building relationships over time

Two modes, chosen automatically:

- **Focus replay** (a node is selected / touched): reveals **that node's**
  relationship links one at a time (`750ms` apart); neighbours light up as their
  link appears; everything else stays faded. Caption: `Building relationships · n/N`.
  Ends with the node left selected (panel shows its full relations).
- **Global replay** (nothing selected): reveals **all** links in time order
  (`550ms` apart); nodes light up as they get connected — the whole map assembles.
  Caption: `Building map · n/N`.

Implementation: progressive `replayStep` state slices the visible-links array;
node brightness is derived from which links are revealed. The layout stays pinned
(no scatter / re-layout), so replay is a clean reveal, not a chaotic re-settle.

---

## 6. Problems solved (iteration log)

| Symptom | Root cause | Fix |
|---|---|---|
| Nodes tiny / off-screen on load | engine warmup ran for seconds, fit ran late | pre-settle with d3-force-3d + pin + frame on first frame |
| "Sudden enlarge after a few seconds" | `zoomToFit` fired on `onEngineStop` after warmup | compute camera distance up front; no delayed zoom |
| Whole canvas jitter on hover | rebuilding the nodes array each hover → React Flow / FG re-measure | drive highlight by **mutating materials**, keep arrays stable |
| Click "shift left then back" | selecting opened a flex panel that shrank the canvas → refit | make the panel an **absolute overlay** (no canvas resize) |
| Selected ball changed colour | emissive/brighten on select | selection shown by halo only; ball colour unchanged |
| Ball looked flat (2D disc) | unlit `MeshBasic` | lit `MeshStandard` + emissive floor + ambient |
| Yellow turned brown on deselect | lit material under weak light | emissive floor + strong ambient keep colour true |
| Couldn't hover a node near a big halo | halo sprite intercepted the raycast | `raycast = () => {}` on halo + label |
| Black tooltip on hover | default `nodeLabel` tooltip | removed; active label grows instead |
| Switching 3D→2D made 2D tiny | 2D fit ran while hidden, didn't refit on show | refit each view when it becomes `visible` |
| Replay start looked "broken" | nodes scattered far off-screen | replaced full-scatter with in-place progressive reveal |
| Jump when Replay finished | fit effect re-ran when `playing` toggled off | fit effect no longer depends on `playing` |
| Dev "1 Issue" (`reading 'tick'`) | react-force-graph-3d under React StrictMode dev double-mount | `reactStrictMode: false` in `next.config.ts` |
| Edge type "floating" warning / context errors | mid-refactor states | resolved once the context + edge types settled |

---

## 7. Config notes (`next.config.ts`)
- `reactStrictMode: false` — required for react-force-graph-3d (WebGL) in dev.
- `devIndicators: false` — hides the dev on-screen badge.

---

## 8. Future ideas
- Optional continuous gentle auto-rotation (kept off for stability/calm).
- Camera "focus" fly-to a selected node (kept off to avoid motion; revisit).
- Relationship labels on 3D links (removed for clutter; could show on demand).
- Real data via Obsidian import feeding the same node/link model.
