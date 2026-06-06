import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Semantic OS Workspace v0.1 | Knowledge Map AI',
  description:
    'Review-centered workspace for AI-ready context, decisions, actions, feedback, and agent execution. Static prototype with mock data.',
}

// Static prototype only. Mock data, no Obsidian files, no MCP, no database,
// no login, no real writeback, no API calls, no private file paths exposed.

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'review-queue', label: 'Review Queue' },
  { id: 'agent-tasks', label: 'Agent Tasks' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'knowledge-map', label: 'Knowledge Map' },
  { id: 'mcp', label: 'MCP' },
]

const SUMMARY = [
  { label: 'Active Projects', value: 3 },
  { label: 'Pending Reviews', value: 5 },
  { label: 'Agent Task Packs', value: 2 },
  { label: 'Action Feedback Items', value: 4 },
  { label: 'Risks', value: 3 },
  { label: 'Knowledge Map Views', value: 2 },
]

const PROJECTS = [
  {
    name: 'Semantic OS Web Workspace',
    status: 'Candidate Decision',
    statusTone: 'amber',
    nextAction: 'Build v0.1 page map',
    risk: 'Scope creep',
    agent: 'Product Design / Claude Code',
  },
  {
    name: 'Knowledge Map AI',
    status: 'Active',
    statusTone: 'green',
    nextAction: 'Link Context Pack preview',
    risk: 'Do not become full control center',
    agent: 'Claude / Codex',
  },
  {
    name: 'Client Pilot Demo',
    status: 'Preparation',
    statusTone: 'blue',
    nextAction: 'Prepare review-gated workflow demo',
    risk: 'Customer cannot understand raw directories',
    agent: 'Sales / Product Design',
  },
]

const REVIEW_QUEUE = [
  {
    title: 'Intake Candidate',
    type: 'intake',
    confidence: 'High',
    source: 'Project note',
    route: 'Intake Queue → Reviewed Knowledge',
    status: 'Pending',
  },
  {
    title: 'Product Design Feedback',
    type: 'product_design_review',
    confidence: 'High',
    source: 'Codex Product Design',
    route: 'Reviewed Knowledge',
    status: 'Reviewed',
  },
  {
    title: 'Web Workspace Candidate Decision',
    type: 'product_decision',
    confidence: 'Medium',
    source: 'Codex feedback + review',
    route: 'Project Decisions',
    status: 'Candidate',
  },
  {
    title: 'Action Feedback Candidate',
    type: 'action_feedback',
    confidence: 'Medium',
    source: 'Agent execution result',
    route: 'Action Feedback',
    status: 'Pending',
  },
  {
    title: 'Context Pack Candidate',
    type: 'knowledge_map_context',
    confidence: 'Low',
    source: 'Reviewed distillation',
    route: 'Context Packs',
    status: 'Needs Revision',
  },
]

const TASK_PACK = {
  task_id: 'PDFL-2026-06-06-02',
  recommended_agent: 'Codex Product Design',
  goal: 'Evaluate v0.1 page structure, Operator View, Client View, Review Queue, Agent Task Pack UX, and what not to build.',
  success_criteria: [
    'v0.1 page map validated',
    'Operator vs Client split confirmed',
    'Explicit "what not to build" list',
  ],
  context_summary:
    'Semantic OS is an Agent Context and Feedback Layer. It already has Auto Intake, Distillation, and a human Review Gate. Evaluating Web Workspace v0.1.',
  constraints: [
    'No full SaaS',
    'No multi-tenant',
    'No autonomous execution',
    'Do not replace existing tools',
  ],
  expected_outputs: [
    'recommended positioning',
    'v0.1 page map',
    'Operator View structure',
    'first demo flow',
    'what not to build',
  ],
  writeback_policy: 'candidate_only',
  human_review_required: true,
}

const MCP_TOOLS = [
  'search_semantic_os',
  'get_project_context',
  'get_project_dashboard',
  'list_pending_reviews',
  'create_intake_candidate',
  'create_action_feedback_candidate',
  'create_context_pack_candidate',
]

const FEEDBACK = [
  {
    result: 'Product Design feedback processed',
    lesson: 'External agent reviews route cleanly through Auto Intake',
    target: 'Reviewed Knowledge',
    status: 'Reviewed',
  },
  {
    result: 'Auto Intake candidate reviewed',
    lesson: 'Single-file candidate mode keeps review surface small',
    target: 'Reviewed Knowledge',
    status: 'Approved',
  },
  {
    result: 'Web Workspace candidate decision created',
    lesson: 'Candidate-decision keeps direction without premature commitment',
    target: 'Project Decisions',
    status: 'Candidate',
  },
  {
    result: 'Next action: create page map / prototype brief',
    lesson: 'Prototype before formal decision upgrade',
    target: 'Agent Task Pack',
    status: 'Pending',
  },
]

