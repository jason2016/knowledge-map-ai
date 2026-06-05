# Deploy — Semantic OS demo pages to stand9 (`map.clawshow.ai`)

- **date:** 2026-06-05
- **commit:** `f1669cf` *(Add Semantic OS public demo page)* — also brings in `b672642 Add Agent Workspace demo page` and every earlier merged commit from `9168ef8..f1669cf`
- **server:** stand9 (`stand9.focusingpro.com`) — confirmed by `hostname` and that DNS for `map.clawshow.ai` resolves to this host. **Not RISE-S.**
- **domain:** https://map.clawshow.ai
- **deployed pages:**
  - `/` — Knowledge Map AI (Accounting / Exhibition demos, 2D / 3D)
  - `/agent-workspace` — new
  - `/semantic-os-demo` — new
- **service:** `knowledge-map-ai.service` (systemd, `User=ubuntu`, `Environment=NODE_ENV=production PORT=3200`, `ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3200`)

## Build result

- Server git head: **`9168ef8` → `f1669cf`** (fast-forward, 19 files changed, +2867 / −12)
- `package.json` / `package-lock.json` unchanged in this delta → `npm install` skipped
- `npm run build` on `/opt/knowledge-map-ai/apps/web` succeeded; route list:
  - `○ /`
  - `○ /_not-found`
  - `○ /agent-workspace`
  - `○ /semantic-os-demo`
- All routes statically prerendered.

## Deployment steps

```bash
# Run from the developer machine over SSH; everything that touched repo files
# was executed as the `ubuntu` user to keep ownership consistent with the
# existing service.

ssh -i ~/.ssh/id_ed25519 root@stand9.focusingpro.com bash <<'EOS'
  sudo -u ubuntu -H bash -c 'cd /opt/knowledge-map-ai && git fetch origin main --quiet'
  sudo -u ubuntu -H bash -c 'cd /opt/knowledge-map-ai && git log --name-only HEAD..origin/main | grep -E "package(-lock)?.json$" | sort -u'   # confirm no dep changes
  sudo -u ubuntu -H bash -c 'cd /opt/knowledge-map-ai && git pull --ff-only origin main'
  sudo -u ubuntu -H bash -c 'cd /opt/knowledge-map-ai/apps/web && npm run build'
  systemctl restart knowledge-map-ai.service
  systemctl is-active knowledge-map-ai.service
EOS
```

No `npm install`, no `nginx -t / reload`, no `certbot`, no edits to systemd or
nginx config — none of those needed changing.

## Validation result

Localhost on stand9 (post-restart):
- `:3200 /                 ` → HTTP 200
- `:3200 /agent-workspace  ` → HTTP 200
- `:3200 /semantic-os-demo ` → HTTP 200

Public HTTPS:
- `https://map.clawshow.ai/                 ` → HTTP 200, SSL verify OK
- `https://map.clawshow.ai/agent-workspace  ` → HTTP 200
- `https://map.clawshow.ai/semantic-os-demo ` → HTTP 200

UX cross-link verification (grep on the served HTML):
- Homepage renders both header pills: **Semantic OS Demo** and **Agent Workspace**.
- `/agent-workspace` links to `/`, `/semantic-os-demo`.
- `/semantic-os-demo` links to `/`, `/agent-workspace`.
- Existing Accounting / Exhibition demos still present on `/` (no change).

## Privacy / security checks

- **Public Demo Mode boundary intact.** On stand9:
  - `apps/web/.env.local` does not exist (so `NEXT_PUBLIC_ENABLE_CONTEXT_PACKS` is unset → Public Demo Mode default).
  - `apps/web/public/context-packs` does not exist (no junction, no real or fake pack files on the server).
- **Grep against the live public HTML of `/agent-workspace` and `/semantic-os-demo`** returns zero matches for `neige`, `focusingpro`, `drive-semantic`, `stand9`, `RISE-S`, `UEG`, `ilci`, `admissions-agent`. No private identifier leaks.
- New pages are pure server components with hard-coded sanitized strings — they do not call `loadContextPackIndex()`, do not read any pack, do not call any agent or external API.
- No secrets, no IPs, no GUIDs in this document or in the deploy steps above (per `prod-server-deploy-safety` memory).

## Services affected / NOT affected

- **Affected:** `knowledge-map-ai.service` only — restarted once. Now `active (running)`, PID changed (`2358815 → 2576937`), still bound to `127.0.0.1:3200`.
- **Untouched and verified still listening on their previous PIDs:**
  - `127.0.0.1:3100` — Dragons Elysees / 龙城获客 (next-server, PID `1145882`).
  - `0.0.0.0:8000`   — python service (PID `2505590`).
- nginx, certbot, systemd unit, WildFly / Java / focusingpro: **not touched**.

## Known issues

- npm on stand9 prints an informational notice about npm `10.8.2 → 11.16.0`. Cosmetic only; no action required.
- `git pull` shows `dubious ownership` when run as `root` (repo is owned by `ubuntu`). Mitigated by running git/npm steps via `sudo -u ubuntu -H bash -c '...'`. No global git config change made.

## Rollback note

If a regression is observed in production:

```bash
ssh -i ~/.ssh/id_ed25519 root@stand9.focusingpro.com bash <<'EOS'
  sudo -u ubuntu -H bash -c 'cd /opt/knowledge-map-ai && git reset --hard 9168ef8'
  sudo -u ubuntu -H bash -c 'cd /opt/knowledge-map-ai/apps/web && npm run build'
  systemctl restart knowledge-map-ai.service
EOS
```

This reverts the working tree to the pre-deploy commit (`9168ef8 feat: 3D Space as default view + relationship-build replay`) and rebuilds. No dependency changes were made, so no `npm install` is needed for rollback either.

The reverse direction (re-apply) is simply `git pull --ff-only origin main && npm run build && systemctl restart knowledge-map-ai.service` as the `ubuntu` user.
