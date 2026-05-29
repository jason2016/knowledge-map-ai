# MVP Priority

## Goal

Deliver a local-first demo that proves the relationship-first visual knowledge map concept.
No backend. No AI API. Mock data only.

## Must-have (MVP)

- [ ] Interactive force-directed graph as the primary view
- [ ] Node types: concept, document, entity, tag
- [ ] Edge types: relates-to, contains, references, contradicts
- [ ] Click a node → expand its immediate neighbourhood
- [ ] Sidebar: node detail panel (title, type, excerpt, links)
- [ ] Two demo vaults loaded from `/demo-data`: accounting and exhibition
- [ ] Vault switcher in the UI
- [ ] Search / filter nodes by label or type
- [ ] Responsive layout (desktop-first, tablet-friendly)

## Nice-to-have (post-MVP)

- [ ] Path-finding between two selected nodes
- [ ] Cluster / community detection highlight
- [ ] Timeline axis for date-tagged nodes
- [ ] Export graph as PNG / JSON
- [ ] Load a real local vault from disk

## Out of scope for MVP

- User accounts / auth
- Backend persistence
- AI-generated relationships
- Real-time collaboration
- Mobile layout

## Tech stack (proposed)

- **Framework**: Next.js (App Router)
- **Graph rendering**: React Flow or D3-force
- **Styling**: Tailwind CSS
- **Data**: Static JSON in `/demo-data`
- **Hosting**: Local `npm run dev` only for MVP

## Definition of done

A first-time viewer can open the app, see a populated knowledge graph for one of the demo vaults, explore connections by clicking nodes, and understand the value proposition in under 2 minutes.
