import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Brain,
  Network,
  ClipboardList,
  Bot,
  RefreshCcw,
  Workflow,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader,
  Eye,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Agent Workspace | Semantic OS + Knowledge Map AI',
  description:
    'A simulated execution layer showing how Semantic OS can guide AI agents from knowledge to planning, execution, feedback and continuous learning.',
}

// All content on this page is a sanitized, static simulation. It does not load
// /context-packs/index.json, does not read C:\Drive-semantic, does not call any
// agent or external service, and does not depend on Local Private Mode.

const PIPELINE = [
  { title: 'Semantic OS', sub: 'Knowledge Layer' },
  { title: 'Knowledge Map AI', sub: 'Visualization Layer' },
  { title: 'Planning Layer', sub: 'Context Pack' },
  { title: 'Execution Agent Layer', sub: 'Agents / Tools / Tasks' },
  { title: 'Action Feedback', sub: 'Results / Lessons / Playbooks' },
  { title: 'Semantic OS', sub: 'Learning Loop' },
]

const LAYERS = [
  {
    n: 1,
    title: 'Knowledge Layer',
    binds: 'Semantic OS',
    icon: Brain,
    accent: 'from-indigo-500/30 to-indigo-500/0 ring-indigo-400/30',
    duties: ['Capture', 'Distill', 'Structure', 'Ontology', 'Memory', 'Playbooks', 'Rules'],
    line: 'Semantic OS turns raw business records into structured operational memory.',
  },
  {
    n: 2,
    title: 'Visualization Layer',
    binds: 'Knowledge Map AI',
    icon: Network,
    accent: 'from-cyan-500/30 to-cyan-500/0 ring-cyan-400/30',
    duties: ['2D Graph', '3D Graph', 'Causality', 'Projection', 'Relationships'],
    line: 'Knowledge Map AI helps users see relationships, causes, dependencies and project context.',
  },
  {
    n: 3,
    title: 'Planning Layer',
    binds: 'Context Pack',
    icon: ClipboardList,
    accent: 'from-amber-500/30 to-amber-500/0 ring-amber-400/30',
    duties: ['Query', 'Analysis', 'Task Decomposition', 'Action Suggestions', 'Future Plan'],
    line: 'Context Packs convert knowledge into clean plans and action candidates.',
  },
  {
    n: 4,
    title: 'Execution Agent Layer',
    binds: 'AI Agents / Skills / Tools',
    icon: Bot,
    accent: 'from-fuchsia-500/30 to-fuchsia-500/0 ring-fuchsia-400/30',
    duties: ['Execute tasks', 'Call tools', 'Generate outputs', 'Validate results'],
    examples: ['SEO Agent', 'Website Agent', 'Email Agent', 'Sales Agent', 'Research Agent', 'Support Agent'],
    line: 'Agents execute tasks based on structured knowledge and planned actions.',
  },
  {
    n: 5,
    title: 'Feedback Layer',
    binds: 'Action Feedback',
    icon: RefreshCcw,
    accent: 'from-emerald-500/30 to-emerald-500/0 ring-emerald-400/30',
    duties: ['Record results', 'Capture lessons', 'Update rules', 'Update playbooks', 'Write back to Semantic OS'],
    line: 'Every result becomes new memory for the next cycle.',
  },
] as const

const AGENT_STATUS = [
  { name: 'SEO Agent', state: 'running' as const },
  { name: 'Website Agent', state: 'completed' as const },
  { name: 'Email Agent', state: 'running' as const },
  { name: 'Sales Agent', state: 'waiting' as const },
  { name: 'Research Agent', state: 'completed' as const },
  { name: 'Support Agent', state: 'review' as const },
]

