'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3-force'
import { type DemoEdge, type DemoNode } from '@/types/demo'
import { STATUS_COLORS, colorForType } from './demoColors'

interface SimNode extends SimulationNodeDatum {
  id: string
}
interface SimLink {
  source: string
  target: string
}

interface Props {
  nodes: DemoNode[]
  edges: DemoEdge[]
  focusNodeIds: Set<string>
  focusEdgeIds: Set<string>
  selectedNodeId: string | null
  onSelect: (id: string | null) => void
}

// Lightweight dark-themed 2D graph: pre-settled d3-force layout rendered as
// SVG. Focus = brighter; non-focus = dimmed. Click a node to select.
export function DemoGraphCanvas2D({
  nodes,
  edges,
  focusNodeIds,
  focusEdgeIds,
  selectedNodeId,
  onSelect,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight })
    )
    ro.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Pre-settle the layout once per dataset / size. Positions are then fixed —
  // no engine runs while the user interacts.
  const positions = useMemo(() => {
    if (size.w === 0 || size.h === 0) return new Map<string, { x: number; y: number }>()
    const simNodes: SimNode[] = nodes.map((n, i) => ({
      id: n.id,
      x: Math.cos((i / nodes.length) * Math.PI * 2) * 240,
      y: Math.sin((i / nodes.length) * Math.PI * 2) * 240,
    }))
    const simLinks: SimLink[] = edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation<SimNode>(simNodes)
      .force('link', forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(140).strength(0.5))
      .force('charge', forceManyBody().strength(-520).distanceMax(900))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide(48))
      .stop()
    for (let i = 0; i < 400; i++) sim.tick()
    const m = new Map<string, { x: number; y: number }>()
    simNodes.forEach((n) => m.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 }))
    return m
  }, [nodes, edges, size.w, size.h])

  // Compute layout bounds → viewBox, with margin.
  const viewBox = useMemo(() => {
    if (positions.size === 0) return '-400 -300 800 600'
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    positions.forEach((p) => {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    })
    const m = 100
    return `${minX - m} ${minY - m} ${maxX - minX + m * 2} ${maxY - minY + m * 2}`
  }, [positions])

  const anyFocus = focusNodeIds.size > 0

  return (
    <div ref={wrapRef} className="w-full h-full">
      {size.w > 0 && size.h > 0 && (
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          onClick={(e) => {
            // Click on empty canvas → deselect.
            if (e.target === e.currentTarget) onSelect(null)
          }}
        >
          {/* Edges first, so nodes draw on top. */}
          <g>
            {edges.map((e) => {
              const s = positions.get(e.source)
              const t = positions.get(e.target)
              if (!s || !t) return null
              const inFocus =
                focusEdgeIds.has(e.id) ||
                (focusNodeIds.has(e.source) && focusNodeIds.has(e.target))
              const dim = anyFocus && !inFocus
              const mx = (s.x + t.x) / 2
              const my = (s.y + t.y) / 2
              return (
                <g key={e.id}>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={inFocus ? '#a5b4fc' : '#475569'}
                    strokeWidth={inFocus ? 2 : 1.1}
                    strokeOpacity={dim ? 0.18 : inFocus ? 0.95 : 0.5}
                  />
                  {e.label && inFocus && (
                    <text
                      x={mx}
                      y={my - 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#cbd5e1"
                      style={{ pointerEvents: 'none', fontStyle: 'italic' }}
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              )
            })}
          </g>

          {/* Nodes. */}
          <g>
            {nodes.map((n) => {
              const p = positions.get(n.id)
              if (!p) return null
              const isSelected = n.id === selectedNodeId
              const inFocus = focusNodeIds.has(n.id)
              const dim = anyFocus && !inFocus && !isSelected
              const baseColor = colorForType(n.type)
              const ringColor = n.status ? STATUS_COLORS[n.status] : baseColor
              const r = 26
              const opacity = dim ? 0.28 : 1
              return (
                <g
                  key={n.id}
                  transform={`translate(${p.x},${p.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    onSelect(n.id === selectedNodeId ? null : n.id)
                  }}
                >
                  {/* Halo when selected / focused */}
                  {(isSelected || inFocus) && (
                    <circle
                      r={r + 10}
                      fill={baseColor}
                      opacity={isSelected ? 0.22 : 0.12}
                    />
                  )}
                  {/* Status ring (animated for running) */}
                  {n.status === 'running' && !dim && (
                    <circle
                      r={r + 4}
                      fill="none"
                      stroke={STATUS_COLORS.running}
                      strokeWidth={2}
                      opacity={0.7}
                    >
                      <animate
                        attributeName="r"
                        values={`${r + 4};${r + 12};${r + 4}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.7;0.15;0.7"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {/* Solid node */}
                  <circle
                    r={r}
                    fill={baseColor}
                    opacity={opacity}
                    stroke={isSelected ? '#ffffff' : ringColor}
                    strokeWidth={isSelected ? 2.5 : n.status && n.status !== 'idle' ? 2 : 1}
                  />
                  {/* Inner subtle gradient feel via a smaller lit circle */}
                  <circle r={r * 0.7} fill="#0f172a" opacity={dim ? 0.4 : 0.18} />
                  {/* Label */}
                  <text
                    y={r + 16}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={inFocus || isSelected ? 600 : 500}
                    fill={dim ? '#475569' : isSelected ? '#ffffff' : '#e2e8f0'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {n.label}
                  </text>
                  {/* Status badge */}
                  {n.status && n.status !== 'idle' && !dim && (
                    <text
                      y={r + 30}
                      textAnchor="middle"
                      fontSize="9"
                      fill={STATUS_COLORS[n.status]}
                      style={{ pointerEvents: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      {n.status}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      )}
    </div>
  )
}
