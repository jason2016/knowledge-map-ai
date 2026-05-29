# Knowledge Map AI — Web Demo

**Turn scattered information into a living knowledge map.**

by ClawShow AI · clawshow.ai/knowledge-map-ai

---

## Run the demo

```bash
cd apps/web
npm run dev
```

Open **http://localhost:3000**

---

## What you'll see

| Zone | What it shows |
|------|---------------|
| Left sidebar | Product brand, demo switcher, information sources, entity type filters |
| Center | Living knowledge map — colored nodes, labelled edges, minimap, zoom controls |
| Right panel | Node Memory Panel — slides in on click, shows Summary, Connected To, Source Notes, Recent Activity, Related Questions, Possible Actions |
| Bottom strip | Animated product principle: Information Sources → Entity Recognition → Relationship Generation → Map Formation → Node Expansion |

---

## Interaction

- **Click a node** — opens Node Memory Panel; connected nodes stay bright, others fade
- **Click again / click background** — deselect, close panel
- **Entity filter buttons** — toggle node types in/out of the graph
- **Demo switcher** — switch between Accounting Map and Exhibition Map

---

## Demos

### Accounting Knowledge Map (9 nodes)

**Client Alpha → Alpha Consulting → Invoice #2026-001 → VAT Rule FR-2024-01 → VAT Filing Deadline → Missing Document → Email from Client → VAT Deduction Case → Follow-up Action**

### Exhibition Marketing Map (10 nodes)

**Paris Business Expo → Exhibitor Alpha → Booth B12 → Visitor Marie Chen → Lead #L-204 → Campaign Spring 2026 → Content Material → Partner BizMedia → Opportunity → Follow-up Action**

---

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **@xyflow/react** — graph canvas
- **Framer Motion** — panel animations, bottom strip
- **lucide-react** — icons

---

## Project structure

```
apps/web/src/
├── app/
│   ├── globals.css            Tailwind v4 + React Flow dark overrides
│   ├── layout.tsx             Root layout, metadata
│   └── page.tsx               Main page, state, 3-column layout
├── components/
│   ├── bottom/BottomFlow.tsx  Animated product principle strip
│   ├── graph/CustomNode.tsx   Colored entity node renderer
│   ├── graph/KnowledgeGraph.tsx  React Flow canvas with selection logic
│   ├── panel/NodeMemoryPanel.tsx Animated right detail panel
│   └── sidebar/LeftSidebar.tsx   Brand, demo selector, sources, filters
├── data/
│   ├── accounting.ts          9-node accounting mock dataset
│   └── exhibition.ts          10-node exhibition mock dataset
└── types/index.ts             EntityType, KnowledgeNodeData, ConnectedNodeInfo
```

> **Demo only** — no backend, no database, no auth, no AI API. Mock data only.
