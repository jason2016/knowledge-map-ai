'use client'
import { useContext } from 'react'
import {
  EdgeLabelRenderer,
  getStraightPath,
  useInternalNode,
  type EdgeProps,
  type InternalNode,
  type Node,
} from '@xyflow/react'
import { GraphInteractionContext } from './graphInteraction'

interface Geo {
  x: number
  y: number
  r: number
}

function centerOf(node: InternalNode<Node>): Geo {
  const w = node.measured?.width ?? 44
  const h = node.measured?.height ?? 44
  return {
    x: (node.internals.positionAbsolute?.x ?? 0) + w / 2,
    y: (node.internals.positionAbsolute?.y ?? 0) + h / 2,
    r: Math.min(w, h) / 2,
  }
}

function perimeter(a: Geo, b: Geo) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const d = Math.hypot(dx, dy) || 1
  return { x: a.x + (dx / d) * a.r, y: a.y + (dy / d) * a.r }
}

export function FloatingEdge({ source, target, label }: EdgeProps) {
  const s = useInternalNode(source)
  const t = useInternalNode(target)
  const { activeNodeId } = useContext(GraphInteractionContext)
  if (!s || !t) return null

  const cs = centerOf(s)
  const ct = centerOf(t)
  const ps = perimeter(cs, ct)
  const pt = perimeter(ct, cs)
  const [path] = getStraightPath({
    sourceX: ps.x,
    sourceY: ps.y,
    targetX: pt.x,
    targetY: pt.y,
  })

  const touching = !!activeNodeId && (source === activeNodeId || target === activeNodeId)
  const dim = !!activeNodeId && !touching

  const mx = (ps.x + pt.x) / 2
  const my = (ps.y + pt.y) / 2

  return (
    <>
      <path
        d={path}
        fill="none"
        className={
          touching ? 'react-flow__edge-path km-edge-flow' : 'react-flow__edge-path'
        }
        style={{
          stroke: touching ? '#6366f1' : '#9aa6bd',
          strokeWidth: touching ? 2 : 1.2,
          strokeOpacity: touching ? 1 : 0.8,
          opacity: dim ? 0.15 : 1,
        }}
      />
      {label && !dim && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${mx}px, ${my}px)`,
              background: '#f8fafc',
              padding: '0 3px',
              borderRadius: 3,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              fontSize: 9,
              fontWeight: touching ? 600 : 500,
              color: touching ? '#4338ca' : '#94a3b8',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
