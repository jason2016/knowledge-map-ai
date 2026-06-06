import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agent Task Pack Detail | Semantic OS Workspace',
  description:
    'Controlled handoff package for Codex, Claude, Cursor, or another execution agent.',
}

// Static prototype only. Mock data, no Obsidian files, no MCP, no database,
// no login, no real writeback, no API calls, no private file paths exposed.

const NAV = [
  { id: 'header', label: 'Task Summary' },
  { id: 'goal', label: 'Goal' },
  { id: 'context', label: 'Context' },
  { id: 'sources', label: 'Source References' },
  { id: 'allowed', label: 'Allowed Actions' },
  { id: 'forbidden', label: 'Forbidden Actions' },
  { id: 'outputs', label: 'Expected Outputs' },
  { id: 'success', label: 'Success Criteria' },
  { id: 'handoff', label: 'Execution Handoff' },
  { id: 'feedback', label: 'Feedback Capture' },
  { id: 'links', label: 'Related Links' },
  { id: 'boundary', label: 'What this is not' },
]

const TASK_META = [
  { label: 'Recommended agent', value: 'Codex Product Design' },
  { label: 'Status', value: 'ready_to_send' },
  { label: 'Risk level', value: 'medium' },
  { label: 'Writeback policy', value: 'candidate_only' },
  { label: 'Human review required', value: 'true' },
]

const GOAL =
  'Evaluate the Query Result Workspace layout, evidence hierarchy, action flow, writeback candidate UX, and what not to build.'

const CONTEXT =
  'Semantic OS now has a Workspace Home and Query Result Workspace. The next design question is whether the Query Result page clearly supports evidence-based answers, suggested actions, candidate writeback, and agent handoff without becoming a chat clone or full project management system.'

const SOURCES = [
  {
    title: 'Workspace Home prototype',
    relevance: 'high',
    note: 'Live prototype covering overall status, review queue and project dashboard.',
  },
  {
    title: 'Query Result Workspace prototype',
    relevance: 'high',
    note: 'Live prototype covering answer, evidence, actions, writeback and agent handoff for one query.',
  },
  {
    title: 'Candidate Detail design',
    relevance: 'high',
    note: 'Companion review page for the human gate before any formal writeback.',
  },
  {
    title: 'Codex Product Design feedback',
    relevance: 'medium',
    note: 'External design review confirming the Workspace Home vs Query Result Workspace separation.',
  },
  {
    title: 'Web Workspace candidate decision',
    relevance: 'medium',
    note: 'Operator-view-first stance with review-centered v0.1 scope.',
  },
]

const ALLOWED = [
  'review UX',
  'suggest page map improvements',
  'identify scope risks',
  'improve first demo flow',
  'propose copy improvements',
  'recommend what not to build',
]

const FORBIDDEN = [
  'build MCP',
  'automate formal writeback',
  'create agent marketplace',
  'turn page into chat clone',
  'modify Semantic OS source files directly',
  'change production deployment',
  'expose private file paths',
]

const OUTPUTS = [
  'page map feedback',
  'UX improvements',
  'risk list',
  'v0.1 scope recommendation',
  'improved demo flow',
  'candidate-decision update suggestion if needed',
]

const SUCCESS = [
  'output is actionable',
  'output references evidence',
  'output preserves Semantic OS product boundary',
  'output does not expand into SaaS / agent platform',
  'output can be saved as feedback candidate',
]

const FEEDBACK_FLOW = [
  'Agent output',
  'Inbox',
  'Auto Intake',
  'Reviewed Feedback',
  'Candidate Decision / Next Action',
  'Knowledge Map visualization',
]

