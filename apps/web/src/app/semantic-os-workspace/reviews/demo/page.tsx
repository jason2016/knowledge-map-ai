import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Candidate Detail | Semantic OS Workspace',
  description:
    'Review, approve, reject, or revise one Semantic OS candidate before formal writeback.',
}

// Static prototype only. Mock data, no Obsidian files, no MCP, no database,
// no login, no real writeback, no API calls, no private file paths exposed.

const NAV = [
  { id: 'header', label: 'Candidate' },
  { id: 'source', label: 'Source' },
  { id: 'distilled', label: 'Distilled' },
  { id: 'writeback', label: 'Proposed Writeback' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'risks', label: 'Risks' },
  { id: 'actions', label: 'Review Actions' },
  { id: 'after', label: 'After Approval' },
  { id: 'links', label: 'Related Links' },
  { id: 'boundary', label: 'What this is not' },
]

const CANDIDATE_META = [
  { label: 'Type', value: 'product_decision' },
  { label: 'Status', value: 'needs_review' },
  { label: 'Confidence', value: 'High' },
  { label: 'Source', value: 'Codex Product Design feedback' },
  { label: 'Linked project', value: 'Semantic OS Workspace' },
]

const SOURCE = {
  source: 'Codex Product Design feedback',
  summary:
    'Product Design confirmed that Workspace Home and Query Result Workspace should be separate product objects.',
  sourceType: 'external product design review',
  evidenceQuality: 'high',
}

const DISTILLED = {
  claim:
    'Semantic OS should keep /semantic-os-workspace as the overall status and review home, and use /semantic-os-workspace/queries/:queryId as the focused query result workspace.',
  classification: 'product_decision + product_design_review',
  productArea: 'Semantic OS Workspace v0.1',
  confidence: 'High',
  relatedObjects: [
    'Workspace Home',
    'Query Result Workspace',
    'Review Queue',
    'Agent Task Pack',
    'Action Feedback',
    'Knowledge Map AI',
  ],
}

const WRITEBACK = {
  type: 'candidate-decision',
  target: 'Project Decisions',
  title:
    'Semantic OS Workspace Home and Query Result Workspace separation',
  summary:
    'Confirm that Workspace Home is the global operations page, while Query Result Workspace is a per-query evidence and action page.',
  status: 'Pending human review',
}

const EVIDENCE = [
  {
    title: 'Codex Product Design feedback',
    relevance: 'high',
    confidence: 'high',
    summary:
      'External review confirming the Workspace Home vs Query Result Workspace separation.',
  },
  {
    title: 'Existing Workspace Home prototype',
    relevance: 'high',
    confidence: 'high',
    summary:
      'Already live at /semantic-os-workspace, covers status, reviews and operations.',
  },
  {
    title: 'Query Result Workspace prototype',
    relevance: 'high',
    confidence: 'high',
    summary:
      'Already live at /semantic-os-workspace/queries/demo, covers answer-to-action flow.',
  },
  {
    title: 'Product Design Feedback Loop',
    relevance: 'medium',
    confidence: 'high',
    summary:
      'Defines how external product design feedback returns into Semantic OS as candidates.',
  },
  {
    title: 'Human review approval',
    relevance: 'high',
    confidence: 'high',
    summary:
      'Maintains the candidate-only writeback policy; nothing is formal without human sign-off.',
  },
]

const CHECKLIST = [
  { item: 'Is the source trusted?', checked: true },
  { item: 'Is the candidate clear?', checked: true },
  { item: 'Is evidence sufficient?', checked: true },
  { item: 'Is the writeback target correct?', checked: true },
  { item: 'Does this create scope creep?', checked: false },
  { item: 'Should this remain candidate-decision instead of formal decision?', checked: true },
  { item: 'Should Context Pack generation remain deferred?', checked: false },
]

const RISKS = [
  {
    risk: 'Workspace becomes project management SaaS',
    mitigation:
      'Stay review-centered; defer multi-tenant, auth and ticketing.',
  },
  {
    risk: 'Query Result becomes ChatGPT clone',
    mitigation:
      'Surface evidence, decisions, writeback and agent handoff — not just answer text.',
  },
  {
    risk: 'Candidate approval becomes too automatic',
    mitigation:
      'Keep candidate_only writeback policy; require explicit human review for every candidate.',
  },
  {
    risk: 'Internal architecture leaks into public UI',
    mitigation:
      'Use product-facing labels only; never expose vault folder names or paths.',
  },
  {
    risk: 'Knowledge Map AI becomes mistaken as source of truth',
    mitigation:
      'Frame it as the visualization layer only; keep source of truth in Semantic OS.',
  },
]

