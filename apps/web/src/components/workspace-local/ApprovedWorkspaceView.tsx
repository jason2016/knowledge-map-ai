'use client'

import {
  type WorkspaceLoadManifest,
  type WorkspaceSummary,
} from '@/types/workspace-load-ready'

interface Props {
  manifest: WorkspaceLoadManifest
  summary: WorkspaceSummary
}

// ── Safe field readers ─────────────────────────────────────────────────
// The loader's WorkspaceSummary type uses index signatures, so each field
// arrives as `unknown`. These helpers narrow defensively so a malformed
// section never throws at render time; instead the offending field simply
// falls back to an empty value and the section still renders.

function asArray(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : []
}
function asString(v: unknown): string | undefined {
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return undefined
}
function asStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === 'string')
    : []
}
function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined
}

// ── Small presentational helpers ───────────────────────────────────────

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
      {children}
    </div>
  )
}

function Chip({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode
  tone?: 'slate' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky'
}) {
  const cls: Record<string, string> = {
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  }
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${cls[tone]}`}
    >
      {children}
    </span>
  )
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-violet-600">
          {eyebrow}
        </div>
        <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function RefList({
  label,
  refs,
}: {
  label: string
  refs: string[]
}) {
  if (refs.length === 0) return null
  return (
    <div className="mt-2 text-[11px] text-slate-500">
      <span className="font-semibold text-slate-400">{label}: </span>
      <span className="break-all font-mono">{refs.join(' · ')}</span>
    </div>
  )
}

// Human-readable metric labels for the small set of fields the fixture
// contract uses. Unknown keys fall back to the raw key name.
const METRIC_LABELS: Record<string, string> = {
  projects_count: 'Projects',
  review_queue_count: 'Review queue',
  approved_candidates_count: 'Approved candidates',
  rejected_candidates_count: 'Rejected candidates',
  action_feedback_count: 'Action feedback',
  open_risks_count: 'Open risks',
  knowledge_map_entries_count: 'Knowledge map entries',
}

const RISK_TONE: Record<string, 'emerald' | 'amber' | 'rose' | 'slate'> = {
  low: 'emerald',
  medium: 'amber',
  high: 'rose',
}

// ──────────────────────────────────────────────────────────────────────
// ApprovedWorkspaceView
//
// Renders the workspace summary returned by the approved loader result.
// It NEVER fetches anything on its own — all data comes from the
// `manifest` and `summary` props handed down by WorkspaceLoadReadyShell
// after the 13 gate conditions passed.
// ──────────────────────────────────────────────────────────────────────
export function ApprovedWorkspaceView({ manifest, summary }: Props) {
  // ── Header / meta row values, read defensively from manifest. ──────
  const exportStatus = asString(manifest?.export?.status) ?? 'unknown'
  const opDecision = asString(manifest?.operator_review?.decision) ?? 'unknown'
  const mode = asString(manifest?.mode) ?? 'unknown'
  const rawFilesExported =
    asNumber(manifest?.source_counts?.raw_files_exported) ?? 0

  // ── Workspace identity. ───────────────────────────────────────────
  const ws = (summary?.workspace ?? {}) as Record<string, unknown>
  const wsName = asString(ws.workspace_name) ?? 'Local Private Workspace'
  const wsId = asString(ws.workspace_id)
  const operatorLabel = asString(ws.operator_label)
  const environment = asString(ws.environment)
  const sourceLabel = asString(ws.source_label)

  // ── Sections. ─────────────────────────────────────────────────────
  const metrics = (summary?.metrics ?? {}) as Record<string, unknown>
  const metricKeys = Object.keys(metrics)

  const projects = asArray(summary?.projects)
  const reviewQueue = asArray(summary?.review_queue)
  const candidateReviews = asArray(summary?.candidate_reviews)
  const actionFeedback = asArray(summary?.action_feedback)
  const knowledgeMapEntries = asArray(summary?.knowledge_map_entries)
  const risks = asArray(summary?.risks)
  const activity = asArray(summary?.activity)

  return (
    // The app's root <body> is `overflow-hidden` (so the homepage can run a
    // full-screen graph). We therefore scroll INSIDE this component so the
    // approved view always reaches its long list of sections on phones and
    // desktop alike.
    <div className="h-full w-full overflow-y-auto bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-5xl space-y-12 px-6 py-10">
        {/* ── Top boundary banner ──────────────────────────────────── */}
        <header className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
            Local Private Data — Approved Summary Export
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">
            LOCAL PRIVATE DATA — APPROVED SUMMARY EXPORT
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
            All 13 gate conditions passed. Rendering the workspace summary
            received from the Semantic OS workspace-load-ready package.
          </p>
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-[11.5px] sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-slate-400">source</dt>
              <dd className="text-slate-700">
                Semantic OS workspace-load-ready package
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">mode</dt>
              <dd className="text-slate-700">{mode}</dd>
            </div>
            <div>
              <dt className="text-slate-400">export status</dt>
              <dd className="text-slate-700">{exportStatus}</dd>
            </div>
            <div>
              <dt className="text-slate-400">operator review</dt>
              <dd className="text-slate-700">{opDecision}</dd>
            </div>
            <div>
              <dt className="text-slate-400">raw files exported</dt>
              <dd className="text-slate-700">{rawFilesExported}</dd>
            </div>
          </dl>
        </header>

        {/* ── 1. Workspace Home identity card ──────────────────────── */}
        <Section
          id="workspace-home"
          eyebrow="Workspace Home"
          title={wsName}
        >
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
              {wsId && (
                <div>
                  <dt className="text-slate-400">workspace_id</dt>
                  <dd className="break-all font-mono text-[11px] text-slate-700">
                    {wsId}
                  </dd>
                </div>
              )}
              {operatorLabel && (
                <div>
                  <dt className="text-slate-400">operator</dt>
                  <dd className="text-slate-700">{operatorLabel}</dd>
                </div>
              )}
              {environment && (
                <div>
                  <dt className="text-slate-400">environment</dt>
                  <dd className="text-slate-700">{environment}</dd>
                </div>
              )}
              {sourceLabel && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <dt className="text-slate-400">source label</dt>
                  <dd className="text-slate-700">{sourceLabel}</dd>
                </div>
              )}
            </dl>
          </div>
        </Section>

        {/* ── 2. Metrics ───────────────────────────────────────────── */}
        <Section id="metrics" eyebrow="At a glance" title="Metrics">
          {metricKeys.length === 0 ? (
            <Empty>No metrics yet.</Empty>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {metricKeys.map((k) => {
                const v = asNumber(metrics[k]) ?? metrics[k]
                return (
                  <div
                    key={k}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="text-2xl font-bold text-slate-900">
                      {typeof v === 'number' || typeof v === 'string'
                        ? String(v)
                        : '—'}
                    </div>
                    <div className="mt-1 text-[11px] leading-tight text-slate-500">
                      {METRIC_LABELS[k] ?? k}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        {/* ── 3. Projects ──────────────────────────────────────────── */}
        <Section id="projects" eyebrow="Workspace" title="Projects">
          {projects.length === 0 ? (
            <Empty>No projects yet.</Empty>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {projects.map((p, i) => {
                const title = asString(p.title) ?? asString(p.project_id) ?? `Project #${i + 1}`
                const status = asString(p.status)
                const summary = asString(p.summary)
                const sourceRefs = asStringArray(p.source_refs)
                return (
                  <article
                    key={asString(p.project_id) ?? i}
                    className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      {status && <Chip tone="violet">{status}</Chip>}
                    </div>
                    {summary && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {summary}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {asNumber(p.decision_count) !== undefined && (
                        <Chip>{`decisions · ${asNumber(p.decision_count)}`}</Chip>
                      )}
                      {asNumber(p.action_count) !== undefined && (
                        <Chip>{`actions · ${asNumber(p.action_count)}`}</Chip>
                      )}
                      {asNumber(p.risk_count) !== undefined && (
                        <Chip>{`risks · ${asNumber(p.risk_count)}`}</Chip>
                      )}
                    </div>
                    <RefList label="source_refs" refs={sourceRefs} />
                  </article>
                )
              })}
            </div>
          )}
        </Section>

        {/* ── 4. Review Queue ──────────────────────────────────────── */}
        <Section id="review-queue" eyebrow="Pending review" title="Review Queue">
          {reviewQueue.length === 0 ? (
            <Empty>No review items yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {reviewQueue.map((r, i) => {
                const title = asString(r.title) ?? asString(r.candidate_id) ?? `Item #${i + 1}`
                const type = asString(r.candidate_type)
                const sourceSummary = asString(r.source_summary)
                const evidenceSummary = asString(r.evidence_summary)
                const writeback = asString(r.proposed_writeback_target)
                const riskLevel = asString(r.risk_level)
                const status = asString(r.status)
                const sourceRefs = asStringArray(r.source_refs)
                return (
                  <li
                    key={asString(r.candidate_id) ?? i}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {type && <Chip tone="violet">{type}</Chip>}
                        {status && <Chip tone="amber">{status}</Chip>}
                        {riskLevel && (
                          <Chip tone={RISK_TONE[riskLevel] ?? 'slate'}>
                            risk · {riskLevel}
                          </Chip>
                        )}
                      </div>
                    </div>
                    {sourceSummary && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Source — </span>
                        {sourceSummary}
                      </p>
                    )}
                    {evidenceSummary && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Evidence — </span>
                        {evidenceSummary}
                      </p>
                    )}
                    {writeback && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">
                          proposed writeback target:{' '}
                        </span>
                        <span className="font-mono text-slate-700">{writeback}</span>
                      </div>
                    )}
                    <RefList label="source_refs" refs={sourceRefs} />
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        {/* ── 5. Candidate Reviews ─────────────────────────────────── */}
        <Section
          id="candidate-reviews"
          eyebrow="Review gate"
          title="Candidate Reviews"
        >
          {candidateReviews.length === 0 ? (
            <Empty>No candidate reviews yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {candidateReviews.map((c, i) => {
                const id = asString(c.candidate_id) ?? `candidate-${i + 1}`
                const title =
                  asString(c.title) ?? asString(c.label) ?? id
                const reviewStatus = asString(c.review_status)
                const decision = asString(c.decision)
                const reviewer = asString(c.reviewer_label)
                const writebackTarget = asString(c.writeback_target)
                const revisionNotes = asString(c.revision_notes)
                const auditRef = asString(c.audit_ref)
                const confidence = asString(c.confidence)
                const evidence = asString(c.evidence)
                const sourceRefs = asStringArray(c.source_refs)
                const suggestedActions = asStringArray(c.suggested_actions)
                return (
                  <li
                    key={id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {reviewStatus && <Chip tone="amber">{reviewStatus}</Chip>}
                        {decision && (
                          <Chip
                            tone={
                              decision === 'approved'
                                ? 'emerald'
                                : decision === 'rejected'
                                  ? 'rose'
                                  : 'slate'
                            }
                          >
                            decision · {decision}
                          </Chip>
                        )}
                        {confidence && <Chip tone="sky">confidence · {confidence}</Chip>}
                      </div>
                    </div>
                    {reviewer && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">reviewer: </span>
                        {reviewer}
                      </div>
                    )}
                    {evidence && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Evidence — </span>
                        {evidence}
                      </p>
                    )}
                    {writebackTarget && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">
                          writeback target:{' '}
                        </span>
                        <span className="font-mono text-slate-700">{writebackTarget}</span>
                      </div>
                    )}
                    {revisionNotes && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Notes — </span>
                        {revisionNotes}
                      </p>
                    )}
                    {auditRef && (
                      <div className="mt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">audit_ref: </span>
                        <span className="font-mono text-slate-700">{auditRef}</span>
                      </div>
                    )}
                    {suggestedActions.length > 0 && (
                      <div className="mt-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Suggested actions
                        </div>
                        <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                          {suggestedActions.map((a) => (
                            <li key={a}>• {a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <RefList label="source_refs" refs={sourceRefs} />
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        {/* ── 6. Action Feedback / Work Result History ─────────────── */}
        <Section
          id="action-feedback"
          eyebrow="Accountable loop"
          title="Action Feedback"
        >
          {actionFeedback.length === 0 ? (
            <Empty>No action feedback yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {actionFeedback.map((f, i) => {
                const title =
                  asString(f.title) ?? asString(f.feedback_id) ?? `Feedback #${i + 1}`
                const status = asString(f.outcome_status)
                const executor = asString(f.executor_label) ?? asString(f.executor_type)
                const attempted = asString(f.attempted_action)
                const result = asString(f.result_summary)
                const lessons = asString(f.lessons_learned)
                const suggestedMemoryUpdate = asString(f.suggested_memory_update)
                const sourceRefs = asStringArray(f.source_refs)
                return (
                  <li
                    key={asString(f.feedback_id) ?? i}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {status && (
                          <Chip
                            tone={
                              status === 'completed'
                                ? 'emerald'
                                : status === 'failed'
                                  ? 'rose'
                                  : 'amber'
                            }
                          >
                            {status}
                          </Chip>
                        )}
                        {executor && <Chip>{executor}</Chip>}
                      </div>
                    </div>
                    {attempted && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Action — </span>
                        {attempted}
                      </p>
                    )}
                    {result && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Result — </span>
                        {result}
                      </p>
                    )}
                    {lessons && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">Lessons — </span>
                        {lessons}
                      </p>
                    )}
                    {suggestedMemoryUpdate && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">
                          suggested memory update:{' '}
                        </span>
                        {suggestedMemoryUpdate}
                      </div>
                    )}
                    <RefList label="source_refs" refs={sourceRefs} />
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        {/* ── 7. Knowledge Map Entry Point ─────────────────────────── */}
        <Section
          id="knowledge-map"
          eyebrow="Visualization layer"
          title="Knowledge Map Entry Points"
        >
          {knowledgeMapEntries.length === 0 ? (
            <Empty>No knowledge map entries yet.</Empty>
          ) : (
            <ul className="space-y-3">
              {knowledgeMapEntries.map((e, i) => {
                const id = asString(e.entry_id) ?? `entry-${i + 1}`
                const title = asString(e.title) ?? id
                const entryType = asString(e.entry_type)
                const summary = asString(e.summary)
                const localViewHint = asString(e.local_view_hint)
                const nodeRefs = asStringArray(e.node_refs)
                const edgeRefs = asStringArray(e.edge_refs)
                return (
                  <li
                    key={id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {entryType && <Chip tone="violet">{entryType}</Chip>}
                        {localViewHint && <Chip tone="sky">{localViewHint}</Chip>}
                      </div>
                    </div>
                    {summary && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {summary}
                      </p>
                    )}
                    <RefList label="node_refs" refs={nodeRefs} />
                    <RefList label="edge_refs" refs={edgeRefs} />
                    <p className="mt-3 text-[10.5px] text-slate-400">
                      Graph rendering is delivered by the /semantic-os-demo
                      visualization layer and is intentionally out of scope for
                      this view.
                    </p>
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        {/* ── 8. Risks ─────────────────────────────────────────────── */}
        <Section id="risks" eyebrow="Guardrails" title="Risks">
          {risks.length === 0 ? (
            <Empty>No risks yet.</Empty>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {risks.map((r, i) => {
                const title = asString(r.title) ?? asString(r.risk_id) ?? `Risk #${i + 1}`
                const level = asString(r.risk_level) ?? ''
                const status = asString(r.status)
                const summary = asString(r.summary)
                const mitigation = asString(r.mitigation)
                const relatedProject = asString(r.related_project_id)
                const sourceRefs = asStringArray(r.source_refs)
                return (
                  <li
                    key={asString(r.risk_id) ?? i}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {level && (
                          <Chip tone={RISK_TONE[level] ?? 'slate'}>
                            level · {level}
                          </Chip>
                        )}
                        {status && <Chip>{status}</Chip>}
                      </div>
                    </div>
                    {summary && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {summary}
                      </p>
                    )}
                    {mitigation && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        <span className="font-semibold text-slate-500">
                          Mitigation —{' '}
                        </span>
                        {mitigation}
                      </p>
                    )}
                    {relatedProject && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">
                          related_project_id:{' '}
                        </span>
                        <span className="font-mono text-slate-700">{relatedProject}</span>
                      </div>
                    )}
                    <RefList label="source_refs" refs={sourceRefs} />
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        {/* ── 9. Activity ──────────────────────────────────────────── */}
        <Section id="activity" eyebrow="Recent" title="Activity">
          {activity.length === 0 ? (
            <Empty>No recent activity yet.</Empty>
          ) : (
            <ul className="space-y-2">
              {activity.map((a, i) => {
                const id = asString(a.activity_id) ?? `activity-${i + 1}`
                const title = asString(a.title) ?? asString(a.activity_type) ?? id
                const type = asString(a.activity_type)
                const ts = asString(a.timestamp)
                const summary = asString(a.summary)
                const relatedType = asString(a.related_entity_type)
                const relatedId = asString(a.related_entity_id)
                return (
                  <li
                    key={id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-slate-900">{title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {type && <Chip tone="violet">{type}</Chip>}
                        {ts && <Chip>{ts}</Chip>}
                      </div>
                    </div>
                    {summary && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {summary}
                      </p>
                    )}
                    {(relatedType || relatedId) && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-400">related: </span>
                        <span className="font-mono text-slate-700">
                          {[relatedType, relatedId].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        <footer className="border-t border-slate-200 pt-6 text-[11px] leading-relaxed text-slate-400">
          Local Web Workspace loading proof — Step 2 approved view. All data
          rendered above is read only from the workspace-load-ready package
          passed by the loader after every gate condition passed. This component
          never fetches independently and never renders anything when the
          loader returns blocked.
        </footer>
      </div>
    </div>
  )
}
