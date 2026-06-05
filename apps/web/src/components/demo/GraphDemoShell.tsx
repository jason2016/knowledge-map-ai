'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  X,
} from 'lucide-react'
import { type DemoDataset } from '@/types/demo'
import { STATUS_COLORS, STATUS_LABEL, colorForType } from './demoColors'
import { DemoGraphCanvas2D } from './DemoGraphCanvas2D'
import { DemoGraphCanvas3D } from './DemoGraphCanvas3D'

interface OtherDemo {
  href: string
  label: string
}

interface Props {
  dataset: DemoDataset
  otherDemo: OtherDemo
}

const AUTOPLAY_MS = 3500

export function GraphDemoShell({ dataset, otherDemo }: Props) {
  const [presentation, setPresentation] = useState(false)
  const [view, setView] = useState<'2d' | '3d'>('2d')
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // ?mode=present → presentation mode (auto-play on mount, minimal chrome).
  // Read on the client so this component doesn't depend on Next.js
  // useSearchParams (which requires a Suspense boundary in Next 16).
  useEffect(() => {
    try {
      const u = new URL(window.location.href)
      if (u.searchParams.get('mode') === 'present') {
        setPresentation(true)
        setPlaying(true)
      }
    } catch {
      /* SSR-safe no-op */
    }
  }, [])

  // Auto-play: advance step every AUTOPLAY_MS ms. Wraps to step 0.
  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(
      () => setStepIdx((s) => (s + 1) % dataset.steps.length),
      AUTOPLAY_MS
    )
    return () => window.clearInterval(t)
  }, [playing, dataset.steps.length])

  const step = dataset.steps[stepIdx]
  const focusNodeIds = useMemo(
    () => new Set(step.focusNodeIds),
    [step.focusNodeIds]
  )
  const focusEdgeIds = useMemo(
    () => new Set(step.focusEdgeIds ?? []),
    [step.focusEdgeIds]
  )

  const selectedNode = useMemo(
    () => dataset.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [dataset.nodes, selectedNodeId]
  )

  const connectedToSelected = useMemo(() => {
    if (!selectedNode) return []
    const ids = new Set<string>()
    dataset.edges.forEach((e) => {
      if (e.source === selectedNode.id) ids.add(e.target)
      if (e.target === selectedNode.id) ids.add(e.source)
    })
    return Array.from(ids)
      .map((id) => dataset.nodes.find((n) => n.id === id))
      .filter((n): n is (typeof dataset.nodes)[number] => !!n)
  }, [dataset.edges, dataset.nodes, selectedNode])

  const prev = useCallback(
    () => setStepIdx((s) => (s - 1 + dataset.steps.length) % dataset.steps.length),
    [dataset.steps.length]
  )
  const next = useCallback(
    () => setStepIdx((s) => (s + 1) % dataset.steps.length),
    [dataset.steps.length]
  )
  const reset = useCallback(() => {
    setStepIdx(0)
    setSelectedNodeId(null)
    setPlaying(false)
  }, [])

  return (
    <div
      className="h-full overflow-hidden text-slate-200 flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #0f172a 50%, #0b1120 100%)',
      }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────── */}
      {!presentation && (
        <header
          className="flex-shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6"
          style={{
            height: 52,
            borderBottom: '1px solid rgba(148,163,184,0.10)',
            background: 'rgba(15,23,42,0.75)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Knowledge Map AI</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-[13px] font-semibold text-white truncate">
              {dataset.title}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={otherDemo.href}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {otherDemo.label}
              <ChevronRight size={11} />
            </Link>
            {/* 2D / 3D toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-800/80 ring-1 ring-slate-700">
              {(['2d', '3d'] as const).map((m) => {
                const active = view === m
                return (
                  <button
                    key={m}
                    onClick={() => setView(m)}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors"
                    style={{
                      background: active ? '#6366f1' : 'transparent',
                      color: active ? '#ffffff' : '#cbd5e1',
                    }}
                  >
                    {m === '2d' ? '2D' : '3D'}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => {
                setPresentation(true)
                setPlaying(true)
                setSelectedNodeId(null)
              }}
              title="Presentation mode (auto-play, minimal chrome)"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/15 ring-1 ring-indigo-400/30 text-indigo-200 hover:bg-indigo-500/25 transition-colors"
            >
              Present
            </button>
          </div>
        </header>
      )}

      {/* ── Hero (only when not presenting) ───────────────────────────── */}
      {!presentation && (
        <div className="flex-shrink-0 px-4 sm:px-6 pt-5 pb-3">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            {dataset.title}
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-400">{dataset.subtitle}</p>
          <p className="mt-2 max-w-3xl text-[12.5px] text-slate-400 leading-relaxed">
            {dataset.intro}
          </p>
        </div>
      )}

      {/* ── Main 3-pane (steps | canvas | detail) ─────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 px-3 sm:px-4 pb-3">
        {/* Steps panel (left) */}
        {!presentation && (
          <aside
            className="flex-shrink-0 lg:w-[240px] rounded-xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(148,163,184,0.10)',
            }}
          >
            <div className="px-3 py-2.5 border-b border-slate-800/80">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Scene timeline
              </div>
            </div>
            <ol className="flex-1 overflow-y-auto p-2 space-y-1">
              {dataset.steps.map((s, i) => {
                const active = i === stepIdx
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setStepIdx(i)}
                      className="w-full text-left px-2.5 py-2 rounded-lg transition-colors"
                      style={{
                        background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                        border: '1px solid ' + (active ? 'rgba(99,102,241,0.40)' : 'transparent'),
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-semibold flex-shrink-0"
                          style={{
                            background: active ? '#6366f1' : 'rgba(148,163,184,0.15)',
                            color: active ? '#ffffff' : '#cbd5e1',
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-[12.5px] font-medium truncate"
                          style={{ color: active ? '#ffffff' : '#cbd5e1' }}
                        >
                          {s.title}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-slate-400">
                        {s.description}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ol>
          </aside>
        )}

        {/* Canvas (center) */}
        <main className="flex-1 min-h-0 min-w-0 relative rounded-xl overflow-hidden"
          style={{
            background: 'rgba(11,17,32,0.7)',
            border: '1px solid rgba(148,163,184,0.10)',
          }}
        >
          <div className="absolute inset-0">
            {view === '2d' ? (
              <DemoGraphCanvas2D
                nodes={dataset.nodes}
                edges={dataset.edges}
                focusNodeIds={focusNodeIds}
                focusEdgeIds={focusEdgeIds}
                selectedNodeId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            ) : (
              <DemoGraphCanvas3D
                nodes={dataset.nodes}
                edges={dataset.edges}
                focusNodeIds={focusNodeIds}
                focusEdgeIds={focusEdgeIds}
                selectedNodeId={selectedNodeId}
                onSelect={setSelectedNodeId}
              />
            )}
          </div>

          {/* Step caption overlay (top-left of canvas, also shown in presentation mode) */}
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-md pointer-events-none">
            <div
              className="rounded-lg px-3 py-2"
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(99,102,241,0.40)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div className="text-[10px] uppercase tracking-widest text-indigo-300">
                Scene {stepIdx + 1} / {dataset.steps.length}
              </div>
              <div className="mt-0.5 text-[13px] font-semibold text-white">
                {step.title}
              </div>
              <p className="mt-1 text-[11.5px] leading-snug text-slate-300">
                {step.description}
              </p>
            </div>
          </div>

          {/* Timeline controls (bottom-center) */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(148,163,184,0.20)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <button
                onClick={prev}
                title="Previous step"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                aria-label="Previous step"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                title={playing ? 'Pause' : 'Play'}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-white transition-colors"
                style={{ background: playing ? '#7c3aed' : '#6366f1' }}
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={next}
                title="Next step"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                aria-label="Next step"
              >
                <ChevronRight size={15} />
              </button>
              <button
                onClick={reset}
                title="Reset"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
                aria-label="Reset"
              >
                <RotateCcw size={13} />
              </button>
              <span className="px-2 text-[11px] text-slate-400 tabular-nums">
                Step {stepIdx + 1} / {dataset.steps.length}
              </span>
            </div>
          </div>

          {/* Exit presentation mode */}
          {presentation && (
            <button
              onClick={() => {
                setPresentation(false)
                setPlaying(false)
              }}
              className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 ring-1 ring-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X size={11} />
              Exit
            </button>
          )}
        </main>

        {/* Detail panel (right) */}
        {!presentation && (
          <aside
            className="flex-shrink-0 lg:w-[260px] rounded-xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(148,163,184,0.10)',
            }}
          >
            <div className="px-3 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                Selected node
              </div>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNodeId(null)}
                  aria-label="Clear selection"
                  className="text-slate-500 hover:text-slate-200 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-3 text-[12.5px] text-slate-300">
              {!selectedNode && (
                <p className="text-slate-500 leading-relaxed">
                  Click any node in the graph to inspect its type, status, description
                  and connections.
                </p>
              )}
              {selectedNode && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: colorForType(selectedNode.type) }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: colorForType(selectedNode.type) }}
                      >
                        {selectedNode.type}
                      </span>
                      {selectedNode.status && selectedNode.status !== 'idle' && (
                        <span
                          className="text-[9.5px] uppercase tracking-widest px-1.5 py-0.5 rounded ring-1"
                          style={{
                            color: STATUS_COLORS[selectedNode.status],
                            background: STATUS_COLORS[selectedNode.status] + '22',
                            borderColor: STATUS_COLORS[selectedNode.status] + '55',
                          }}
                        >
                          {STATUS_LABEL[selectedNode.status]}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-[15px] font-semibold text-white">
                      {selectedNode.label}
                    </h3>
                    {selectedNode.layer && (
                      <div className="text-[10.5px] text-slate-500 mt-0.5">
                        layer · {selectedNode.layer}
                      </div>
                    )}
                  </div>
                  <p className="leading-relaxed">{selectedNode.description}</p>
                  {selectedNode.example && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                        Example
                      </div>
                      <p
                        className="text-[12px] leading-relaxed italic pl-2"
                        style={{ borderLeft: '2px solid rgba(99,102,241,0.40)' }}
                      >
                        {selectedNode.example}
                      </p>
                    </div>
                  )}
                  {connectedToSelected.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                        Connected
                      </div>
                      <ul className="space-y-1">
                        {connectedToSelected.map((cn) => (
                          <li key={cn.id} className="flex items-center gap-2 text-[12px]">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: colorForType(cn.type) }}
                            />
                            <span>{cn.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                      Current scene
                    </div>
                    <p className="text-[11.5px] text-slate-400 leading-snug">
                      {focusNodeIds.has(selectedNode.id)
                        ? `In focus during scene ${stepIdx + 1} · ${step.title}`
                        : `Not in focus during scene ${stepIdx + 1} · ${step.title}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
