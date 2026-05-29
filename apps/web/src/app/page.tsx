'use client'
import { useState, useMemo, useCallback } from 'react'
import { Menu } from 'lucide-react'
import { ReactFlowProvider } from '@xyflow/react'
import { LeftSidebar } from '@/components/sidebar/LeftSidebar'
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph'
import { ThreeDSpaceGraph } from '@/components/ThreeDSpaceGraph'
import { NodeMemoryPanel } from '@/components/panel/NodeMemoryPanel'
import { useIsMobile } from '@/hooks/useIsMobile'

type ViewMode = '2d' | '3d'
import { accountingNodes, accountingEdges } from '@/data/accounting'
import { exhibitionNodes, exhibitionEdges } from '@/data/exhibition'
import { EXTRAS } from '@/data/extras'
import {
  type DemoId,
  type EntityType,
  type KnowledgeNodeData,
  type ConnectedNodeInfo,
} from '@/types'

const DATASETS = {
  accounting: { nodes: accountingNodes, edges: accountingEdges, label: 'Accounting Map' },
  exhibition: { nodes: exhibitionNodes, edges: exhibitionEdges, label: 'Exhibition Map' },
}

export default function Page() {
  const [demo, setDemo] = useState<DemoId>('accounting')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<EntityType[]>([])
  // Data-source focus: highlight + auto-fit all nodes of one entity type.
  const [focusType, setFocusType] = useState<EntityType | null>(null)
  const [focusNonce, setFocusNonce] = useState(0)
  // Ids of extra (newly-ingested) batches that have been added, per demo.
  const [addedBatchIds, setAddedBatchIds] = useState<Record<DemoId, string[]>>({
    accounting: [],
    exhibition: [],
  })
  // Mobile: left sidebar is an off-canvas drawer.
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Explore in 3D. Work in 2D. — 2D is the default working view.
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  // 3D is mounted lazily on first use, then kept mounted (hidden) for stable switching.
  const [mounted3D, setMounted3D] = useState(false)

  const baseDataset = DATASETS[demo]

  // Merge base demo data with any newly-ingested nodes/edges for this demo.
  const dataset = useMemo(() => {
    const added = EXTRAS[demo].filter((b) => addedBatchIds[demo].includes(b.node.id))
    if (added.length === 0) return baseDataset
    return {
      nodes: [...baseDataset.nodes, ...added.map((b) => b.node)],
      edges: [...baseDataset.edges, ...added.flatMap((b) => b.edges)],
      label: baseDataset.label,
    }
  }, [demo, baseDataset, addedBatchIds])

  const handleDemoChange = useCallback((id: DemoId) => {
    setDemo(id)
    setSelectedNodeId(null)
    setActiveFilters([])
    setFocusType(null)
    setSidebarOpen(false)
  }, [])

  const handleFilterToggle = useCallback((type: EntityType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  // Clicking a left-hand data source focuses its entity type on the map.
  const handleSourceFocus = useCallback((type: EntityType) => {
    setSelectedNodeId(null)
    setFocusType(type)
    setFocusNonce((n) => n + 1)
    setSidebarOpen(false)
  }, [])

  // Adding a data-source node: append the next unused batch of that type, then
  // focus it so the new node and its freshly-generated relationships are shown.
  const handleSourceAdd = useCallback(
    (type: EntityType) => {
      const next = EXTRAS[demo].find(
        (b) => b.type === type && !addedBatchIds[demo].includes(b.node.id)
      )
      if (!next) {
        // Nothing left to add — just re-focus the existing nodes of that type.
        setSelectedNodeId(null)
        setFocusType(type)
        setFocusNonce((n) => n + 1)
        setSidebarOpen(false)
        return
      }
      setAddedBatchIds((prev) => ({
        ...prev,
        [demo]: [...prev[demo], next.node.id],
      }))
      setSelectedNodeId(null)
      setSidebarOpen(false)
      setFocusType(type)
      setFocusNonce((n) => n + 1)
    },
    [demo, addedBatchIds]
  )

  // Selecting a node (on the canvas) takes over from a data-source focus.
  const handleNodeSelect = useCallback((id: string | null) => {
    setSelectedNodeId(id)
    setFocusType(null)
  }, [])

  const selectedNodeData = useMemo<KnowledgeNodeData | null>(
    () => dataset.nodes.find((n) => n.id === selectedNodeId)?.data ?? null,
    [dataset.nodes, selectedNodeId]
  )

  const connectedNodes = useMemo<ConnectedNodeInfo[]>(() => {
    if (!selectedNodeId) return []
    return dataset.edges.flatMap((e) => {
      const otherId =
        e.source === selectedNodeId
          ? e.target
          : e.target === selectedNodeId
          ? e.source
          : null
      if (!otherId) return []
      const other = dataset.nodes.find((n) => n.id === otherId)
      if (!other) return []
      return [
        {
          id: other.id,
          label: other.data.label,
          entityType: other.data.entityType,
          edgeLabel: (e.label as string) ?? '',
        },
      ]
    })
  }, [selectedNodeId, dataset])

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#fbfbfd' }}>
        {/* ── Minimal top nav ── */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-5"
          style={{ height: 52, background: '#ffffff', borderBottom: '1px solid rgba(30,30,60,0.08)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 -ml-1 rounded-lg flex-shrink-0"
              style={{ color: '#475569' }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/clawshow-logo.png" alt="ClawShow" width={28} height={28} className="rounded-lg flex-shrink-0" />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[14px] font-bold truncate" style={{ color: '#1c1c2e' }}>
                Knowledge Map AI
              </span>
              <span className="hidden sm:block text-[10.5px]" style={{ color: '#9494ad' }}>
                Turn scattered information into a living knowledge map.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{ background: 'rgba(99,102,241,0.08)', color: '#4f46e5' }}
            >
              <span className="hidden sm:inline">Demo: </span>{dataset.label}
            </span>
            <span className="hidden sm:inline text-[11px]" style={{ color: '#9494ad' }}>
              by ClawShow AI
            </span>
          </div>
        </header>

        {/* ── 3-column layout (sidebar becomes an off-canvas drawer on mobile) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Mobile backdrop */}
          {isMobile && sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <LeftSidebar
            demo={demo}
            onDemoChange={handleDemoChange}
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            focusType={focusType}
            onSourceFocus={handleSourceFocus}
            onSourceAdd={handleSourceAdd}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 overflow-hidden relative">
            {/* View switcher: Explore in 3D, Work in 2D */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
              <div
                className="flex items-center gap-0.5 p-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 10px rgba(15,23,42,0.08)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {(['2d', '3d'] as ViewMode[]).map((m) => {
                  const active = viewMode === m
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setViewMode(m)
                        if (m === '3d') setMounted3D(true)
                      }}
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

            {/* Both views stay MOUNTED; we only toggle visibility so switching
                never re-lays-out / re-fits → no size jump on 2D↔3D switch. */}
            <div
              className="absolute inset-0"
              style={{ visibility: viewMode === '2d' ? 'visible' : 'hidden' }}
            >
              <KnowledgeGraph
                nodes={dataset.nodes}
                edges={dataset.edges}
                selectedNodeId={selectedNodeId}
                onNodeSelect={handleNodeSelect}
                activeFilters={activeFilters}
                focusType={focusType}
                focusNonce={focusNonce}
                isMobile={isMobile}
              />
            </div>
            {mounted3D && (
              <div
                className="absolute inset-0"
                style={{ visibility: viewMode === '3d' ? 'visible' : 'hidden' }}
              >
                <ThreeDSpaceGraph
                  nodes={dataset.nodes}
                  edges={dataset.edges}
                  selectedNodeId={selectedNodeId}
                  onNodeSelect={handleNodeSelect}
                />
              </div>
            )}
          </main>

          <NodeMemoryPanel
            node={selectedNodeData}
            nodeId={selectedNodeId}
            connectedNodes={connectedNodes}
            onClose={() => setSelectedNodeId(null)}
            isMobile={isMobile}
          />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
