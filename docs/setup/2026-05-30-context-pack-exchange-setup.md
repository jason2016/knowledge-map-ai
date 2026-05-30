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

---

## Public Demo Mode vs Local Private Mode

Knowledge Map AI runs in one of two modes, controlled by a single env flag:

| | **Public Demo Mode** *(default)* | **Local Private Mode** |
|---|---|---|
| Env flag | `NEXT_PUBLIC_ENABLE_CONTEXT_PACKS` unset / not `"true"` | `NEXT_PUBLIC_ENABLE_CONTEXT_PACKS=true` |
| Where it runs | GitHub repo, Vercel, `map.clawshow.ai`, any public site | Jason's machine, a customer's private machine / server |
| Reads `/context-packs/index.json`? | **No** | **Yes** |
| Sidebar shows | Accounting Map + Exhibition Map only | Accounting Map + Exhibition Map + **Local Context Packs** from `C:\Drive-semantic` |
| Top-right "Load Neige Rouge" test button | Hidden | Visible |
| Source of truth | Built-in sanitized demo data | `C:\Drive-semantic\context-packs\` |

### Rules

- `map.clawshow.ai` is the **public demo only**. It must run in Public Demo Mode.
- It should only show **Accounting Map** and **Exhibition Map**.
- Real Context Packs stay in `C:\Drive-semantic\` — they never get pushed to
  GitHub or to a public host.
- The GitHub repository must **not** contain any generated private Context Pack
  data (the junction and its backup are gitignored; `.env.local` is gitignored;
  only `.env.local.example` is committed as a template).
- Local / private users opt in by copying `apps/web/.env.local.example` to
  `apps/web/.env.local` (`NEXT_PUBLIC_ENABLE_CONTEXT_PACKS=true`).
- Production public deploys keep `NEXT_PUBLIC_ENABLE_CONTEXT_PACKS` **unset or
  false**.

### How the gate works

- `apps/web/src/app/page.tsx` reads `process.env.NEXT_PUBLIC_ENABLE_CONTEXT_PACKS`
  at render time. If it is not the exact string `"true"`, the page never calls
  `loadContextPackIndex()` and never populates the Context Pack vault — there is
  no fallback that surfaces private pack ids.
- `apps/web/src/components/sidebar/LeftSidebar.tsx` only renders the
  *"Local Context Packs"* sub-label when at least one pack entry is present,
  which by construction only happens in Local Private Mode.

### Quick check

To verify which mode is active:

```bash
# In dev, before npm run dev:
echo $NEXT_PUBLIC_ENABLE_CONTEXT_PACKS   # bash / git-bash
echo $env:NEXT_PUBLIC_ENABLE_CONTEXT_PACKS  # PowerShell
```

Or open the app and look at the sidebar — if "Local Context Packs" appears, you
are in Local Private Mode.
