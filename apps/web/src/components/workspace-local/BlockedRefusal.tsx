'use client'

import { type GateFailure, type GateId, ALL_GATES } from '@/types/workspace-load-ready'

/** Status shown next to each gate row. */
type GateRowStatus = 'pass' | 'fail' | 'blocked'

interface Props {
  /** All failures returned by the loader, plus the synthetic env-disabled gate
   *  failure when the env flag is off. */
  failures: GateFailure[]
  /** When true, the gate evaluation never started because the env flag is
   *  unset. Used to render an extra explanatory note. */
  publicDemoMode?: boolean
}

/**
 * BlockedRefusal — render the rose refusal panel for the Local Web Workspace.
 * Never renders any summary data. Lists every declared gate condition with a
 * pass / fail / blocked badge and includes the loader's failure messages for
 * each failed gate. When the env flag is off, every later gate renders as
 * "blocked" (skipped, not evaluated).
 */
export function BlockedRefusal({ failures, publicDemoMode = false }: Props) {
  // Build a quick lookup of failed gate ids → message.
  const failureById = new Map<GateId, string>()
  for (const f of failures) failureById.set(f.id, f.message)

  // Find the first failing index; everything past that point that wasn't
  // explicitly evaluated is reported as "blocked" rather than "pass".
  let firstFailureIdx = ALL_GATES.length
  for (let i = 0; i < ALL_GATES.length; i++) {
    if (failureById.has(ALL_GATES[i].id)) {
      firstFailureIdx = i
      break
    }
  }

  function rowStatus(idx: number, id: GateId): GateRowStatus {
    if (failureById.has(id)) return 'fail'
    if (idx > firstFailureIdx) return 'blocked'
    return 'pass'
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Top label per integration contract */}
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-rose-700">
            Local Private Data — Blocked
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-rose-700">
            LOCAL PRIVATE DATA — BLOCKED
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-rose-700/90">
            Refusing to render Local Private Workspace. All gate conditions must
            pass.
          </p>
          {publicDemoMode && (
            <p className="mt-3 text-sm leading-relaxed text-rose-700/90">
              <span className="font-semibold">Public Demo Mode —</span> Local
              Private Workspace disabled. No fetch was attempted. To enable
              locally, set{' '}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] text-rose-700 ring-1 ring-rose-200">
                NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE=true
              </code>{' '}
              in a private .env.local on the operator&rsquo;s machine.
            </p>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              Gate checklist
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Why this is blocked
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              No private workspace data is rendered while any of these
              conditions does not pass.
            </p>
          </div>

          <ul className="divide-y divide-slate-100">
            {ALL_GATES.map((gate, idx) => {
              const status = rowStatus(idx, gate.id)
              const message = failureById.get(gate.id)
              const badge = (() => {
                switch (status) {
                  case 'pass':
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                        Pass
                      </span>
                    )
                  case 'fail':
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200">
                        Fail
                      </span>
                    )
                  case 'blocked':
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200">
                        Blocked
                      </span>
                    )
                }
              })()
              return (
                <li
                  key={gate.id}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-900">
                      {idx + 1}. {gate.label}
                    </div>
                    {message && (
                      <div
                        className="mt-1 break-all font-mono text-[11px] leading-snug text-rose-700"
                        title="Loader failure message — contains only field labels and values from the manifest/summary, never private summary data."
                      >
                        {message}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 pt-0.5">{badge}</div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-6 text-[11px] leading-relaxed text-slate-500">
          Source: Semantic OS workspace-load-ready package. Public Demo Mode
          must remain default-off. This panel intentionally never renders
          workspace summary content.
        </div>
      </div>
    </div>
  )
}
