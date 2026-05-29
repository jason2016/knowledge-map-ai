'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  useNodesInitialized,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeTypes,
} from '@xyflow/react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
} from 'd3-force'
import { CustomNode } from './CustomNode'
import { FloatingEdge } from './FloatingEdge'
import { GraphInteractionContext } from './graphInteraction'
import { ENTITY_COLORS, ENTITY_LABELS } from './entityColors'
import { type KnowledgeNodeData, type KnowledgeEdgeData, type EntityType } from '@/types'
import type { EdgeTypes } from '@xyflow/react'

const nodeTypes: NodeTypes = { knowledgeNode: CustomNode }
const edgeTypes: EdgeTypes = { floating: FloatingEdge }

interface SimNode extends SimulationNodeDatum {
  id: string
}
interface SimLink {
  source: string
  target: string
  weight: number
}

interface Props {
  nodes: Node<KnowledgeNodeData>[]
  edges: Edge<KnowledgeEdgeData>[]
  selectedNodeId: string | null
  onNodeSelect: (id: string | null) => void
  activeFilters: EntityType[]
  focusType: EntityType | null
  focusNonce: number
  isMobile?: boolean
}

export function KnowledgeGraph({
  nodes,
  edges,
  selectedNodeId,
  onNodeSelect,
  activeFilters,
  focusType,
  focusNonce,
  isMobile,
}: Props) {
  const { fitView } = useReactFlow()
  const nodesInitialized = useNodesInitialized()
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [rfNodes, setRfNodes] = useState<Node<KnowledgeNodeData>[]>([])

  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null)
  const simNodesRef = useRef<SimNode[]>([])
  const fitPendingRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Filtered node / edge sets ──
  const filteredNodes = useMemo(() => {
    if (activeFilters.length === 0) return nodes
    return nodes.filter((n) => activeFilters.includes(n.data.entityType))
  }, [nodes, activeFilters])

  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((n) => n.id)),
    [filteredNodes]
  )

  const filteredEdges = useMemo(() => {
    if (activeFilters.length === 0) return edges
    return edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    )
  }, [edges, filteredNodeIds, activeFilters])

  const datasetKey = useMemo(
    () =>
      filteredNodes.map((n) => n.id).join(',') +
      '|' +
      filteredEdges.map((e) => e.id).join(','),
    [filteredNodes, filteredEdges]
  )

  // ── Build a settled, low-crossing layout up front, then keep a (parked)
  //    simulation around so dragging a node makes its neighbors react. ──
  useEffect(() => {
    const n = filteredNodes.length
    const simNodes: SimNode[] = filteredNodes.map((node, i) => {
      const angle = (i / Math.max(n, 1)) * Math.PI * 2
      return { id: node.id, x: Math.cos(angle) * 300, y: Math.sin(angle) * 300 }
    })
    const simLinks: SimLink[] = filteredEdges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: (e.data?.weight as number) ?? 1,
    }))
    simNodesRef.current = simNodes

    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          // longer links + spread out hubs => far fewer edge crossings
          .distance((l) => 190 - l.weight * 18)
          .strength((l) => 0.2 + l.weight * 0.12)
      )
      .force('charge', forceManyBody().strength(-900).distanceMax(900))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide(72))
      .stop()

    // Settle synchronously so the FULL graph is laid out before first paint
    for (let i = 0; i < 500; i++) sim.tick()

    const sync = () => {
      setRfNodes(
        filteredNodes.map((node) => {
          const sn = simNodes.find((s) => s.id === node.id)
          return { ...node, position: { x: sn?.x ?? 0, y: sn?.y ?? 0 } }
        })
      )
    }
    sim.on('tick', sync)
    sync()

    simRef.current = sim
    fitPendingRef.current = true
    return () => {
      sim.stop()
      sim.on('tick', null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetKey])

  // ── Frame the whole map only AFTER every node has been measured, so the
  //    bounding box (and therefore the centering) is correct. ──
  useEffect(() => {
    if (!fitPendingRef.current || !nodesInitialized || rfNodes.length === 0) return
    fitPendingRef.current = false
    const id = window.requestAnimationFrame(() =>
      fitView({ padding: 0.3, duration: 500, minZoom: 0.05, maxZoom: 1.2 })
    )
    return () => window.cancelAnimationFrame(id)
  }, [nodesInitialized, rfNodes, fitView])

  // ── Re-fit whenever the canvas resizes (mobile/desktop switch, rotation,
  //    window resize) so all nodes always stay framed. ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let t: number | undefined
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        fitView({ padding: isMobile ? 0.18 : 0.3, duration: 300, minZoom: 0.05, maxZoom: 1.2 })
      }, 150)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      window.clearTimeout(t)
    }
  }, [fitView, isMobile])

  // ── Ids of all nodes belonging to the focused data source (entity type) ──
  const focusNodeIds = useMemo(() => {
    if (!focusType) return new Set<string>()
    return new Set(
      rfNodes.filter((n) => n.data.entityType === focusType).map((n) => n.id)
    )
  }, [rfNodes, focusType])

  // ── Auto-fit the view to the focused data source's node(s) ──
  useEffect(() => {
    if (!focusType || !nodesInitialized) return
    const focusNodes = rfNodes
      .filter((n) => n.data.entityType === focusType)
      .map((n) => ({ id: n.id }))
    if (focusNodes.length === 0) return
    const raf = window.requestAnimationFrame(() =>
      fitView({ nodes: focusNodes, padding: 0.6, duration: 600, maxZoom: 1.4 })
    )
    return () => window.cancelAnimationFrame(raf)
    // focusNonce makes re-clicking the same source re-focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNonce, focusType, nodesInitialized])

  // ── Active node = hover priority, else selection ──
  const activeNodeId = hoveredNodeId ?? selectedNodeId

  const neighborIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>()
    const s = new Set<string>()
    filteredEdges.forEach((e) => {
      if (e.source === activeNodeId) s.add(e.target)
      if (e.target === activeNodeId) s.add(e.source)
    })
    return s
  }, [activeNodeId, filteredEdges])

  // Degree (connection count) per node — drives Rowboat-style sizing (hubs bigger).
  const degreeMap = useMemo(() => {
    const m = new Map<string, number>()
    filteredEdges.forEach((e) => {
      m.set(e.source, (m.get(e.source) ?? 0) + 1)
      m.set(e.target, (m.get(e.target) ?? 0) + 1)
    })
    return m
  }, [filteredEdges])

  // Nodes passed to React Flow. These change ONLY when the layout/dataset
  // changes — never on hover — so React Flow never re-measures on hover.
  const sizedNodes = useMemo(
    () =>
      rfNodes.map((n) => {
        const deg = degreeMap.get(n.id) ?? 0
        const size = 38 + Math.min(deg, 6) * 4 // 38..62px
        return { ...n, data: { ...n.data, _size: size } }
      }),
    [rfNodes, degreeMap]
  )

  // Edges are referentially stable across hover; FloatingEdge styles itself
  // from context, so the edges array never churns on hover either.
  const floatingEdges = useMemo(
    () => filteredEdges.map((e) => ({ ...e, type: 'floating' })),
    [filteredEdges]
  )

  const contextValue = useMemo(
    () => ({ activeNodeId, selectedNodeId, neighborIds, focusType, focusNodeIds }),
    [activeNodeId, selectedNodeId, neighborIds, focusType, focusNodeIds]
  )

  // ── Drag: pin node into the simulation so neighbors gently react ──
  const onNodeDragStart: NodeMouseHandler = useCallback((_, node) => {
    const sn = simNodesRef.current.find((s) => s.id === node.id)
    if (sn) {
      sn.fx = node.position.x
      sn.fy = node.position.y
    }
    simRef.current?.alphaTarget(0.25).restart()
  }, [])

  const onNodeDrag: NodeMouseHandler = useCallback((_, node) => {
    const sn = simNodesRef.current.find((s) => s.id === node.id)
    if (sn) {
      sn.fx = node.position.x
      sn.fy = node.position.y
    }
  }, [])

  const onNodeDragStop: NodeMouseHandler = useCallback((_, node) => {
    const sn = simNodesRef.current.find((s) => s.id === node.id)
    if (sn) {
      sn.fx = null
      sn.fy = null
    }
    simRef.current?.alphaTarget(0)
  }, [])

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => onNodeSelect(node.id === selectedNodeId ? null : node.id),
    [selectedNodeId, onNodeSelect]
  )
  const onPaneClick = useCallback(() => onNodeSelect(null), [onNodeSelect])
  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => setHoveredNodeId(node.id),
    []
  )
  const onNodeMouseLeave = useCallback(() => setHoveredNodeId(null), [])

  const legendTypes = useMemo(() => {
    const seen: EntityType[] = []
    filteredNodes.forEach((n) => {
      if (!seen.includes(n.data.entityType)) seen.push(n.data.entityType)
    })
    return seen
  }, [filteredNodes])

  return (
    <GraphInteractionContext.Provider value={contextValue}>
      <div ref={containerRef} className="w-full h-full relative" style={{ background: '#ffffff' }}>
        <ReactFlow
          nodes={sizedNodes}
          edges={floatingEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          fitView
          fitViewOptions={{ padding: 0.3, minZoom: 0.05 }}
          minZoom={0.1}
          maxZoom={2.5}
          nodesDraggable
          panOnDrag
          zoomOnScroll
          elevateNodesOnSelect={false}
          elevateEdgesOnSelect={false}
          selectNodesOnDrag={false}
          nodesFocusable={false}
          edgesFocusable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#cbd5e1" />
          <Controls showInteractive={false} />
          {!isMobile && (
            <MiniMap
              pannable
              zoomable
              style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
              nodeColor={(n) =>
                ENTITY_COLORS[(n.data as KnowledgeNodeData).entityType] ?? '#94a3b8'
              }
              nodeStrokeWidth={0}
              maskColor="rgba(255,255,255,0.65)"
            />
          )}
        </ReactFlow>

        {/* ── Bottom-left legend (hidden on mobile to keep the map clean) ── */}
        <div
          className={
            (isMobile ? 'hidden ' : 'flex ') +
            'absolute bottom-4 left-4 flex-wrap gap-x-3 gap-y-1.5 px-3 py-2 rounded-xl max-w-[340px] pointer-events-none'
          }
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #e5e7eb',
            backdropFilter: 'blur(6px)',
          }}
        >
          {legendTypes.map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: ENTITY_COLORS[t] }} />
              <span className="text-[10.5px]" style={{ color: '#64748b' }}>
                {ENTITY_LABELS[t]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GraphInteractionContext.Provider>
  )
}