const AFTER = [
  'Candidate approved',
  'Project Decisions updated',
  'Workspace Home status updates',
  'Agent Task Pack may be generated',
  'Action Feedback can be captured',
  'Knowledge Map can visualize relationships',
]

const NOT_THIS = [
  'an automatic writeback engine',
  'a file editor',
  'a project management task page',
  'a chat interface',
  'an agent runner',
  'a replacement for human review',
]

const accentRing: Record<string, string> = {
  violet:  'bg-violet-50 text-violet-700 ring-violet-200',
  indigo:  'bg-indigo-50 text-indigo-700 ring-indigo-200',
  sky:     'bg-sky-50 text-sky-700 ring-sky-200',
  amber:   'bg-amber-50 text-amber-700 ring-amber-200',
  blue:    'bg-blue-50 text-blue-700 ring-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rose:    'bg-rose-50 text-rose-700 ring-rose-200',
  slate:   'bg-slate-50 text-slate-700 ring-slate-200',
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

function Btn({
  children,
  variant = 'ghost',
}: {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
}) {
  const base =
    'inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ring-1 transition-colors cursor-default select-none'
  const styles =
    variant === 'primary'
      ? 'bg-violet-600 text-white ring-violet-600/20 hover:bg-violet-700'
      : variant === 'danger'
        ? 'bg-rose-50 text-rose-600 ring-rose-200 hover:bg-rose-100'
        : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
  return <span className={`${base} ${styles}`}>{children}</span>
}

export default function CandidateDetailPage() {
  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-700">
      {/* Left navigation */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <div className="mb-6">
          <a
            href="/semantic-os-workspace"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 hover:text-violet-900"
          >
            <span aria-hidden>←</span>
            Workspace Home
          </a>
          <div className="mt-3 text-sm font-bold text-slate-900">
            Candidate Detail
          </div>
          <div className="text-xs text-slate-400">v0.1</div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={
                i === 0
                  ? 'rounded-md bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700'
                  : 'rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
          Static prototype · mock data. No backend, no MCP, no writeback.
        </div>
      </aside>

      {/* Main scroll area */}
      <main className="h-full flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-12 px-6 py-8">
          {/* 1. Header / Candidate Summary */}
          <header id="header" className="scroll-mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                Current View: Candidate Review
              </span>
              <a
                href="/semantic-os-workspace"
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                <span aria-hidden>←</span>
                Back to Workspace Home
              </a>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Candidate Detail
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Review, approve, reject, or revise one Semantic OS candidate before
              formal writeback.
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-600">
                Candidate
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900">
                Semantic OS Web Workspace v0.1 Candidate Decision
              </p>
              <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                {CANDIDATE_META.map((m) => (
                  <div key={m.label}>
                    <dt className="text-slate-400">{m.label}</dt>
                    <dd className="text-slate-700">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
              Candidate review is the human gate before any formal Semantic OS
              writeback.
            </p>
          </header>

          {/* 2. Source Material */}
          <Section id="source" eyebrow="Where it came from" title="Source Material">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <dl className="grid gap-4 text-xs md:grid-cols-2">
                <div>
                  <dt className="text-slate-400">Source</dt>
                  <dd className="text-slate-700">{SOURCE.source}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Source type</dt>
                  <dd className="text-slate-700">{SOURCE.sourceType}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-slate-400">Summary</dt>
                  <dd className="text-slate-700">{SOURCE.summary}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Evidence quality</dt>
                  <dd>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.emerald}`}>
                      {SOURCE.evidenceQuality}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </Section>

          {/* 3. Distilled Candidate */}
          <Section id="distilled" eyebrow="What Semantic OS distilled" title="Distilled Candidate">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
                Extracted claim
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {DISTILLED.claim}
              </p>
              <dl className="mt-4 grid gap-3 text-xs md:grid-cols-2">
                <div>
                  <dt className="text-slate-400">Classification</dt>
                  <dd className="text-slate-700">{DISTILLED.classification}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Product area</dt>
                  <dd className="text-slate-700">{DISTILLED.productArea}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Confidence</dt>
                  <dd>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.emerald}`}>
                      {DISTILLED.confidence}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Related objects</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {DISTILLED.relatedObjects.map((o) => (
                      <span
                        key={o}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.slate}`}
                      >
                        {o}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Section>

          {/* 4. Proposed Writeback */}
          <Section id="writeback" eyebrow="What is proposed" title="Proposed Writeback">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${accentRing.violet}`}>
                  {WRITEBACK.type}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.amber}`}>
                  Status · {WRITEBACK.status}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                {WRITEBACK.title}
              </h3>
              <dl className="mt-4 grid gap-3 text-xs md:grid-cols-2">
                <div>
                  <dt className="text-slate-400">Suggested target</dt>
                  <dd className="text-slate-700">{WRITEBACK.target}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-slate-400">Writeback summary</dt>
                  <dd className="text-slate-700">{WRITEBACK.summary}</dd>
                </div>
              </dl>
            </div>
          </Section>

          {/* 5. Evidence */}
          <Section id="evidence" eyebrow="Why" title="Evidence">
            <div className="grid gap-4 md:grid-cols-2">
              {EVIDENCE.map((e) => (
                <div
                  key={e.title}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {e.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                        e.relevance === 'high' ? accentRing.violet : accentRing.amber
                      }`}
                    >
                      relevance · {e.relevance}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.emerald}`}>
                      confidence · {e.confidence}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {e.summary}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* 6. Review Checklist */}
          <Section id="checklist" eyebrow="Reviewer gate" title="Review Checklist">
            <ul className="space-y-2">
              {CHECKLIST.map((c) => (
                <li
                  key={c.item}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span
                    aria-hidden
                    className={
                      'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold ring-1 ' +
                      (c.checked
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-amber-50 text-amber-700 ring-amber-200')
                    }
                  >
                    {c.checked ? '✓' : '…'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-700">{c.item}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      {c.checked ? 'Checked' : 'Pending'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* 7. Risks and Mitigations */}
          <Section id="risks" eyebrow="Guardrails" title="Risks &amp; Mitigations">
            <div className="grid gap-4 md:grid-cols-2">
              {RISKS.map((r) => (
                <div
                  key={r.risk}
                  className="rounded-xl border border-rose-200 bg-rose-50/40 p-5"
                >
                  <div className="text-sm font-semibold text-rose-700">{r.risk}</div>
                  <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Mitigation
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">
                    {r.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* 8. Review Actions */}
          <Section id="actions" eyebrow="Review gate" title="Review Actions">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary">Approve Candidate</Btn>
                <Btn variant="danger">Reject Candidate</Btn>
                <Btn>Request Revision</Btn>
                <Btn>Create Candidate Decision</Btn>
                <Btn>Generate Agent Task Pack</Btn>
              </div>
              <p className="mt-4 text-[11px] text-slate-400">
                All actions are mock-only in this prototype. No formal writeback
                runs.
              </p>
            </div>
          </Section>

          {/* 9. After Approval */}
          <Section id="after" eyebrow="What happens next" title="After Approval">
            <ol className="space-y-2">
              {AFTER.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-50 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* 10. Related Links */}
          <Section id="links" eyebrow="Navigate" title="Related Links">
            <div className="flex flex-wrap gap-2">
              <a
                href="/semantic-os-workspace"
                className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
              >
                <span aria-hidden>←</span>
                Back to Workspace Home
              </a>
              <a
                href="/semantic-os-workspace/queries/demo"
                className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
              >
                Open Query Result
                <span aria-hidden>→</span>
              </a>
              <a
                href="/semantic-os-workspace/agent-tasks/demo"
                className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-violet-600/20 hover:bg-violet-700"
              >
                Open Agent Task Pack
                <span aria-hidden>→</span>
              </a>
              <a
                href="/semantic-os-demo"
                className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
              >
                View Knowledge Map
                <span aria-hidden>→</span>
              </a>
            </div>
          </Section>

          {/* 11. What this is not */}
          <Section id="boundary" eyebrow="Boundary" title="What This Page Is Not">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
              <p className="text-sm text-rose-700">This page is not:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {NOT_THIS.map((n) => (
                  <span
                    key={n}
                    className="rounded-md bg-white px-2.5 py-1 text-[11px] text-rose-600 ring-1 ring-rose-200"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-rose-700/80">
                It is a static prototype of a review-gated candidate detail page.
              </p>
            </div>
          </Section>

          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-400">
            Candidate Detail v0.1 — static prototype with mock data. No backend,
            no MCP, no database, no login, no real writeback, no agent API calls.
            For product demonstration only.
          </footer>
        </div>
      </main>
    </div>
  )
}
