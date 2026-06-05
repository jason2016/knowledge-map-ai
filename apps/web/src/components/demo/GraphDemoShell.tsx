'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
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

// Demo shell, visually unified with the homepage:
//   - 52px white header (logo + title + right links + 2D/3D toggle), same
//     borders / shadows / radii / typography as /
//   - 220px white left sidebar with a Scene Timeline section that styles
//     each scene the same way LeftSidebar styles a Demo Vault entry
//   - the canvas fills the remaining area and is the single source of motion
//   - the Selected Node panel on the right is an absolute overlay (320px
//     wide), styled like NodeMemoryPanel, so opening it never resizes the
//     canvas → no graph jitter when the user clicks a node
//   - bottom-centre timeline pill + ?mode=present presentation mode
//
// Scenes (steps) are intentionally a `DemoStep[]` shape — future pipeline:
// DemoStep[] -> HTML scene animation -> HyperFrames -> MP4.
export function GraphDemoShell({ dataset, otherDemo }: Props) {
  const [presentation, setPresentation] = useState(false)
  const [view, setView] = useState<'2d' | '3d'>('2d')
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  // Mobile only: the scene timeline opens as a drawer over the canvas.
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ?mode=present → presentation mode (auto-play, minimal chrome).
  // Read on the client so this component does not depend on Next.js
  // useSearchParams (which would require a Suspense boundary in Next 16).
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

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(
      () => setStepIdx((s) => (s + 1) % dataset.steps.length),
      AUTOPLAY_MS
    )
    return () => window.clearInterval(t)
  }, [playing, dataset.steps.length])

  const step = dataset.steps[stepIdx]
  const focusNodeIds = useMemo(() => new Set(step.focusNodeIds), [step.focusNodeIds])
  const focusEdgeIds = useMemo(() => new Set(step.focusEdgeIds ?? []), [step.focusEdgeIds])

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
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#fbfbfd' }}
    >
      {/* ── Top nav (matches homepage /) ──────────────────────────────── */}
      {!presentation && (
        <header
          className="flex-shrink-0 flex items-center justify-between px-5"
          style={{
            height: 52,
            background: '#ffffff',
            borderBottom: '1px solid rgba(30,30,60,0.08)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 -ml-1 rounded-lg flex-shrink-0"
              style={{ color: '#475569' }}
              aria-label="Open scene timeline"
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              title="Back to Knowledge Map AI"
              className="flex items-center gap-2.5 flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/clawshow-logo.png" alt="ClawShow" width={28} height={28} className="rounded-lg flex-shrink-0" />
            </Link>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[14px] font-bold truncate" style={{ color: '#1c1c2e' }}>
                {dataset.title}
              </span>
              <span className="hidden sm:block text-[10.5px] truncate" style={{ color: '#9494ad' }}>
                {dataset.subtitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                background: 'rgba(99,102,241,0.08)',
                color: '#4f46e5',
                border: '1px solid rgba(99,102,241,0.20)',
              }}
              title="Knowledge Map AI"
            >
              <ArrowLeft size={11} />
              <span>Knowledge Map AI</span>
            </Link>
            <Link
              href={otherDemo.href}
              className="hidden md:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                background: 'rgba(14,165,233,0.08)',
                color: '#0284c7',
                border: '1px solid rgba(14,165,233,0.25)',
              }}
              title={otherDemo.label}
            >
              <span>{otherDemo.label}</span>
              <ChevronRight size={11} />
            </Link>
            <button
              onClick={() => {
                setPresentation(true)
                setPlaying(true)
                setSelectedNodeId(null)
              }}
              title="Presentation mode (auto-play, minimal chrome)"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: '1px solid #4f46e5',
              }}
            >
              Present
            </button>
          </div>
        </header>
      )}

      {/* ── Mobile-only control band ──────────────────────────────────
          Desktop already exposes page-nav + Present pills in the header
          and the 2D / 3D toggle centred on the canvas. On phones those
          either don't fit or are easy to miss, so we render a compact
          stacked band here. `md:hidden` keeps it off the desktop layout.
      */}
      {!presentation && (() => {
        const isSemanticOs = otherDemo.href === '/agent-workspace'
        const isAgent = otherDemo.href === '/semantic-os-demo'
        const navPills: Array<{ href: string; label: string; active: boolean }> = [
          { href: '/',                   label: 'Knowledge Map AI', active: false },
          { href: '/semantic-os-demo',   label: 'Semantic OS',      active: isSemanticOs },
          { href: '/agent-workspace',    label: 'Agent',            active: isAgent },
        ]
        return (
          <div
            className="md:hidden flex-shrink-0 px-3 py-2 flex flex-col gap-1.5"
            style={{
              background: '#ffffff',
              borderBottom: '1px solid rgba(30,30,60,0.06)',
            }}
          >
            {/* Row 1 — page navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1">
              {navPills.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
                  style={{
                    background: p.active ? '#4f46e5' : 'rgba(99,102,241,0.08)',
                    color: p.active ? '#ffffff' : '#4f46e5',
                    border: '1px solid ' + (p.active ? '#4f46e5' : 'rgba(99,102,241,0.20)'),
                  }}
                  aria-current={p.active ? 'page' : undefined}
                >
                  {p.label}
                </Link>
              ))}
            </div>

            {/* Row 2 — 2D / 3D segmented control + Present */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-0.5 p-0.5 rounded-full"
                style={{
                  background: 'rgba(248,250,252,0.92)',
                  border: '1px solid #e5e7eb',
                }}
              >
                {(['2d', '3d'] as const).map((m) => {
                  const active = view === m
                  return (
                    <button
                      key={m}
                      onClick={() => setView(m)}
                      className="px-3 py-0.5 rounded-full text-[11px] font-medium transition-colors"
                      style={{
                        background: active ? '#4f46e5' : 'transparent',
                        color: active ? '#ffffff' : '#64748b',
                      }}
                    >
                      {m === '2d' ? '2D Map' : '3D Space'}
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
                className="ml-auto inline-flex items-center text-[11px] px-3 py-1 rounded-full whitespace-nowrap"
                style={{
                  background: '#7c3aed',
                  color: '#ffffff',
                  border: '1px solid #7c3aed',
                }}
                title="Presentation mode (auto-play, minimal chrome)"
              >
                Present
              </button>
            </div>
          </div>
        )
      })()}

      {/* ── 3-pane layout (sidebar becomes a drawer on mobile) ────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile backdrop */}
        {!presentation && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left: Scene Timeline sidebar (homepage LeftSidebar look). */}
        {!presentation && (
          <aside
            style={{
              width: 220,
              background: '#ffffff',
              borderRight: '1px solid rgba(30,30,60,0.08)',
              flexShrink: 0,
            }}
            className={
              'flex flex-col overflow-y-auto transition-transform duration-200 ' +
              'fixed top-[52px] bottom-0 left-0 z-40 shadow-xl ' +
              'md:static md:top-auto md:z-auto md:h-full md:shadow-none ' +
              (sidebarOpen ? 'translate-x-0' : '-translate-x-full') +
              ' md:translate-x-0'
            }
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden self-end m-2 p-1.5 rounded-md"
              style={{ color: '#9494ad' }}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>

            <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(30,30,60,0.06)' }}>
              <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: '#9494ad' }}>
                Scene Timeline
              </p>
              <ol className="flex flex-col gap-1">
                {dataset.steps.map((s, i) => {
                  const active = i === stepIdx
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => {
                          setStepIdx(i)
                          setSidebarOpen(false)
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
                        style={{
                          background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                          color: active ? '#4f46e5' : '#5a5a70',
                          border: active ? '1px solid rgba(99,102,241,0.30)' : '1px solid transparent',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-semibold flex-shrink-0"
                            style={{
                              background: active ? '#4f46e5' : 'rgba(148,163,184,0.18)',
                              color: active ? '#ffffff' : '#64748b',
                            }}
                          >
                            {i + 1}
                          </span>
                          <span className="truncate">{s.title}</span>
                        </div>
                        <p
                          className="mt-1 text-[11px] leading-snug font-normal"
                          style={{ color: active ? '#5a5a70' : '#94a3b8' }}
                        >
                          {s.description}
                        </p>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="px-4 py-3 flex-1">
              <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: '#9494ad' }}>
                About
              </p>
              <p className="text-[11.5px] leading-relaxed" style={{ color: '#64748b' }}>
                {dataset.intro}
              </p>
            </div>

            <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(30,30,60,0.06)' }}>
              <Link
                href={otherDemo.href}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg"
                style={{
                  background: 'rgba(14,165,233,0.08)',
                  border: '1px solid rgba(14,165,233,0.20)',
                  color: '#0284c7',
                }}
              >
                <ChevronRight size={14} />
                <span className="text-[12px] font-medium leading-tight">
                  Open {otherDemo.label}
                </span>
              </Link>
            </div>
          </aside>
        )}

        {/* Center: graph canvas. */}
        <main className="flex-1 min-w-0 overflow-hidden relative">
          {/* 2D / 3D toggle — same component as homepage /. Hidden on phones
              because the mobile-only control band above already exposes it. */}
          {!presentation && (
            <div className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1">
              <div
                className="flex items-center gap-0.5 p-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 10px rgba(15,23,42,0.08)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {(['2d', '3d'] as const).map((m) => {
                  const active = view === m
                  return (
                    <button
                      key={m}
                      onClick={() => setView(m)}
                      className="px-3 py-1 rounded-full text-[11.5px] font-medium transition-all duration-150"
                      style={{
                        background: active ? '#4f46e5' : 'transparent',
                        color: active ? '#ffffff' : '#64748b',
                      }}
                    >
                      {m === '2d' ? '2D Map' : '3D Space'}
                    </button>
                  )
                })}
              </div>
              <span className="hidden sm:block text-[10px]" style={{ color: '#94a3b8' }}>
                Explore relationships in 3D. Work with details in 2D.
              </span>
            </div>
          )}

          {/* Both renderers live in absolute layers; we only toggle visibility
              so switching never re-lays-out / re-fits → no size jump. */}
          <div
            className="absolute inset-0"
            style={{ visibility: view === '2d' ? 'visible' : 'hidden' }}
          >
            <DemoGraphCanvas2D
              nodes={dataset.nodes}
              edges={dataset.edges}
              focusNodeIds={focusNodeIds}
              focusEdgeIds={focusEdgeIds}
              selectedNodeId={selectedNodeId}
              onSelect={setSelectedNodeId}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{ visibility: view === '3d' ? 'visible' : 'hidden' }}
          >
            <DemoGraphCanvas3D
              nodes={dataset.nodes}
              edges={dataset.edges}
              focusNodeIds={focusNodeIds}
              focusEdgeIds={focusEdgeIds}
              selectedNodeId={selectedNodeId}
              onSelect={setSelectedNodeId}
            />
          </div>

          {/* Scene caption overlay (visible in both normal and presentation modes). */}
          <div className={
            'absolute z-10 pointer-events-none ' +
            (presentation
              ? 'top-6 left-1/2 -translate-x-1/2 max-w-[680px] w-[88%]'
              : 'left-3 sm:left-4 max-w-[420px] w-[calc(100%-1.5rem)] sm:w-[400px]') +
            (presentation ? '' : ' bottom-[68px] sm:bottom-[72px]')
          }>
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px rgba(15,23,42,0.08)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#4f46e5' }}>
                Scene {stepIdx + 1} / {dataset.steps.length}
              </div>
              <div className="mt-0.5 text-[13.5px] font-semibold" style={{ color: '#1c1c2e' }}>
                {step.title}
              </div>
              <p className="mt-1 text-[12px] leading-snug" style={{ color: '#475569' }}>
                {step.description}
              </p>
            </div>
          </div>

          {/* Bottom-centre timeline controls (homepage pill style). */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-20">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.92)',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 10px rgba(15,23,42,0.08)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <button
                onClick={prev}
                title="Previous step"
                aria-label="Previous step"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full transition-colors"
                style={{ color: '#475569' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                title={playing ? 'Pause' : 'Play'}
                aria-label={playing ? 'Pause' : 'Play'}
                className="w-9 h-9 inline-flex items-center justify-center rounded-full text-white transition-colors"
                style={{ background: playing ? '#7c3aed' : '#4f46e5' }}
              >
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={next}
                title="Next step"
                aria-label="Next step"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full transition-colors"
                style={{ color: '#475569' }}
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={reset}
                title="Reset"
                aria-label="Reset"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full transition-colors"
                style={{ color: '#475569' }}
              >
                <RotateCcw size={13} />
              </button>
              <span className="px-2 text-[11px] tabular-nums" style={{ color: '#64748b' }}>
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
              className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.94)',
                border: '1px solid #e5e7eb',
                color: '#475569',
                boxShadow: '0 2px 10px rgba(15,23,42,0.08)',
              }}
            >
              <X size={11} />
              Exit
            </button>
          )}
        </main>

        {/* Right: Selected Node panel (absolute overlay, NodeMemoryPanel style).
            On phones the canvas keeps the full width; selection still shows the
            node colour / status in the SVG, and tapping again deselects. */}
        {selectedNode && !presentation && (
          <aside
            className="absolute right-0 top-0 bottom-0 z-30 hidden md:flex flex-col overflow-hidden"
            style={{
              width: 320,
              background: '#ffffff',
              borderLeft: '1px solid rgba(30,30,60,0.08)',
              boxShadow: '-10px 0 30px rgba(15,23,42,0.08)',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(30,30,60,0.07)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: colorForType(selectedNode.type) }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: colorForType(selectedNode.type) }}
                    >
                      {selectedNode.type}
                    </span>
                    {selectedNode.status && selectedNode.status !== 'idle' && (
                      <span
                        className="text-[9.5px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: STATUS_COLORS[selectedNode.status] + '18',
                          color: STATUS_COLORS[selectedNode.status],
                          border: '1px solid ' + STATUS_COLORS[selectedNode.status] + '40',
                        }}
                      >
                        {STATUS_LABEL[selectedNode.status]}
                      </span>
                    )}
                  </div>
                  <h2 className="text-[15px] font-semibold leading-tight" style={{ color: '#1c1c2e' }}>
                    {selectedNode.label}
                  </h2>
                  {selectedNode.layer && (
                    <div className="text-[10.5px] mt-0.5" style={{ color: '#9494ad' }}>
                      Layer · {selectedNode.layer}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded-md flex-shrink-0"
                  style={{ color: '#9494ad' }}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 text-[12.5px] leading-relaxed" style={{ color: '#4a4a60' }}>
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#9494ad' }}>
                    Summary
                  </span>
                </div>
                <p>{selectedNode.description}</p>
              </div>

              {selectedNode.example && (
                <div className="mb-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#9494ad' }}>
                      Example
                    </span>
                  </div>
                  <p
                    className="pl-3 italic"
                    style={{
                      borderLeft: '2px solid rgba(99,102,241,0.30)',
                      color: '#5a5a70',
                    }}
                  >
                    {selectedNode.example}
                  </p>
                </div>
              )}

              {connectedToSelected.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#9494ad' }}>
                      Connected To
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {connectedToSelected.map((cn) => (
                      <li key={cn.id} className="flex items-start gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ background: colorForType(cn.type) }}
                        />
                        <span className="text-[12px] leading-tight" style={{ color: '#2c2c42' }}>
                          {cn.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#9494ad' }}>
                    Current Scene
                  </span>
                </div>
                <p className="text-[11.5px]" style={{ color: '#64748b' }}>
                  {focusNodeIds.has(selectedNode.id)
                    ? `In focus during scene ${stepIdx + 1} · ${step.title}`
                    : `Not in focus during scene ${stepIdx + 1} · ${step.title}`}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
