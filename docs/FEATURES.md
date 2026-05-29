# Knowledge Map AI — Feature Baseline

> Living record of what the demo does today, plus a changelog for future expansion.
> Keep this file updated whenever a feature is added, changed, or removed.

- **Product:** Knowledge Map AI — "Turn scattered information into a living knowledge map."
- **Live demo:** https://map.clawshow.ai
- **Baseline commit:** `d3835c7` (mobile-responsive layout)
- **Status:** MVP demo · **mock data only** · no backend / no database / no auth / no real AI API
- **Principle:** Information → Ontology → Relationship → Map → Memory → Q&A → Action

---

## 1. Layout

Three-zone product UI (responsive):

- **Top header** — ClawShow logo, product name + subtitle, current `Demo: <name>` chip, `by ClawShow AI`. On mobile: a hamburger (☰) button appears; subtitle and byline collapse.
- **Left sidebar** — Demo Vault switcher, Information Sources, Entity Filters, "Connect Data Source" footer.
- **Center canvas** — the living knowledge graph (primary visual).
- **Right Node Memory Panel** — semantic detail for the selected node.

## 2. Demo Vaults (mock datasets)

Switchable from the left sidebar. Mock data only — no real customer data.

| Vault | Nodes | Core relationship chain |
|-------|-------|-------------------------|
| **Accounting Map** | 9 | Client Alpha → Alpha Consulting → Invoice #2026-001 → VAT Rule FR-2024-01 → VAT Filing Deadline → Missing Document → Email from Client → VAT Deduction Case → Follow-up Action |
| **Exhibition Map** | 10 | Paris Business Expo → Exhibitor Alpha → Booth B12 → Visitor Marie Chen → Lead #L-204 → Campaign Spring 2026 → Content Material → Partner BizMedia → Opportunity → Follow-up Action |

Entity types are color-coded (Client/blue, Company/green, Invoice/yellow, VAT Rule/teal, Deadline/red, Missing Document/orange, Email/cyan, Case/purple, Action/pink, and the exhibition set).

## 3. Center Graph

- **Force-directed layout** (d3-force) computed to a settled, low-crossing arrangement on load; related nodes cluster naturally (no flowchart rows).
- **Circular colored nodes**, **sized by connection count (degree)** — hub nodes are larger (Rowboat-style). Small icon inside, label below.
- **Floating straight edges** that connect node-center to node-center (clipped at the circle), with relationship labels (e.g. "issued", "applies", "missing").
- **White theme** with a light dot-grid background; zoom controls + (desktop) minimap.
- **Bottom-left legend** of entity colors (desktop only).

### Interactions
- **Hover a node** → that node + its 1-hop neighbors highlight; connecting edges turn into a flowing dashed line; unrelated nodes/edges dim.
- **Click a node** → selects it (opens the Node Memory Panel).
- **Drag a node** → moves it; neighbors gently react (live sim re-heat), then settle.
- **Zoom / pan** the canvas (scroll + drag).
- **Auto-fit** — the view frames all nodes on load and **re-fits automatically on any canvas resize** (window/orientation/mobile-desktop switch).

## 4. Right Node Memory Panel

Opens on node click. Sections (top → bottom):

1. **Type** (entity type chip + color)
2. **Name**
3. **Summary** (one-line natural-language context)
4. **Connected To** (1-hop neighbors + relationship label)
5. **Source Notes**
6. **Recent Activity**
7. **Related Questions** (relationship-driven example questions)
8. **Possible Actions** (at the bottom — relationship visibility is the primary value, automation is downstream)

## 5. Left Sidebar Tools

- **Demo Vault** — switch between Accounting / Exhibition maps.
- **Information Sources** — clickable list (e.g. Client Files, Invoices, VAT Rules…). Clicking a source **focuses** its entity type on the map (highlights all nodes of that type, dims the rest, auto-fits to them). Each row has a **"+" button** that **ingests a new mock node of that type** with auto-generated relationships, demonstrating the map growing live.
- **Entity Filters** — colored toggles to show/hide node types on the canvas.
- **Connect Data Source** (footer) — placeholder entry point; **Obsidian import — coming soon** (currently virtual/mock sources).

## 6. Mobile Support

- Left sidebar becomes an **off-canvas drawer** toggled by the header hamburger; tapping a backdrop or making a selection closes it.
- Node Memory Panel becomes a **bottom sheet** (slides up, rounded top, grab handle, close button).
- **Minimap and legend hidden** on small screens to maximize the map.
- Graph **auto-refits** so all nodes stay framed at mobile widths.

## 7. Relationship-based Ask AI (concept)
- Each node surfaces **Related Questions** derived from its relationships (e.g. "Who provides the KBIS?", "Which leads came from this campaign?"). These are mock prompts only — no API is called. Reserved for a future AI Q&A layer.

## 8. Tech Stack
- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- `@xyflow/react` (React Flow) — canvas, nodes, edges
- `d3-force` — clustering layout
- `framer-motion` — panel/drawer animation
- `lucide-react` — icons

## 9. Deployment (current)
- Host: **stand9.focusingpro.com** → nginx → `127.0.0.1:3200` → `knowledge-map-ai.service`
- Path: `/opt/knowledge-map-ai` (Next app in `apps/web`)
- Public: **https://map.clawshow.ai** (Let's Encrypt SSL)
- Data: mock only · no secrets in repo

## 10. Explicit Non-Features (today)
- No backend, database, auth, file upload, or real AI/LLM calls.
- No CRM / workflow engine / email or calendar sync.
- Obsidian (and other real data-source) import not yet implemented — sources are mock.

---

## Future Expansion Log

Append entries as features land. Suggested format:

```
### YYYY-MM-DD — <short title> (commit <hash>)
- What changed / added
- Why
```

### 2026-05-29 — Baseline recorded (commit d3835c7)
- Captured current demo: dual mock vaults, force-directed circular graph with degree sizing,
  hover 1-hop highlight, floating labeled edges, Node Memory Panel, data-source focus,
  live add-node demo, entity filters, and full mobile-responsive layout.

### Planned / candidate
- [ ] Obsidian vault import (parse markdown + `[[wiki-links]]` → nodes & relationships) — replaces the mock data layer behind "Connect Data Source".
- [ ] Real relationship-based AI Q&A (wire "Related Questions" to an LLM).
- [ ] Persisted user-added nodes / editing.
- [ ] Path-finding / "how are A and B connected" view.
- [ ] Cluster/community highlighting; timeline axis for date-tagged nodes.
- [ ] Export graph (PNG / JSON).
- [ ] Continuous gentle node drift (optional "alive" motion).
