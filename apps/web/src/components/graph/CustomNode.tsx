'use client'
import { memo, useContext } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { type KnowledgeNodeData, type EntityType } from '@/types'
import { ENTITY_COLORS } from './entityColors'
import { GraphInteractionContext } from './graphInteraction'

const ICONS: Record<EntityType, string> = {
  client: '👤', company: '🏢', invoice: '📄', vatRule: '⚖️', deadline: '⏰',
  missingDoc: '❗', email: '✉️', case: '📁', action: '⚡',
  exhibition: '🎪', exhibitor: '🖼️', booth: '🏛️', visitor: '👥', lead: '🎯',
  campaign: '📣', content: '📑', partner: '🤝', opportunity: '💡', followup: '🔔',
}

// The node's measured box is EXACTLY the circle. The label is absolutely
// positioned below and does NOT affect the box. Highlight/dim/select are read
// from context, so the nodes array never changes on hover → no jitter.
export const CustomNode = memo(({ id, data }: NodeProps) => {
  const d = data as KnowledgeNodeData & { _size?: number }
  const color = ENTITY_COLORS[d.entityType] ?? '#6366f1'
  const CIRCLE = d._size ?? 44

  const { activeNodeId, selectedNodeId, neighborIds, focusType, focusNodeIds } =
    useContext(GraphInteractionContext)

  const selected = id === selectedNodeId
  let highlighted = false
  let dim = false
  if (activeNodeId) {
    highlighted = id === activeNodeId || neighborIds.has(id)
    dim = !highlighted
  } else if (focusType) {
    highlighted = focusNodeIds.has(id)
    dim = !highlighted
  }
  const emphasized = selected || highlighted

  const shadow = selected
    ? `0 0 0 4px ${color}55, 0 4px 14px ${color}66`
    : emphasized
    ? `0 0 0 3px ${color}40, 0 3px 10px ${color}4d`
    : '0 2px 6px rgba(15,23,42,0.18)'

  return (
    <div
      style={{
        position: 'relative',
        width: CIRCLE,
        height: CIRCLE,
        boxSizing: 'border-box',
        opacity: dim ? 0.42 : 1,
        transition: 'opacity 0.22s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
      />
      <div
        style={{
          width: CIRCLE,
          height: CIRCLE,
          boxSizing: 'border-box',
          borderRadius: '50%',
          background: color,
          border: '2px solid #ffffff',
          boxShadow: shadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: CIRCLE * 0.4,
          lineHeight: 1,
          transition: 'box-shadow 0.2s ease',
        }}
      >
        <span>{ICONS[d.entityType]}</span>
      </div>
      <span
        style={{
          position: 'absolute',
          top: CIRCLE + 5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 100,
          textAlign: 'center',
          fontSize: 9.5,
          fontWeight: 600,
          lineHeight: 1.15,
          color: emphasized ? '#0f172a' : '#64748b',
          pointerEvents: 'none',
          transition: 'color 0.22s ease',
        }}
      >
        {d.label}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
      />
    </div>
  )
})

CustomNode.displayName = 'CustomNode'
