# Accounting Demo Flow

## Demo vault

`/demo-data/accounting` — a mock knowledge graph for a mid-size accounting practice.

## Nodes in the vault (planned)

| Node | Type | Description |
|------|------|-------------|
| Revenue Recognition | Concept | IFRS 15 / ASC 606 principle |
| IFRS 15 | Document | Standard reference |
| Client A | Entity | Anonymised client |
| Deferred Revenue | Concept | Liability-side treatment |
| Contract Liability | Concept | Related balance sheet item |
| Q3 Audit File | Document | Working paper |
| Going Concern | Concept | Audit risk flag |
| ISA 570 | Document | Audit standard |
| Materiality | Concept | Scoping concept |

## Key relationships to demonstrate

- `Revenue Recognition` → relates-to → `Deferred Revenue`
- `Deferred Revenue` → relates-to → `Contract Liability`
- `IFRS 15` → references → `Revenue Recognition`
- `Q3 Audit File` → references → `Going Concern`
- `Going Concern` → relates-to → `ISA 570`
- `Client A` → contains → `Q3 Audit File`

## Demo script (2-minute walk)

1. **Open the accounting vault** — graph loads with ~20 nodes
2. **Point out clusters** — audit standards cluster vs. client documents cluster
3. **Click "Revenue Recognition"** — sidebar shows excerpt + 4 direct connections
4. **Expand neighbours** — IFRS 15 and Deferred Revenue appear highlighted
5. **Switch to "Going Concern" cluster** — show cross-cluster path to Client A
6. **Use search** — type "audit" to filter to audit-related nodes

## Talking points

- "Every concept links to the standard that defines it"
- "You can trace from a client file all the way back to the underlying regulation"
- "This is what your knowledge base actually looks like — not a folder tree"
