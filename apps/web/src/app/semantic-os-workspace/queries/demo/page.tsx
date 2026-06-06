import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Query Result Workspace | Semantic OS',
  description:
    'Focused answer, evidence, actions, writeback, and agent handoff for one Semantic OS query.',
}

// Static prototype only. Mock data, no Obsidian files, no MCP, no database,
// no login, no real writeback, no API calls, no private file paths exposed.

const NAV = [
  { id: 'query', label: 'Query' },
  { id: 'answer', label: 'Answer' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'actions', label: 'Actions' },
  { id: 'risks', label: 'Risks' },
  { id: 'writeback', label: 'Writeback' },
  { id: 'task-pack', label: 'Agent Task Pack' },
  { id: 'context-pack', label: 'Context Pack' },
  { id: 'knowledge-map', label: 'Knowledge Map' },
  { id: 'boundary', label: 'What this is not' },
]

const QUERY_QUESTION =
  'What are the next actions for Semantic OS Workspace v0.1?'

const QUERY_META = [
  { label: 'Query type', value: 'action_planning' },
  { label: 'Confidence', value: 'High' },
  {
    label: 'Coverage',
    value: 'product decision + product design feedback + prototype status',
  },
  { label: 'Linked project', value: 'Semantic OS Workspace' },
]

const ANSWER = `Semantic OS should keep /semantic-os-workspace as the overall status and review home, then add /semantic-os-workspace/queries/:queryId as a focused evidence and action workspace. The next action is to update the Home hierarchy, add Recent Queries, and prototype a Query Result page before building MCP or real writeback.`

const EVIDENCE = [
  {
    title: 'Codex Product Design feedback',
    type: 'product design review',
    relevance: 'high',
    confidence: 'high',
    summary:
      'Confirmed the distinction between Workspace Home and Query Result Workspace.',
  },
  {
    title: 'Web Workspace candidate decision',
    type: 'candidate decision',
    relevance: 'high',
    confidence: 'high',
    summary:
      'Web Workspace v0.1 should be review-centered and Operator View first.',
  },
  {
    title: 'Product Design Feedback Loop',
    type: 'workflow',
    relevance: 'medium',
    confidence: 'high',
    summary:
      'Defines how external Product Design feedback returns into Semantic OS.',
  },
  {
    title: 'Current static prototype route',
    type: 'deployed prototype',
    relevance: 'high',
    confidence: 'high',
    summary:
      'Workspace Home is already live and reachable from the homepage.',
  },
]

const DECISIONS = [
  'Workspace Home and Query Result Workspace should be separate',
  'Web Workspace v0.1 should be review-centered',
  'Operator View first, Client View later',
  'MCP should be read / context first',
  'Knowledge Map AI should remain visualization entry, not source of truth',
]

const ACTIONS = [
  {
    title: 'Update Workspace Home hierarchy',
    priority: 'P0',
  },
  {
    title: 'Add Recent Queries module',
    priority: 'P0',
  },
  {
    title: 'Create Query Result demo page',
    priority: 'P0',
  },
  {
    title: 'Design Candidate Detail route',
    priority: 'P1',
  },
  {
    title: 'Keep MCP compact on Home',
    priority: 'P1',
  },
  {
    title: 'Keep Knowledge Map AI as entry / view',
    priority: 'P1',
  },
  {
    title: 'Do not build SaaS or agent marketplace yet',
    priority: 'P2',
  },
]

const RISKS = [
  {
    risk: 'Home becomes overcrowded',
    mitigation:
      'Keep Home compact; push detail into Query Result Workspace pages.',
  },
  {
    risk: 'Query page becomes ChatGPT clone',
    mitigation:
      'Surface evidence, decisions, writeback, and agent handoff — not just answer text.',
  },
  {
    risk: 'Workspace becomes project management SaaS',
    mitigation:
      'Stay review-centered; defer multi-tenant, auth, and ticketing.',
  },
  {
    risk: 'MCP becomes too technical',
    mitigation:
      'Read-first MCP tools only; show as a small compact strip on Home.',
  },
  {
    risk: 'Knowledge Map AI becomes mistaken as source of truth',
    mitigation:
      'Frame it as the visualization layer only; keep source of truth in Semantic OS.',
  },
  {
    risk: 'Agent Task Pack becomes automation platform too early',
    mitigation:
      'Keep candidate_only writeback; require human review for every pack.',
  },
]

const WRITEBACK = {
  type: 'candidate-decision update',
  target: 'Project Decisions',
  summary:
    'Confirm the separation between Workspace Home and Query Result Workspace.',
  status: 'Needs human review',
}

const TASK_PACK = {
  task: 'Review Query Result Workspace v0.1 page design',
  recommended_agent: 'Codex Product Design',
  goal: 'Evaluate the Query Result Workspace layout, evidence hierarchy, action flow, writeback candidate UX, and what not to build.',
  allowed: [
    'review UX',
    'suggest page map',
    'identify scope risks',
    'improve first demo flow',
  ],
  forbidden: [
    'build MCP',
    'automate writeback',
    'turn page into chat clone',
    'create agent marketplace',
    'modify Semantic OS source files directly',
  ],
  expected_outputs: [
    'page map feedback',
    'UX improvements',
    'risk list',
    'v0.1 scope recommendation',
  ],
  writeback_policy: 'candidate_only',
  human_review_required: true,
}

