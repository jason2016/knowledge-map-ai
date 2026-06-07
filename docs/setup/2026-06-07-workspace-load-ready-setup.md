# 2026-06-07 — Workspace Load Ready Local Setup

## 1. Purpose

Local setup instructions for the fixture-based Local Web Workspace loading
proof. This document tells an operator how to populate the
`apps/web/public/workspace-load-ready/` directory and enable the
`/semantic-os-workspace/local` route so the approved package renders on
their own machine.

The proof is intentionally **fixture-only**. No real customer data is
involved. No backend, no MCP, no agent runner, no writeback, no Context
Pack generator are touched by this setup.

## 2. Boundary

- The **public demo** at `https://map.clawshow.ai/` must never load
  private workspace data.
- The `workspace-load-ready` package is **local-only**. It must not be
  served from `map.clawshow.ai` or any other public deploy.
- **No real customer data** is read during this step. Use the
  sanitized fixture only.
- **No raw vault access**. The proof never reads vault notes, only the
  two sanitized JSON files in the package.
- **No Context Pack generation** is performed.
- **No deploy is required** for the proof — the entire flow runs in
  the local dev server.

## 3. Required package shape

The Local Web Workspace loader expects exactly two files in the
`workspace-load-ready/` directory, with these names:

```
workspace-load-ready/
├── workspace-summary.private.json
└── export-manifest.json
```

The manifest must reference the summary by filename:
`manifest.export.summary_file === "workspace-summary.private.json"`.

The loader will additionally:
- compute the SHA-256 of the summary bytes,
- require it to match BOTH `manifest.integrity.summary_file_sha256` AND
  `manifest.files[0].sha256`,
- require the 13 declared gate conditions to pass.

## 4. Source fixture package

The sanitized fixture currently lives in the Semantic OS repository at:

```
10_AI_OS/09_AI_System/engineering-docs/schemas/fixtures/workspace-load-ready/
├── workspace-summary.private.json
└── export-manifest.json
```

Only this sanitized package may be copied / junctioned into the Knowledge
Map AI local target. Do not point the junction at any other vault
directory, customer folder, or generated export.

## 5. Local target path

The Knowledge Map AI dev server serves static assets out of
`apps/web/public/`. The Local Web Workspace loader fetches:

- `/workspace-load-ready/export-manifest.json`
- `/workspace-load-ready/workspace-summary.private.json`

Both files therefore have to be reachable at:

```
apps/web/public/workspace-load-ready/
├── workspace-summary.private.json
└── export-manifest.json
```

This directory is **gitignored** (`/public/workspace-load-ready` in
`apps/web/.gitignore`). It must never be committed and must never end up
in a production deploy.

## 6. Setup option A — manual copy

The simplest setup is to copy the two sanitized fixture files directly:

```powershell
# From the Semantic OS repo root, with $SEM_OS pointing at it:
$src = Join-Path $SEM_OS '10_AI_OS\09_AI_System\engineering-docs\schemas\fixtures\workspace-load-ready'
$dst = 'C:\ClaudeMVP\knowledge-map-ai\apps\web\public\workspace-load-ready'

New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item -Path (Join-Path $src 'workspace-summary.private.json') -Destination $dst -Force
Copy-Item -Path (Join-Path $src 'export-manifest.json')           -Destination $dst -Force
```

Only the **sanitized fixture** may be copied. Do **not** copy any real
customer file, any production export, or any raw vault file.

## 7. Setup option B — Windows junction

The same effect can be achieved by creating a Windows directory
junction. This keeps a single source of truth in the Semantic OS repo —
edits to the fixture there propagate to the Knowledge Map AI dev server
without copying. **This block is documentation only and must not be
executed as part of automated setup.** Run it manually only on the
operator's own machine after confirming the source directory is the
sanitized fixture:

```powershell
# Documentation example only — do not run as part of an automated script.
# Replace <SEMANTIC_OS_REPO> with the operator's local clone path.
New-Item -ItemType Junction `
  -Path   "apps/web/public/workspace-load-ready" `
  -Target "<SEMANTIC_OS_REPO>\10_AI_OS\09_AI_System\engineering-docs\schemas\fixtures\workspace-load-ready"
```

The junction must target the same sanitized fixture directory described
in §4. Do not point it elsewhere.

## 8. Enable the local flag

Copy `apps/web/.env.local.example` to `apps/web/.env.local` (the latter
is gitignored). In `.env.local`, set:

```
NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE=true
```

Restart the dev server (`npm run dev` from `apps/web/`). Next.js inlines
`NEXT_PUBLIC_*` flags at build time, so the new value takes effect on
restart.

`NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE` is independent from
`NEXT_PUBLIC_ENABLE_CONTEXT_PACKS`. Toggling one does not affect the
other.

## 9. Expected behavior

| Local state | UI |
|---|---|
| flag `false` or unset | `LOCAL PRIVATE DATA — BLOCKED` refusal with the Public Demo Mode note. **No fetch made.** |
| flag `true`, fixture missing (`/workspace-load-ready/*` returns 404) | `LOCAL PRIVATE DATA — BLOCKED` with the specific fetch / reachability gate failures listed. **No summary data rendered.** |
| flag `true`, fixture valid (manifest + summary present, all 13 gates pass) | `LOCAL PRIVATE DATA — APPROVED SUMMARY EXPORT` banner and the approved Workspace view. |
| flag `true`, invalid manifest / SHA-256 mismatch / not approved by operator | `LOCAL PRIVATE DATA — BLOCKED` with the precise failing gate(s) shown in the checklist. **No summary data rendered.** |

In all cases the blocked / refusal state renders zero summary content.

## 10. Acceptance checklist

Confirm each item locally before declaring the proof done:

- [ ] `/semantic-os-workspace/local` opens (route resolves; no 404).
- [ ] With the flag disabled, `LOCAL PRIVATE DATA — BLOCKED` is shown.
- [ ] With the flag disabled, **no fetch** is made to
      `/workspace-load-ready/*` (verify in DevTools → Network).
- [ ] With the flag enabled but no fixture present, the blocked
      refusal lists the reachability failure.
- [ ] With the flag enabled and the valid sanitized fixture in place,
      the approved view renders and the top banner reads
      **`LOCAL PRIVATE DATA — APPROVED SUMMARY EXPORT`**.
- [ ] Workspace Home identity card renders the fixture's workspace
      name / operator label / environment / source label.
- [ ] Review Queue section renders.
- [ ] Candidate Reviews section renders.
- [ ] Action Feedback section renders.
- [ ] Knowledge Map Entry Points section renders (with `node_refs` /
      `edge_refs` displayed; no actual graph rendering on this page).
- [ ] No Context Pack was generated.
- [ ] No deploy was run.
- [ ] No real customer data was touched.

## 11. Out of scope

The Local Web Workspace loading proof intentionally does **not**
implement, run, or expose:

- MCP servers / MCP clients of any kind.
- An automatic agent runner.
- Real writeback to Semantic OS / Obsidian / any vault.
- A real local export generator (the fixture is hand-produced for the
  proof).
- A raw vault file browser or any file-tree view.
- Customer data export of any kind.
- Private server mode (no auth, no roles, no sessions).
- A public SaaS surface backed by real workspace data.

These belong to later phases and must remain absent from this setup.