const NOT_YET = [
  'full SaaS',
  'multi-tenant admin',
  'agent marketplace',
  'fully autonomous execution',
  'complex permission system',
  'full client portal',
  'full 3D control center',
  'direct formal writeback automation',
]

// Soft pastel badge tones for the light theme.
const toneClass: Record<string, string> = {
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
}

const statusBadge: Record<string, string> = {
  Pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  Reviewed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Candidate: 'bg-blue-50 text-blue-700 ring-blue-200',
  'Needs Revision': 'bg-violet-50 text-violet-700 ring-violet-200',
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

export default function SemanticOsWorkspacePage() {
  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-700">
      {/* Left navigation */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        <div className="mb-6">
          <div className="text-sm font-bold text-slate-900">Semantic OS Workspace</div>
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
          {/* 1. Hero */}
          <header id="overview" className="scroll-mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                Agent Context and Feedback Layer
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                Review-centered Operator View
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Semantic OS Workspace v0.1
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review-centered workspace for AI-ready context, decisions, actions,
              feedback, and agent execution.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
              Semantic OS turns messy work artifacts into AI-ready context,
              reviewable decisions, agent task packs, and accountable feedback
              loops. It does not replace Codex, Claude, Cursor, VS Code, Obsidian,
              or Knowledge Map AI.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs text-indigo-700">
                <span className="font-semibold">Strategy 1:</span> Semantic OS →
                Agent Task Pack → Claude/Codex
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
                <span className="font-semibold">Strategy 2:</span> Codex/Claude/Cursor
                → Semantic OS MCP
              </div>
            </div>
          </header>

          {/* 2. Summary cards */}
          <Section id="summary" eyebrow="At a glance" title="Operational Summary">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {SUMMARY.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="text-2xl font-bold text-slate-900">{c.value}</div>
                  <div className="mt-1 text-[11px] leading-tight text-slate-500">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 3. Project dashboard */}
          <Section id="projects" eyebrow="Workspace" title="Project Dashboard">
            <div className="grid gap-4 lg:grid-cols-3">
              {PROJECTS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${toneClass[p.statusTone]}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-xs">
                    <div>
                      <dt className="text-slate-400">Next action</dt>
                      <dd className="text-slate-700">{p.nextAction}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Risk</dt>
                      <dd className="text-rose-600">{p.risk}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Recommended agent</dt>
                      <dd className="text-slate-700">{p.agent}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Btn variant="primary">View Dashboard</Btn>
                    <Btn>Generate Agent Task Pack</Btn>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 4. Review queue */}
          <Section
            id="review-queue"
            eyebrow="Core of v0.1"
            title="Review Queue"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Candidate</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Confidence</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">
                      Source
                    </th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">
                      Suggested route
                    </th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REVIEW_QUEUE.map((r) => (
                    <tr key={r.title} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {r.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.type}</td>
                      <td className="px-4 py-3 text-slate-600">{r.confidence}</td>
                      <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                        {r.source}
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-[10px] text-slate-500 lg:table-cell">
                        {r.route}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusBadge[r.status]}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <Btn>Review</Btn>
                          <Btn variant="primary">Approve</Btn>
                          <Btn variant="danger">Reject</Btn>
                          <Btn>Revise</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 5. Candidate detail */}
          <Section id="candidate-detail" eyebrow="Review surface" title="Candidate Detail">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                Semantic OS Web Workspace v0.1 Candidate Decision
              </h3>
              <div className="mt-4 grid gap-6 md:grid-cols-3">
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-slate-400">Source</div>
                    <div className="text-slate-700">Codex Product Design Feedback</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Classification</div>
                    <div className="text-slate-700">
                      research_note + product_decision + product_design_review
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Recommendation</div>
                    <div className="text-slate-700">
                      Build Web Workspace v0.1 as review-centered Operator View first
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-600">Approved</div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    <li>• Operator View first</li>
                    <li>• Candidate Review core</li>
                    <li>• MCP read/context first</li>
                    <li>• Knowledge Map as entry/view only</li>
                  </ul>
                  <div className="mt-4 text-xs font-semibold text-amber-600">Deferred</div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    <li>• Full Client View</li>
                    <li>• Multi-tenant SaaS</li>
                    <li>• Agent Marketplace</li>
                    <li>• Fully autonomous execution</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-rose-600">Rejected</div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    <li>• Direct formal writeback</li>
                    <li>• Full 3D control center in v0.1</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                <Btn variant="primary">Approve Candidate</Btn>
                <Btn variant="danger">Reject Candidate</Btn>
                <Btn>Revise Candidate</Btn>
                <Btn>Create Candidate Decision</Btn>
              </div>
            </div>
          </Section>

          {/* 6. Agent Task Pack preview */}
          <Section id="agent-tasks" eyebrow="Controlled handoff" title="Agent Task Pack Preview">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Review Semantic OS Workspace v0.1 page map
                </h3>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-violet-200">
                  {TASK_PACK.recommended_agent}
                </span>
              </div>
              <dl className="mt-4 grid gap-4 text-xs md:grid-cols-2">
                <div>
                  <dt className="text-slate-400">task_id</dt>
                  <dd className="font-mono text-slate-700">{TASK_PACK.task_id}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">writeback policy</dt>
                  <dd className="text-slate-700">{TASK_PACK.writeback_policy}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-slate-400">goal</dt>
                  <dd className="text-slate-700">{TASK_PACK.goal}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">success criteria</dt>
                  <dd className="text-slate-700">
                    <ul className="space-y-0.5">
                      {TASK_PACK.success_criteria.map((s) => (
                        <li key={s}>• {s}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">constraints</dt>
                  <dd className="text-slate-700">
                    <ul className="space-y-0.5">
                      {TASK_PACK.constraints.map((s) => (
                        <li key={s}>• {s}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-slate-400">context summary</dt>
                  <dd className="text-slate-700">{TASK_PACK.context_summary}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-slate-400">expected outputs</dt>
                  <dd className="text-slate-700">
                    {TASK_PACK.expected_outputs.join(' · ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">human review required</dt>
                  <dd className="text-emerald-600">
                    {String(TASK_PACK.human_review_required)}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                <Btn variant="primary">Copy Prompt for Codex</Btn>
                <Btn>Open in VS Code</Btn>
                <Btn>Save Feedback to Inbox</Btn>
                <Btn>Create Action Feedback Candidate</Btn>
              </div>
            </div>
          </Section>

          {/* 7. MCP / Agent integration */}
          <Section id="mcp" eyebrow="Two integration paths" title="MCP / Agent Integration">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-5">
                <div className="text-sm font-semibold text-indigo-700">
                  Strategy 1 · Semantic OS → Agent Execution
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-600">{`Semantic OS
→ Agent Task Pack
→ VS Code + Claude/Codex
→ Execution Result
→ Action Feedback Candidate
→ Review Gate`}</pre>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                <div className="text-sm font-semibold text-emerald-700">
                  Strategy 2 · Codex/Claude/Cursor → Semantic OS MCP
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-600">{`Codex / Claude / Cursor
→ Semantic OS MCP Server
→ get_project_context
→ list_pending_reviews
→ create_action_feedback_candidate
→ Web Workspace Review`}</pre>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-700">
                Minimum v0.1 MCP tools (read-first)
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {MCP_TOOLS.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[11px] text-slate-600 ring-1 ring-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Section>

          {/* 8. Action feedback */}
          <Section id="feedback" eyebrow="Accountable loop" title="Action Feedback">
            <div className="grid gap-3 md:grid-cols-2">
              {FEEDBACK.map((f) => (
                <div
                  key={f.result}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-slate-900">{f.result}</div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusBadge[f.status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}
                    >
                      {f.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{f.lesson}</p>
                  <div className="mt-2 font-mono text-[10px] text-slate-400">
                    → {f.target}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* 9. Knowledge Map AI entry */}
          <Section id="knowledge-map" eyebrow="Visualization layer" title="Knowledge Map AI">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Role:</span> 2D / 3D
                visualization layer, not source of truth.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="/semantic-os-demo"
                  className="inline-flex items-center rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-violet-600/20 hover:bg-violet-700"
                >
                  View Project Map
                </a>
                <a
                  href="/semantic-os-demo"
                  className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Preview Context Pack
                </a>
                <a
                  href="/semantic-os-demo"
                  className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Open 3D Relationship View
                </a>
              </div>
            </div>
          </Section>

          {/* 10. What not to build */}
          <Section id="boundary" eyebrow="Boundary" title="What Not To Build Yet">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
              <p className="text-sm text-rose-700">
                Keep v0.1 review-centered. Do not build:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {NOT_YET.map((n) => (
                  <span
                    key={n}
                    className="rounded-md bg-white px-2.5 py-1 text-[11px] text-rose-600 ring-1 ring-rose-200"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </Section>

          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-400">
            Semantic OS Workspace v0.1 — static prototype with mock data. No
            backend, no MCP, no database, no login, no real writeback, no agent
            API calls. For product demonstration only.
          </footer>
        </div>
      </main>
    </div>
  )
}
