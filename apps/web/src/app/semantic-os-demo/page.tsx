import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  FileText,
  Sparkles,
  Layers,
  Database,
  RotateCcw,
  ClipboardCheck,
  Package,
  Network,
  School,
  Utensils,
  Briefcase,
  Server,
  CheckCircle2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Semantic OS in Action | Knowledge Map AI',
  description:
    'See how Semantic OS transforms business records into structured knowledge, actions, feedback, playbooks and visual Context Packs for Knowledge Map AI.',
}

// All content on this page is a sanitized, static demonstration. It does not
// load any Context Pack, does not read C:\Drive-semantic, does not call any
// agent, and does not depend on Local Private Mode.

const PIPELINE = [
  {
    title: 'Business Records',
    sub: 'notes, emails, meetings, logs',
    body: 'Users keep working naturally. They write notes, paste emails, record meetings or collect support logs.',
    icon: FileText,
  },
  {
    title: 'Semantic OS',
    sub: 'capture, distill, structure',
    body: 'AI extracts entities, decisions, constraints, actions, outcomes and evidence.',
    icon: Layers,
  },
  {
    title: 'Action Feedback',
    sub: 'decisions, actions, results',
    body: 'Completed operations are written back as lessons, results and reusable operational memory.',
    icon: RotateCcw,
  },
  {
    title: 'Playbooks',
    sub: 'reusable business memory',
    body: 'Repeated patterns become checklists and playbooks for future work.',
    icon: ClipboardCheck,
  },
  {
    title: 'Context Pack',
    sub: 'clean structured export',
    body: 'Semantic OS exports clean structured packets for visualization.',
    icon: Package,
  },
  {
    title: 'Knowledge Map AI',
    sub: '2D / 3D visualization',
    body: 'The visual layer displays relationships, causes, actions, sources and context.',
    icon: Network,
  },
]

const CAPABILITIES = [
  {
    n: 1,
    title: 'Capture',
    body: 'Collect notes, meetings, emails, support logs and AI conversations with zero friction.',
  },
  {
    n: 2,
    title: 'Distill',
    body: 'Turn raw records into summaries, key facts, risks and business context.',
  },
  {
    n: 3,
    title: 'Structure',
    body: 'Extract projects, clients, decisions, actions, outcomes, feedback and evidence.',
  },
  {
    n: 4,
    title: 'Action Feedback',
    body: 'Record what was done, what happened, what worked, what failed and what should change.',
  },
  {
    n: 5,
    title: 'Playbook',
    body: 'Convert repeated operational knowledge into reusable checklists and standard procedures.',
  },
  {
    n: 6,
    title: 'Context Pack',
    body: 'Export structured knowledge for Knowledge Map AI visualization.',
  },
]

const USE_CASES = [
  {
    title: 'Schools and training centers',
    icon: School,
    accent: 'text-sky-300 ring-sky-400/30 bg-sky-500/5',
    items: [
      'Student records',
      'Attestation workflows',
      'Administrative procedures',
      'Internal knowledge reuse',
    ],
  },
  {
    title: 'Restaurants and local commerce',
    icon: Utensils,
    accent: 'text-amber-300 ring-amber-400/30 bg-amber-500/5',
    items: [
      'Online ordering',
      'Menu and marketing operations',
      'Customer feedback',
      'Local SEO and content production',
    ],
  },
  {
    title: 'Service companies',
    icon: Briefcase,
    accent: 'text-fuchsia-300 ring-fuchsia-400/30 bg-fuchsia-500/5',
    items: [
      'Client communication',
      'Project follow-up',
      'Support records',
      'Operational playbooks',
    ],
  },
  {
    title: 'IT and operations teams',
    icon: Server,
    accent: 'text-emerald-300 ring-emerald-400/30 bg-emerald-500/5',
    items: [
      'Deployment records',
      'Incident reviews',
      'SSL / domain / infrastructure playbooks',
      'Action feedback loops',
    ],
  },
]