// Static graph nodes positioned for the Context Pack preview SVG.
const GRAPH_NODES = [
  { id: 'home',     label: 'Workspace Home',        x: 130, y: 200, accent: 'violet'  },
  { id: 'query',    label: 'Query Result Workspace', x: 360, y: 200, accent: 'indigo' },
  { id: 'map',      label: 'Knowledge Map AI',       x: 590, y: 200, accent: 'sky'    },
  { id: 'review',   label: 'Review Queue',           x: 360, y:  60, accent: 'amber'  },
  { id: 'decision', label: 'Candidate Decision',     x: 540, y: 350, accent: 'blue'   },
  { id: 'task',     label: 'Agent Task Pack',        x: 360, y: 350, accent: 'violet' },
  { id: 'feedback', label: 'Action Feedback',        x: 180, y: 350, accent: 'emerald'},
]

const GRAPH_EDGES = [
  { from: 'home',     to: 'query',    label: 'query_generates_answer' },
  { from: 'query',    to: 'review',   label: 'answer_uses_evidence' },
  { from: 'query',    to: 'decision', label: 'answer_suggests_action' },
  { from: 'decision', to: 'task',     label: 'action_generates_task_pack' },
  { from: 'task',     to: 'feedback', label: 'result_creates_feedback' },
  { from: 'feedback', to: 'home',     label: 'feedback_updates_semantic_os' },
  { from: 'query',    to: 'map',      label: 'context_pack_opens_knowledge_map' },
]

const NOT_THIS = [
  'a chat replacement',
  'a project management board',
  'an autonomous agent runner',
  'a formal writeback engine',
  'a full Knowledge Map control center',
  'a real MCP interface',
]

// Soft pastel badge tones.
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

const accentNode: Record<string, { fill: string; stroke: string; text: string }> = {
  violet:  { fill: '#f5f3ff', stroke: '#a78bfa', text: '#5b21b6' },
  indigo:  { fill: '#eef2ff', stroke: '#818cf8', text: '#3730a3' },
  sky:     { fill: '#f0f9ff', stroke: '#7dd3fc', text: '#075985' },
  amber:   { fill: '#fffbeb', stroke: '#fcd34d', text: '#92400e' },
  blue:    { fill: '#eff6ff', stroke: '#93c5fd', text: '#1e40af' },
  emerald: { fill: '#ecfdf5', stroke: '#6ee7b7', text: '#065f46' },
}

