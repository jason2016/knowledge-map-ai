# Context Pack Exchange Setup — `C:\Drive-semantic`

> **Date:** 2026-05-30
> **Status:** local-first developer setup. No API, no database, no server.

## What this is

`C:\Drive-semantic` is the **canonical local exchange root** between Semantic OS
and Knowledge Map AI on a developer's machine.

- **Semantic OS** writes generated Context Packs into
  `C:\Drive-semantic\context-packs\`.
- **Knowledge Map AI** reads them through a **Windows junction** at
  `apps/web/public/context-packs/` so the browser can fetch them as static assets.
- The browser fetch URL stays `/context-packs/...` — the loader (`contextPackLoader.ts`)
  does **not** need to know about `C:\Drive-semantic`.

```
Semantic OS  →  C:\Drive-semantic\context-packs\  ←  junction  ←  apps/web/public/context-packs/  →  browser fetch /context-packs/...
```

This is intentionally local-first and suitable for **private customer Semantic OS
usage** — no upload, no cloud, no per-pack server endpoint.

## Directory layout

```
C:\Drive-semantic\
├── context-packs\          ← Context Packs (what Knowledge Map AI reads)
│   ├── index.json
│   └── <customer>\<pack-id>\
│       ├── context-pack.json
│       ├── summary.md
│       ├── actions.md
│       ├── sources.md
│       └── node-memory\*.md
├── projection-exports\     ← (future) Projection Pack exports
├── action-feedback-inbox\  ← (future) Action Feedback queue
├── manifests\              ← (future) per-customer manifests
└── archive\                ← (future) retired packs
```

## One-time machine setup

### 1. Create the exchange root

```cmd
mkdir C:\Drive-semantic
mkdir C:\Drive-semantic\context-packs
mkdir C:\Drive-semantic\projection-exports
mkdir C:\Drive-semantic\action-feedback-inbox
mkdir C:\Drive-semantic\manifests
mkdir C:\Drive-semantic\archive
```

### 2. Seed `context-packs\index.json`

```json
{
  "updated": "2026-05-30",
  "description": "Shared local exchange index for Knowledge Map AI Context Packs.",
  "packs": []
}
```

### 3. Drop an existing Context Pack in

```cmd
xcopy /E /I /Y "<source pack folder>" "C:\Drive-semantic\context-packs\<customer>\<pack-id>"
```

Example:

```cmd
xcopy /E /I /Y ^
  "C:\Users\<you>\OneDrive\...\10_AI_OS\13_Semantic_Projection_Layer\context-packs\neige-rouge\2026-05-30-query-commercial-launch-problems" ^
  "C:\Drive-semantic\context-packs\neige-rouge\2026-05-30-query-commercial-launch-problems"
```

### 4. Bridge `public/context-packs/` to the exchange root (junction)

If `apps/web/public/context-packs` is a real directory, back it up and remove
it first:

```cmd
move "apps\web\public\context-packs" "apps\web\public\context-packs.backup-before-exchange"
```

Then create the junction (run from the repo root):

```cmd
mklink /J apps\web\public\context-packs C:\Drive-semantic\context-packs
```

Expected output:
```
Junction created for apps\web\public\context-packs <<===>> C:\Drive-semantic\context-packs
```

### 5. Verify

```cmd
dir apps\web\public\context-packs
fsutil reparsepoint query apps\web\public\context-packs
```

Reading via Node should work transparently:

```bash
node -e "const p=require('C:/ClaudeMVP/knowledge-map-ai/apps/web/public/context-packs/neige-rouge/2026-05-30-query-commercial-launch-problems/context-pack.json'); console.log(p.graph.nodes.length, p.graph.edges.length)"
# → 11 11
```

In the browser (`npm run dev`), the same pack is fetched from:
```
http://localhost:3000/context-packs/neige-rouge/2026-05-30-query-commercial-launch-problems/context-pack.json
```

## Fixing a broken junction

If the junction goes stale (e.g. `C:\Drive-semantic` was moved or recreated):

```cmd
rmdir apps\web\public\context-packs
mklink /J apps\web\public\context-packs C:\Drive-semantic\context-packs
```

`rmdir` on a junction removes only the link, **not** the contents of the target.

## What stays in git

- `apps/web/src/lib/contextPackLoader.ts` — loader logic (committed).
- `apps/web/src/lib/contextPackToGraph.ts` — adapter (committed).
- `apps/web/src/components/panel/ContextPackPanel.tsx` — UI (committed).
- `apps/web/public/context-packs/` — **not** committed; it is a generated junction
  bridge to `C:\Drive-semantic\context-packs\`.
- `apps/web/public/context-packs.backup-before-exchange/` — local backup only, also
  not committed.

See `.gitignore`.

## Why this works

- The browser only sees `/context-packs/...`, so the frontend code is unchanged.
- All real files live in **one** authoritative place, `C:\Drive-semantic`, shared
  between Semantic OS (writer) and Knowledge Map AI (reader).
- No HTTP server / API / database is introduced — this is just the filesystem.