export default function SemanticOsDemoPage() {
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

        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <header className="mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 ring-1 ring-indigo-400/30 px-3 py-1 text-[11px] uppercase tracking-widest text-indigo-300 mb-5">
            <Sparkles size={12} />
            Concept demo · simulated
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
            Semantic OS in Action
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl">
            From daily business records to structured AI memory.
          </p>
          <div className="mt-7 max-w-3xl space-y-3 text-[13.5px] sm:text-sm text-slate-300 leading-relaxed">
            <p>
              <span className="text-white font-medium">Semantic OS</span> is a Knowledge
              Operating System for local businesses and human-AI collaboration.
            </p>
            <p>
              It transforms everyday business records — notes, meetings, emails, support
              logs and decisions — into structured knowledge, actions, feedback loops,
              reusable playbooks and visual Context Packs.
            </p>
            <p>
              <span className="text-white font-medium">Knowledge Map AI</span> is the
              visualization layer of Semantic OS.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-100 transition-colors"
            >
              Open Knowledge Map AI Demo
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/agent-workspace"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-100 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-800 transition-colors"
            >
              View Agent Workspace
              <ArrowRight size={13} />
            </Link>
          </div>
        </header>

        {/* ── 2. Process Architecture ─────────────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            How Semantic OS turns records into operational memory
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            Six layers, one continuous loop.
          </p>

          <ol className="mt-8 space-y-3">
            {PIPELINE.map((step, i) => {
              const Icon = step.icon
              return (
                <li key={step.title}>
                  <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5 flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 ring-1 ring-slate-700 flex-shrink-0">
                      <Icon size={16} className="text-slate-300" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[15px] font-semibold text-white">
                          {step.title}
                        </span>
                        <span className="text-[11px] uppercase tracking-widest text-slate-400">
                          {step.sub}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] text-slate-300 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="flex justify-center my-1">
                      <span aria-hidden className="text-slate-600 text-lg">↓</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </section>

        {/* ── 3. Real Business Record Example ─────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Example: From an operational record to reusable business memory
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            A sanitized illustration — no real customer or infrastructure data.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {/* Raw */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Raw Business Record
              </div>
              <p className="mt-3 text-[13.5px] text-slate-300 leading-relaxed">
                A production system needed to add a new school domain and configure SSL
                certificate renewal.
              </p>
              <p className="mt-2 text-[13.5px] text-slate-300 leading-relaxed">
                The operation involved DNS, web server configuration, certificate
                management, service validation and future renewal checks.
              </p>
            </div>

            {/* Distilled */}
            <div className="rounded-2xl bg-indigo-500/5 ring-1 ring-indigo-400/30 p-5">
              <div className="text-[10px] uppercase tracking-widest text-indigo-300">
                Distilled Summary
              </div>
              <dl className="mt-3 space-y-1.5 text-[13px] text-slate-200">
                {[
                  ['Project', 'Production platform operations'],
                  ['Topic', 'Domain onboarding and SSL automation'],
                  ['Action', 'Add a new school domain and configure HTTPS'],
                  ['Risk', 'DNS delay, server configuration conflict, certificate renewal failure'],
                  ['Reusable pattern', 'Domain onboarding and SSL management playbook'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="text-slate-400 min-w-[110px] sm:min-w-[140px] flex-shrink-0">
                      {k}
                    </dt>
                    <dd className="text-slate-100">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── 4. Semantic OS Backend Capabilities ─────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            What Semantic OS does behind the scenes
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            Six backend capabilities working together.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <div
                key={c.n}
                className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 ring-1 ring-slate-700 text-[12px] font-semibold text-slate-300">
                    {c.n}
                  </span>
                  <span className="text-[15px] font-semibold text-white">{c.title}</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Action Feedback and Playbook ─────────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Action Feedback and Playbook
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            Each completed operation feeds the next one.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {/* Action Feedback card */}
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">
                Action Feedback
              </div>
              <div className="mt-3 space-y-3 text-[13px] text-slate-200">
                <div>
                  <div className="text-slate-400 text-[11.5px] uppercase tracking-widest">Action</div>
                  <p className="mt-0.5 leading-relaxed">
                    Add a new business domain to a production platform and configure HTTPS.
                  </p>
                </div>
                <div>
                  <div className="text-slate-400 text-[11.5px] uppercase tracking-widest">Result</div>
                  <p className="mt-0.5 leading-relaxed">
                    The operational process was documented and converted into reusable memory.
                  </p>
                </div>
                <div>
                  <div className="text-slate-400 text-[11.5px] uppercase tracking-widest">
                    Lessons Learned
                  </div>
                  <ul className="mt-1 space-y-1">
                    {[
                      'Always separate production and test environments.',
                      'Always verify DNS, server configuration, certificate status and renewal.',
                      'Repeatable operations should become playbooks.',
                    ].map((s) => (
                      <li key={s} className="flex gap-2">
                        <span aria-hidden className="text-slate-500 mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-slate-400 text-[11.5px] uppercase tracking-widest">
                    Write-Back
                  </div>
                  <p className="mt-0.5 leading-relaxed">
                    Yes — this becomes reusable operational knowledge.
                  </p>
                </div>
              </div>
            </div>

            {/* Playbook checklist */}
            <div className="rounded-2xl bg-emerald-500/5 ring-1 ring-emerald-400/30 p-5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300">
                Playbook
              </div>
              <div className="mt-1 text-[15px] font-semibold text-white">
                Domain Onboarding &amp; SSL Playbook
              </div>
              <ul className="mt-4 space-y-1.5 text-[13px] text-slate-200">
                {[
                  'Confirm DNS configuration',
                  'Check web server domain mapping',
                  'Test configuration before reload',
                  'Request or update SSL certificate',
                  'Verify HTTPS access',
                  'Test renewal process',
                  'Record the operation in Semantic OS',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 6. Context Pack to Knowledge Map AI ─────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            From Semantic OS to Knowledge Map AI
          </h2>
          <div className="mt-4 max-w-3xl space-y-3 text-[13.5px] sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Semantic OS does not expose raw private records to the public website.
            </p>
            <p>
              Instead, it prepares structured Context Packs. Knowledge Map AI reads these
              packets and displays clean visual relationships, action chains, sources and
              context.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-[12px] text-slate-200">
            {['Semantic OS', 'Context Pack', 'Knowledge Map AI', '2D / 3D Relationship View'].map(
              (s, i, arr) => (
                <span key={s} className="inline-flex items-center gap-2">
                  <span className="rounded-md bg-slate-800/80 ring-1 ring-slate-700 px-2 py-1">
                    {s}
                  </span>
                  {i < arr.length - 1 && <span className="text-slate-600">→</span>}
                </span>
              )
            )}
          </div>

          <p className="mt-5 text-[12px] text-slate-500">
            Public demo uses safe demo data. Private business data stays local or in a
            controlled private environment.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 p-5 flex flex-col">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">
                Visualization Layer
              </div>
              <div className="mt-1 text-[15px] font-semibold text-white">
                Knowledge Map AI
              </div>
              <p className="mt-2 text-[13px] text-slate-300 leading-relaxed">
                Browse the relationships, causes, dependencies and project context behind
                each Context Pack.
              </p>
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-100 transition-colors"
                >
                  Open Knowledge Map AI
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-fuchsia-500/5 ring-1 ring-fuchsia-400/30 p-5 flex flex-col">
              <div className="text-[10px] uppercase tracking-widest text-fuchsia-300">
                Execution Agent Layer
              </div>
              <div className="mt-1 text-[15px] font-semibold text-white">
                Execution Agent Layer
              </div>
              <p className="mt-2 text-[13px] text-slate-300 leading-relaxed">
                See how Semantic OS can guide AI agents from structured knowledge to
                tasks, results and feedback.
              </p>
              <div className="mt-4">
                <Link
                  href="/agent-workspace"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-100 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-800 transition-colors"
                >
                  Open Agent Workspace
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Business Use Cases / Partnership ─────────────────────── */}
        <section className="mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            Use cases for local businesses
          </h2>
          <p className="mt-2 text-[13px] text-slate-400 max-w-2xl">
            Where Semantic OS earns its keep.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {USE_CASES.map((u) => {
              const Icon = u.icon
              return (
                <div
                  key={u.title}
                  className={`rounded-2xl ${u.accent} ring-1 p-5`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} />
                    <span className="text-[15px] font-semibold text-white">{u.title}</span>
                  </div>
                  <ul className="space-y-1 text-[13px] text-slate-200">
                    {u.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden className="text-slate-500 mt-0.5">•</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mt-8 rounded-2xl bg-slate-900/40 ring-1 ring-slate-800 p-5 sm:p-6 max-w-3xl">
            <p className="text-[13.5px] text-slate-300 leading-relaxed">
              Semantic OS can be deployed as a local or private knowledge operating system
              for small and medium-sized businesses.
            </p>
            <p className="mt-3 text-[13.5px] text-slate-300 leading-relaxed">
              Cloud infrastructure partners can provide secure hosting, while
              <span className="text-white font-medium"> FUTUSHOW / ClawShow </span>
              provides the Semantic OS methodology, implementation and business workflow
              integration.
            </p>
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/10 ring-1 ring-indigo-400/30 p-6 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Semantic OS is not just a knowledge base.
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-[13.5px] sm:text-sm text-slate-300 leading-relaxed">
              It is a structured memory layer for humans and AI — turning business records
              into decisions, actions, feedback and reusable operating knowledge.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-100 transition-colors"
              >
                View Knowledge Map AI Demo
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/agent-workspace"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-100 px-4 py-2 text-[12.5px] font-semibold hover:bg-slate-800 transition-colors"
              >
                View Agent Workspace
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        <footer className="text-center text-[11px] text-slate-600 pb-6">
          Concept demo. All content on this page is sanitized and static.
        </footer>
      </div>
    </div>
  )
}