const NOT_THIS = [
  'an autonomous agent runner',
  'a plugin marketplace',
  'a deployment trigger',
  'a coding IDE',
  'a chat interface',
  'a replacement for Codex or Claude',
  'a formal writeback engine',
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

export default function AgentTaskPackDetailPage() {
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
            Agent Task Pack Detail
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
          {/* 1. Header / Task Summary */}
          <header id="header" className="scroll-mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                Current View: Agent Handoff
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
              Agent Task Pack Detail
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Controlled handoff package for Codex, Claude, Cursor, or another
              execution agent.
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-600">
                Task
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900">
                Review Query Result Workspace v0.1 page design
              </p>
              <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                {TASK_META.map((m) => (
                  <div key={m.label}>
                    <dt className="text-slate-400">{m.label}</dt>
                    <dd className={m.label === 'Human review required' ? 'text-emerald-600' : 'text-slate-700'}>
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
              Agent Task Packs turn Semantic OS context into controlled,
              reviewable work for external agents.
            </p>
          </header>

          {/* 2. Goal */}
          <Section id="goal" eyebrow="What to do" title="Task Goal">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">{GOAL}</p>
            </div>
          </Section>

          {/* 3. Context Summary */}
          <Section id="context" eyebrow="Why" title="Context Summary">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">{CONTEXT}</p>
            </div>
          </Section>

          {/* 4. Source References */}
          <Section id="sources" eyebrow="What to use" title="Source References">
            <div className="grid gap-4 md:grid-cols-2">
              {SOURCES.map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                        s.relevance === 'high' ? accentRing.violet : accentRing.amber
                      }`}
                    >
                      relevance · {s.relevance}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{s.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-slate-400">
              Product-facing labels only. No internal file paths exposed.
            </p>
          </Section>

          {/* 5. Allowed + 6. Forbidden side-by-side */}
          <div className="grid gap-12 lg:grid-cols-2">
            <Section id="allowed" eyebrow="Permitted" title="Allowed Actions">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
                <ul className="space-y-1.5">
                  {ALLOWED.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-xs text-slate-700">
                      <span
                        aria-hidden
                        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-emerald-100 text-[10px] font-bold text-emerald-700"
                      >
                        ✓
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            <Section id="forbidden" eyebrow="Out of scope" title="Forbidden Actions">
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
                <ul className="space-y-1.5">
                  {FORBIDDEN.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                      <span
                        aria-hidden
                        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-rose-100 text-[10px] font-bold text-rose-700"
                      >
                        ✕
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          </div>

          {/* 7. Expected Outputs */}
          <Section id="outputs" eyebrow="Return shape" title="Expected Outputs">
            <ul className="grid gap-2 sm:grid-cols-2">
              {OUTPUTS.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                  <span className="text-xs leading-relaxed text-slate-700">{o}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 8. Success Criteria */}
          <Section id="success" eyebrow="Quality bar" title="Success Criteria">
            <ul className="space-y-2">
              {SUCCESS.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200"
                  >
                    ✓
                  </span>
                  <span className="text-sm text-slate-700">{s}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 9. Execution Handoff */}
          <Section id="handoff" eyebrow="Send" title="Execution Handoff">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary">Copy Task Pack for Codex</Btn>
                <Btn>Copy Task Pack for Claude</Btn>
                <Btn>Mark as Sent</Btn>
                <Btn>Attach Result</Btn>
                <Btn>Create Action Feedback Candidate</Btn>
              </div>
              <p className="mt-4 text-[11px] text-slate-400">
                All actions are mock-only in this prototype. Nothing is actually
                sent or copied.
              </p>
            </div>
          </Section>

          {/* 10. Feedback Capture */}
          <Section id="feedback" eyebrow="Accountable loop" title="Feedback Capture">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">
                When the external agent returns output, the result should be
                saved as{' '}
                <span className="font-semibold text-slate-900">
                  Action Feedback Candidate
                </span>
                .
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Then reviewed by a human before writeback.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-1.5 text-[11px]">
                {FEEDBACK_FLOW.map((step, i, arr) => (
                  <span key={step} className="inline-flex items-center gap-1.5">
                    <span
                      className={`rounded-md px-2 py-1 font-medium ring-1 ${
                        i === 0
                          ? accentRing.indigo
                          : i === arr.length - 1
                            ? accentRing.sky
                            : accentRing.slate
                      }`}
                    >
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-slate-400" aria-hidden>
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-slate-400">
                Product-facing labels only.
              </p>
            </div>
          </Section>

          {/* 11. Related Links */}
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
                href="/semantic-os-workspace/reviews/demo"
                className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-violet-600/20 hover:bg-violet-700"
              >
                Open Candidate Review
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

          {/* 12. What this is not */}
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
                It is a static prototype of a controlled agent handoff page.
              </p>
            </div>
          </Section>

          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-400">
            Agent Task Pack Detail v0.1 — static prototype with mock data. No
            backend, no MCP, no database, no login, no real writeback, no agent
            API calls. For product demonstration only.
          </footer>
        </div>
      </main>
    </div>
  )
}
