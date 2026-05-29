'use client'
import { useState, useMemo, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { LeftSidebar } from '@/components/sidebar/LeftSidebar'
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph'
import { NodeMemoryPanel } from '@/components/panel/NodeMemoryPanel'
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
        return
      }
      setAddedBatchIds((prev) => ({
        ...prev,
        [demo]: [...prev[demo], next.node.id],
      }))
      setSelectedNodeId(null)
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
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/clawshow-logo.png" alt="ClawShow" width={28} height={28} className="rounded-lg" />
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-bold" style={{ color: '#1c1c2e' }}>
                Knowledge Map AI
              </span>
              <span className="text-[10.5px]" style={{ color: '#9494ad' }}>
                Turn scattered information into a living knowledge map.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-[11px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(99,102,241,0.08)', color: '#4f46e5' }}
            >
              Demo: {dataset.label}
            </span>
            <span className="text-[11px]" style={{ color: '#9494ad' }}>
              by ClawShow AI
            </span>
          </div>
        </header>

        {/* ── 3-column layout ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <LeftSidebar
            demo={demo}
            onDemoChange={handleDemoChange}
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            focusType={focusType}
            onSourceFocus={handleSourceFocus}
            onSourceAdd={handleSourceAdd}
          />

          <main className="flex-1 min-w-0 overflow-hidden">
            <KnowledgeGraph
              nodes={dataset.nodes}
              edges={dataset.edges}
              selectedNodeId={selectedNodeId}
              onNodeSelect={handleNodeSelect}
              activeFilters={activeFilters}
              focusType={focusType}
              focusNonce={focusNonce}
            />
          </main>

          <NodeMemoryPanel
            node={selectedNodeData}
            nodeId={selectedNodeId}
            connectedNodes={connectedNodes}
            onClose={() => setSelectedNodeId(null)}
          />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
