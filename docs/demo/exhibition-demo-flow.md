# Exhibition Demo Flow

## Demo vault

`/demo-data/exhibition` — a mock knowledge graph for a contemporary art exhibition programme.

## Nodes in the vault (planned)

| Node | Type | Description |
|------|------|-------------|
| Light & Shadow | Exhibition | Current show |
| Maria Chen | Artist | Painter, works with light |
| Refraction Series | Artwork | 5-piece installation |
| Impressionism | Concept | Art movement influence |
| Claude Monet | Artist | Historical reference |
| Water Lilies | Artwork | Reference work |
| Collector A | Entity | Anonymised lender |
| Loan Agreement 2026 | Document | Legal document |
| Conservation Report | Document | Condition note |
| Art Basel 2025 | Event | Previous showing |

## Key relationships to demonstrate

- `Light & Shadow` → contains → `Refraction Series`
- `Maria Chen` → created → `Refraction Series`
- `Refraction Series` → relates-to → `Impressionism`
- `Impressionism` → relates-to → `Claude Monet`
- `Claude Monet` → created → `Water Lilies`
- `Collector A` → references → `Loan Agreement 2026`
- `Refraction Series` → references → `Conservation Report`
- `Refraction Series` → relates-to → `Art Basel 2025`

## Demo script (2-minute walk)

1. **Open the exhibition vault** — graph loads with ~15 nodes, visually richer colours
2. **Click "Light & Shadow"** — sidebar shows exhibition details + linked artists and works
3. **Expand "Maria Chen"** — her complete oeuvre in the vault appears
4. **Follow the influence chain** — Refraction Series → Impressionism → Monet → Water Lilies
5. **Switch to provenance view** — show Collector A → Loan Agreement path
6. **Use type filter** — toggle to show only Documents to surface legal/conservation trail

## Talking points

- "You can trace artistic influence across centuries in two clicks"
- "Provenance, loans, and condition reports are all connected to the work — not buried in folders"
- "Curators, registrars, and directors each see the same graph through their own lens"
