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

// Light-themed 2D graph that visually matches the homepage 2D Map: white
// background with a subtle dot grid (the same look React Flow's `Background`
// gives the homepage), circular nodes with colour-coded fills, soft floating
// edges that brighten into indigo when in focus.
//
// Layout is pre-settled with d3-force and pinned, so the user can't drag the
// graph into chaos and nothing animates on its own. Step focus is purely a
// visual treatment.
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

  const positions = useMemo(() => {
    if (size.w === 0 || size.h === 0) return new Map<string, { x: number; y: number }>()
    const simNodes: SimNode[] = nodes.map((n, i) => ({
      id: n.id,
      x: Math.cos((i / nodes.length) * Math.PI * 2) * 240,
      y: Math.sin((i / nodes.length) * Math.PI * 2) * 240,
    }))
    const simLinks: SimLink[] = edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation<SimNode>(simNodes)
      .force('link', forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(150).strength(0.5))
      .force('charge', forceManyBody().strength(-560).distanceMax(900))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide(52))
      .stop()
    for (let i = 0; i < 400; i++) sim.tick()
    const m = new Map<string, { x: number; y: number }>()
    simNodes.forEach((n) => m.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 }))
    return m
  }, [nodes, edges, size.w, size.h])

  const viewBox = useMemo(() => {
    if (positions.size === 0) return '-400 -300 800 600'
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    positions.forEach((p) => {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    })
    const m = 110
    return `${minX - m} ${minY - m} ${maxX - minX + m * 2} ${maxY - minY + m * 2}`
  }, [positions])

  const anyFocus = focusNodeIds.size > 0

  return (
    <div
      ref={wrapRef}
      className="w-full h-full"
      style={{ background: '#ffffff' }}
    >
      {size.w > 0 && size.h > 0 && (
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          onClick={(e) => {
            if (e.target === e.currentTarget) onSelect(null)
          }}
        >
          <defs>
            {/* Same feel as the homepage React Flow dot background. */}
            <pattern id="demo-2d-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#cbd5e1" />
            </pattern>
          </defs>
          <rect
            x={viewBox.split(' ')[0]}
            y={viewBox.split(' ')[1]}
            width={viewBox.split(' ')[2]}
            height={viewBox.split(' ')[3]}
            fill="url(#demo-2d-dots)"
          />

          {/* Edges. */}
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
                    stroke={inFocus ? '#6366f1' : '#9aa6bd'}
                    strokeWidth={inFocus ? 2 : 1.2}
                    strokeOpacity={dim ? 0.18 : inFocus ? 1 : 0.75}
                  />
                  {e.label && inFocus && (
                    <g>
                      {/* label backdrop, mimicking the homepage edge label chip */}
                      <rect
                        x={mx - (e.label.length * 3.4)}
                        y={my - 11}
                        width={e.label.length * 6.8}
                        height={14}
                        rx={3}
                        fill="#f8fafc"
                        stroke="#e2e8f0"
                        strokeWidth={0.5}
                      />
                      <text
                        x={mx}
                        y={my - 1}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight={600}
                        fill="#4338ca"
                        style={{ pointerEvents: 'none' }}
                      >
                        {e.label}
                      </text>
                    </g>
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
              const ringColor = n.status && n.status !== 'idle' ? STATUS_COLORS[n.status] : baseColor
              const r = 26
              const opacity = dim ? 0.32 : 1
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
                  {(isSelected || inFocus) && (
                    <circle
                      r={r + 10}
                      fill={baseColor}
                      opacity={isSelected ? 0.18 : 0.10}
                    />
                  )}
                  {n.status === 'running' && !dim && (
                    <circle
                      r={r + 4}
                      fill="none"
                      stroke={STATUS_COLORS.running}
                      strokeWidth={2}
                      opacity={0.75}
                    >
                      <animate
                        attributeName="r"
                        values={`${r + 4};${r + 12};${r + 4}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.75;0.15;0.75"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <circle
                    r={r}
                    fill={baseColor}
                    opacity={opacity}
                    stroke={isSelected ? '#1c1c2e' : ringColor}
                    strokeWidth={isSelected ? 2.5 : n.status && n.status !== 'idle' ? 2 : 1.5}
                  />
                  {/* a soft inner ring for the same depth feel as homepage nodes */}
                  <circle r={r - 6} fill="#ffffff" opacity={dim ? 0.35 : 0.18} />
                  <text
                    y={r + 16}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={inFocus || isSelected ? 600 : 500}
                    fill={dim ? '#94a3b8' : isSelected ? '#1c1c2e' : '#475569'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {n.label}
                  </text>
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