const priorityBadge: Record<string, string> = {
  P0: 'bg-rose-50 text-rose-700 ring-rose-200',
  P1: 'bg-amber-50 text-amber-700 ring-amber-200',
  P2: 'bg-sky-50 text-sky-700 ring-sky-200',
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

export default function QueryResultWorkspacePage() {
  const nodeById = Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n]))
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
            Query Result Workspace
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
          {/* 1. Header / Query Summary */}
          <header id="query" className="scroll-mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                Current View: Query Result Workspace
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
              Query Result Workspace
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Focused answer, evidence, actions, writeback, and agent handoff for
              one Semantic OS query.
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-600">
                Query
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {QUERY_QUESTION}
              </p>
              <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                {QUERY_META.map((m) => (
                  <div key={m.label}>
                    <dt className="text-slate-400">{m.label}</dt>
                    <dd className="text-slate-700">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
              This page is generated after a Semantic OS query. It turns an answer
              into evidence, actions, writeback candidates, and agent handoff.
            </p>
          </header>

          {/* 2. Human-readable Answer */}
          <Section id="answer" eyebrow="Answer" title="Human-readable Answer">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-700">{ANSWER}</p>
            </div>
          </Section>

          {/* 3. Evidence */}
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
                        e.relevance === 'high'
                          ? accentRing.violet
                          : accentRing.amber
                      }`}
                    >
                      relevance · {e.relevance}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.slate}`}>
                      {e.type}
                    </span>
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

          {/* 4. Related Decisions */}
          <Section id="decisions" eyebrow="What was decided" title="Related Decisions">
            <ul className="grid gap-2 sm:grid-cols-2">
              {DECISIONS.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                  <span className="text-xs leading-relaxed text-slate-700">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 5. Related Actions */}
          <Section id="actions" eyebrow="What to do" title="Related Actions">
            <ul className="space-y-2">
              {ACTIONS.map((a) => (
                <li
                  key={a.title}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${priorityBadge[a.priority]}`}
                    >
                      {a.priority}
                    </span>
                    <span className="text-sm text-slate-700">{a.title}</span>
                  </div>
                  <Btn>Open</Btn>
                </li>
              ))}
            </ul>
          </Section>

          {/* 6. Risks */}
          <Section id="risks" eyebrow="Guardrails" title="Risks &amp; Mitigations">
            <div className="grid gap-4 md:grid-cols-2">
              {RISKS.map((r) => (
                <div
                  key={r.risk}
                  className="rounded-xl border border-rose-200 bg-rose-50/40 p-5"
                >
                  <div className="text-sm font-semibold text-rose-700">
                    {r.risk}
                  </div>
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

          {/* 7. Suggested Writeback */}
          <Section id="writeback" eyebrow="Candidate update" title="Suggested Writeback">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${accentRing.violet}`}>
                  {WRITEBACK.type}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${accentRing.amber}`}>
                  Status · {WRITEBACK.status}
                </span>
              </div>
              <dl className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div>
                  <dt className="text-slate-400">Suggested target</dt>
                  <dd className="text-slate-700">{WRITEBACK.target}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Summary</dt>
                  <dd className="text-slate-700">{WRITEBACK.summary}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                <a
                  href="/semantic-os-workspace/reviews/demo"
                  className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-violet-600/20 transition-colors hover:bg-violet-700"
                >
                  Open Candidate Review
                  <span aria-hidden>→</span>
                </a>
                <Btn>Create Writeback Candidate</Btn>
                <Btn variant="danger">Reject Writeback</Btn>
                <Btn>Revise</Btn>
              </div>
            </div>
          </Section>

          {/* 8. Agent Task Pack Suggestion */}
          <Section
            id="task-pack"
            eyebrow="Controlled handoff"
            title="Agent Task Pack Suggestion"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {TASK_PACK.task}
                </h3>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-200">
                  {TASK_PACK.recommended_agent}
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-500">Goal — </span>
                {TASK_PACK.goal}
              </p>
              <div className="mt-5 grid gap-4 text-xs md:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                    Allowed actions
                  </div>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    {TASK_PACK.allowed.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
                    Forbidden actions
                  </div>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    {TASK_PACK.forbidden.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Expected outputs
                  </div>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    {TASK_PACK.expected_outputs.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-slate-400">writeback policy</div>
                    <div className="text-slate-700">
                      {TASK_PACK.writeback_policy}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">human review required</div>
                    <div className="text-emerald-600">
                      {String(TASK_PACK.human_review_required)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                <a
                  href="/semantic-os-workspace/agent-tasks/demo"
                  className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-violet-600/20 transition-colors hover:bg-violet-700"
                >
                  Open Agent Task Pack
                  <span aria-hidden>→</span>
                </a>
                <Btn>Copy Task Pack</Btn>
                <Btn>Mark as Sent</Btn>
                <Btn>Attach Result</Btn>
              </div>
            </div>
          </Section>

          {/* 9. Context Pack Preview */}
          <Section id="context-pack" eyebrow="Relationships" title="Context Pack Preview">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 720 420"
                  className="block w-full"
                  role="img"
                  aria-label="Context Pack relationship preview"
                >
                  <defs>
                    <marker
                      id="cp-arrow"
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L6,3 L0,6 z" fill="#94a3b8" />
                    </marker>
                  </defs>
                  {/* Edges */}
                  {GRAPH_EDGES.map((e, i) => {
                    const a = nodeById[e.from]
                    const b = nodeById[e.to]
                    if (!a || !b) return null
                    const midX = (a.x + b.x) / 2
                    const midY = (a.y + b.y) / 2 - 6
                    return (
                      <g key={`${e.from}-${e.to}-${i}`}>
                        <line
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          markerEnd="url(#cp-arrow)"
                        />
                        <text
                          x={midX}
                          y={midY}
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="ui-monospace, SFMono-Regular, monospace"
                          fill="#64748b"
                        >
                          {e.label}
                        </text>
                      </g>
                    )
                  })}
                  {/* Nodes */}
                  {GRAPH_NODES.map((n) => {
                    const c = accentNode[n.accent]
                    const w = Math.max(120, n.label.length * 7)
                    return (
                      <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                        <rect
                          x={-w / 2}
                          y={-18}
                          width={w}
                          height={36}
                          rx={10}
                          fill={c.fill}
                          stroke={c.stroke}
                          strokeWidth="1.5"
                        />
                        <text
                          x={0}
                          y={4}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="600"
                          fill={c.text}
                        >
                          {n.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Lightweight static preview. The full visualization lives on the
                Knowledge Map AI page.
              </p>
            </div>
          </Section>

          {/* 10. Knowledge Map */}
          <Section id="knowledge-map" eyebrow="Visualization layer" title="Knowledge Map AI">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-slate-600">
                Knowledge Map AI visualizes the relationship between the query,
                evidence, decisions, actions, feedback, and risks. It does not own
                the source of truth.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="/semantic-os-demo"
                  className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-violet-600/20 hover:bg-violet-700"
                >
                  View Relationship Map
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="/semantic-os-demo"
                  className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Open 3D Context View
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="/semantic-os-workspace"
                  className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Back to Workspace Home
                </a>
              </div>
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
                It is a static prototype of a query-to-action workspace.
              </p>
            </div>
          </Section>

          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-400">
            Query Result Workspace v0.1 — static prototype with mock data. No
            backend, no MCP, no database, no login, no real writeback, no agent
            API calls. For product demonstration only.
          </footer>
        </div>
      </main>
    </div>
  )
}
