'use client'

import { useEffect, useState } from 'react'
import {
  type GateFailure,
  type WorkspaceLoadResult,
} from '@/types/workspace-load-ready'
import { loadWorkspaceLoadReady } from '@/lib/workspaceLoadReadyLoader'
import { ApprovedWorkspaceView } from './ApprovedWorkspaceView'
import { BlockedRefusal } from './BlockedRefusal'

/** Internal UI state machine for this shell. */
type ShellState =
  | { kind: 'env_disabled' }
  | { kind: 'loading' }
  | { kind: 'blocked'; failures: GateFailure[] }
  | { kind: 'approved'; result: Extract<WorkspaceLoadResult, { status: 'approved' }> }

/**
 * Local Web Workspace shell — orchestrates the loading gate.
 *
 * On mount:
 *   - If NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE !== "true" the shell sets the
 *     env_disabled state and does not call fetch.
 *   - Otherwise it calls the workspaceLoadReadyLoader.
 *
 * The approved path in step 1 intentionally renders a placeholder only;
 * step 2 will add ApprovedWorkspaceView. The blocked path renders the
 * full BlockedRefusal panel and never exposes summary data.
 */
export function WorkspaceLoadReadyShell() {
  const [state, setState] = useState<ShellState>({ kind: 'loading' })

  useEffect(() => {
    // Read the env flag once on mount. NEXT_PUBLIC_* values are inlined by
    // Next.js at build time so this is safe in a client component.
    const enabled = process.env.NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE === 'true'

    if (!enabled) {
      // Public Demo Mode: do NOT fetch the private package. Render refusal.
      setState({ kind: 'env_disabled' })
      return
    }

    let cancelled = false
    loadWorkspaceLoadReady()
      .then((result) => {
        if (cancelled) return
        if (result.status === 'approved') {
          setState({ kind: 'approved', result })
        } else {
          setState({ kind: 'blocked', failures: result.failures })
        }
      })
      .catch((err) => {
        if (cancelled) return
        // Treat any unexpected throw as a blocked state so we never silently
        // fall through to rendering private data.
        setState({
          kind: 'blocked',
          failures: [
            {
              id: 'manifest.reachable',
              severity: 'blocking',
              message: `Loader threw: ${
                err instanceof Error ? err.message : String(err)
              }`,
            },
          ],
        })
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state.kind === 'env_disabled') {
    return (
      <BlockedRefusal
        publicDemoMode
        failures={[
          {
            id: 'env.enabled',
            severity: 'blocking',
            message:
              'NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE is not "true". No fetch attempted.',
          },
        ]}
      />
    )
  }

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen w-full bg-slate-50 text-slate-700">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-violet-600">
              Local Private Workspace
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Verifying workspace-load-ready package…
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Fetching the manifest and summary, computing SHA-256, and
              evaluating all gate conditions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (state.kind === 'blocked') {
    return <BlockedRefusal failures={state.failures} />
  }

  // Approved — render the full workspace summary view. ApprovedWorkspaceView
  // receives the verified manifest + summary and never fetches anything on
  // its own; if the loader returned `blocked` we would never reach this
  // branch, so private data never leaks to the blocked state.
  return (
    <ApprovedWorkspaceView
      manifest={state.result.manifest}
      summary={state.result.summary}
    />
  )
}