function StatusBadge({ state }: { state: 'running' | 'completed' | 'waiting' | 'review' }) {
  const cfg = {
    running:   { label: 'running',   tone: 'bg-cyan-500/15 text-cyan-300 ring-cyan-400/30',     Icon: Loader },
    completed: { label: 'completed', tone: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30', Icon: CheckCircle2 },
    waiting:   { label: 'waiting',   tone: 'bg-slate-500/15 text-slate-300 ring-slate-400/30', Icon: Clock },
    review:    { label: 'review',    tone: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',  Icon: Eye },
  }[state]
  const { Icon, label, tone } = cfg
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${tone}`}
    >
      <Icon size={11} className={state === 'running' ? 'animate-spin' : ''} />
      {label}
    </span>
  )
}

export default function AgentWorkspacePage() {
  return (
    <div
      className="h-full overflow-y-auto text-slate-200"
      style={{
        background:
          'radial-gradient(ellipse at 50% -10%, #1e293b 0%, #0f172a 45%, #0b1120 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10 sm:mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span aria-hidden>←</span>
            <span>Knowledge Map AI</span>
          </Link>
          <span className="text-[11px] uppercase tracking-widest text-slate-500">
            by ClawShow AI
          </span>
        </div>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <header className="mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 ring-1 ring-indigo-400/30 px-3 py-1 text-[11px] uppercase tracking-widest text-indigo-300 mb-5">
            <Sparkles size={12} />
            Concept demo · simulated
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
            Agent Workspace
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl">
            From structured knowledge to AI execution and feedback.
          </p>
          <p className="mt-6 text-[13px] sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            A simulated execution layer showing how Semantic OS can guide AI agents
            from goals to actions, results and feedback.
          </p>
        </header>

        {/* ── Architecture pipeline ───────────────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-5">
            The full loop
          </h2>
          <ol className="space-y-2">
            {PIPELINE.map((step, i) => (
              <li
                key={i}
                className="rounded-xl bg-slate-900/60 ring-1 ring-slate-800 px-4 py-3 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <div className="text-[13px] sm:text-sm font-medium text-white">{step.title}</div>
                  <div className="text-[11px] text-slate-400">{step.sub}</div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <span aria-hidden className="text-slate-600 text-lg">↓</span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl bg-slate-900/40 ring-1 ring-slate-800 p-5 sm:p-6 text-[13px] sm:text-sm leading-relaxed text-slate-300 space-y-1">
            <p>Semantic OS captures and structures knowledge.</p>
            <p>Knowledge Map AI helps humans understand it.</p>
            <p>Execution Agents turn it into action.</p>
            <p>Action Feedback writes results back into long-term memory.</p>
          </div>
        </section>

        {/* ── Five-layer model ────────────────────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Five-layer Human-AI Operating Architecture
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            From memory to motion. Each layer has a single, clear job.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LAYERS.map((L) => {
              const Icon = L.icon
              return (
                <div
                  key={L.n}
                  className={`relative rounded-2xl bg-gradient-to-b ${L.accent} bg-slate-900/60 ring-1 p-5 flex flex-col`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 ring-1 ring-slate-700 text-[12px] font-semibold text-slate-300">
                      {L.n}
                    </span>
                    <Icon size={16} className="text-slate-300" />
                  </div>
                  <div className="text-[15px] font-semibold text-white">{L.title}</div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 mt-0.5">
                    {L.binds}
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {L.duties.map((d) => (
                      <li
                        key={d}
                        className="text-[11px] rounded-md bg-slate-800/60 ring-1 ring-slate-700/70 px-1.5 py-0.5 text-slate-300"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                  {'examples' in L && L.examples && (
                    <div className="mt-3">
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1.5">
                        Example agents
                      </div>
                      <ul className="flex flex-wrap gap-1.5">
                        {L.examples.map((e) => (
                          <li
                            key={e}
                            className="text-[11px] rounded-md bg-fuchsia-500/10 ring-1 ring-fuchsia-400/30 px-1.5 py-0.5 text-fuchsia-200"
                          >
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="mt-4 text-[12.5px] leading-relaxed text-slate-300">{L.line}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Example workflow ────────────────────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Example Workflow: Help a local restaurant grow online orders
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            A sanitized walkthrough — no real customer data, no real agent calls.
          </p>

          <div className="mt-8 space-y-4">
            {/* Step 1 — Goal */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Step 1</div>
              <div className="mt-1 text-[15px] font-semibold text-white">Goal</div>
              <p className="mt-2 text-[13px] text-slate-300">
                Help a local restaurant increase online orders.
              </p>
            </div>

            {/* Step 2 — Semantic OS Query */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Step 2</div>
              <div className="mt-1 text-[15px] font-semibold text-white">Semantic OS Query</div>
              <p className="mt-2 text-[13px] text-slate-300">Semantic OS retrieves:</p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 text-[13px] text-slate-300">
                {[
                  'Previous restaurant support records',
                  'Online ordering playbooks',
                  'Menu and marketing notes',
                  'Local SEO strategy',
                  'Customer feedback',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span aria-hidden className="text-slate-500 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3 — Context Pack */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Step 3</div>
              <div className="mt-1 text-[15px] font-semibold text-white">Context Pack</div>
              <p className="mt-2 text-[13px] text-slate-300">Context Pack includes:</p>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 text-[13px] text-slate-300">
                {[
                  'Business problem',
                  'Causality chain',
                  'Suggested actions',
                  'Relevant evidence',
                  'Existing playbooks',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span aria-hidden className="text-slate-500 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 4 — Execution Agents */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Step 4</div>
              <div className="mt-1 text-[15px] font-semibold text-white">Execution Agents</div>
              <p className="mt-2 text-[13px] text-slate-400">
                Simulated agent statuses. No real backend tasks are running.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {AGENT_STATUS.map((a) => (
                  <li
                    key={a.name}
                    className="flex items-center justify-between rounded-xl bg-slate-950/60 ring-1 ring-slate-800 px-3 py-2"
                  >
                    <span className="text-[13px] text-slate-200">{a.name}</span>
                    <StatusBadge state={a.state} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 5 — Results */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Step 5</div>
              <div className="mt-1 text-[15px] font-semibold text-white">Results</div>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 text-[13px] text-slate-300">
                {[
                  'Landing page draft generated',
                  'SEO checklist generated',
                  'Client email draft generated',
                  'Follow-up task created',
                  'Menu video idea proposed',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 6 — Action Feedback */}
            <div className="rounded-2xl bg-emerald-500/5 ring-1 ring-emerald-400/30 p-5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">Step 6</div>
              <div className="mt-1 text-[15px] font-semibold text-white">Action Feedback</div>
              <ul className="mt-3 space-y-1.5 text-[13px] text-slate-200">
                {[
                  'Landing page structure validated',
                  'SEO checklist added to playbook',
                  'Follow-up email saved as reusable template',
                  'Next action: confirm offer with the restaurant owner',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <ArrowRight size={13} className="text-emerald-300 mt-1 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Workflow inspiration ────────────────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-indigo-300 mb-3">
              <Workflow size={16} />
              <span className="text-[11px] uppercase tracking-widest">Industry direction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              From Prompt Engineering to Workflow Engineering
            </h2>
            <p className="mt-4 text-[13.5px] text-slate-300 leading-relaxed">
              Modern AI systems are evolving from single prompts to dynamic workflows.
            </p>
            <p className="mt-3 text-[13.5px] text-slate-300 leading-relaxed">
              The next step is not only asking an AI to answer questions, but giving AI a
              structured operating environment:
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-slate-200">
              {['Goal', 'Workflow', 'Agents', 'Review', 'Execution', 'Feedback'].map((s, i, arr) => (
                <span key={s} className="inline-flex items-center gap-2">
                  <span className="rounded-md bg-slate-800/80 ring-1 ring-slate-700 px-2 py-1">
                    {s}
                  </span>
                  {i < arr.length - 1 && <span className="text-slate-600">→</span>}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[13.5px] text-slate-300 leading-relaxed">
              Semantic OS provides the memory and context layer for this evolution.
            </p>
            <p className="mt-4 text-[11.5px] text-slate-500">
              Inspired by the industry shift toward dynamic AI workflows.
            </p>
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/10 ring-1 ring-indigo-400/30 p-6 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              From knowledge to execution
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-[13.5px] sm:text-sm text-slate-300 leading-relaxed">
              Semantic OS is designed to help humans and AI move from scattered records to
              structured knowledge, visual understanding, task execution and continuous
              learning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link
                href="/semantic-os-demo"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-100 transition-colors"
              >
                View Semantic OS Demo
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-100 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-800 transition-colors"
              >
                Open Knowledge Map AI
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        <footer className="text-center text-[11px] text-slate-600 pb-6">
          Concept demo. All content on this page is simulated.
        </footer>
      </div>
    </div>
  )
}
