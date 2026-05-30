# Local Private Mode — start scripts

> Helpers that flip Knowledge Map AI into **Local Private Mode** and start the
> Next.js dev server with one command. Only meaningful on a machine that has
> Semantic OS writing into `C:\Drive-semantic\context-packs\`.

## Quick start

From the project root (`C:\ClaudeMVP\knowledge-map-ai`) or anywhere:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\local\start-knowledge-map-private.ps1
```

The script is idempotent — re-running it is safe.

## What `start-knowledge-map-private.ps1` does

1. `cd` to `C:\ClaudeMVP\knowledge-map-ai`.
2. Checks that `C:\Drive-semantic\context-packs\index.json` exists.
   Aborts with a clear message if not.
3. Ensures `apps\web\.env.local` contains
   `NEXT_PUBLIC_ENABLE_CONTEXT_PACKS=true` (creates or appends as needed —
   never overwrites other lines).
4. Verifies `apps\web\public\context-packs` is a Windows directory junction
   pointing at `C:\Drive-semantic\context-packs`. If the path does not exist,
   it runs `mklink /J` to create the junction. If a **real directory** is
   already there (not a junction), it leaves it alone and warns — manual
   intervention is required to avoid clobbering anything.
5. `cd` to `apps\web` and runs `npm run dev`.

## What it does NOT do

- Never copies anything out of `C:\Drive-semantic\` into the repo.
- Never deletes or overwrites an existing `public\context-packs\` directory.
- Never modifies the Public Demo Mode default — the safety boundary lives in
  `apps/web/.gitignore`, `apps/web/src/app/page.tsx`, and the docs; this script
  only flips the local `.env.local` flag.
- Never commits or pushes `.env.local`. That file stays gitignored.

## Public Demo Mode reminder

If you want to revert to **Public Demo Mode** (what `map.clawshow.ai` runs):

1. Stop the dev server.
2. Either delete `apps\web\.env.local`, or change the line to
   `NEXT_PUBLIC_ENABLE_CONTEXT_PACKS=false`.
3. Restart `npm run dev` (Next.js only reads `.env.local` at startup).

## Related docs

- [docs/setup/2026-05-30-context-pack-exchange-setup.md](../../docs/setup/2026-05-30-context-pack-exchange-setup.md)
- [docs/mvp/2026-05-30-mvp-v0.1-local-semantic-os-knowledge-map-loop.md](../../docs/mvp/2026-05-30-mvp-v0.1-local-semantic-os-knowledge-map-loop.md)
