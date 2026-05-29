'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Link2, Clock, HelpCircle, Zap, Info } from 'lucide-react'
import { type KnowledgeNodeData, type ConnectedNodeInfo } from '@/types'
import { ENTITY_COLORS, ENTITY_LABELS } from '../graph/entityColors'

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ color: '#9494ad' }}>{icon}</span>
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#9494ad' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

interface Props {
  node: KnowledgeNodeData | null
  nodeId: string | null
  connectedNodes: ConnectedNodeInfo[]
  onClose: () => void
  isMobile?: boolean
}

export function NodeMemoryPanel({ node, nodeId, connectedNodes, onClose, isMobile }: Props) {
  const color = node ? ENTITY_COLORS[node.entityType] : '#6366f1'

  // Mobile: bottom sheet sliding up. Desktop: right side column sliding in.
  const motionProps = isMobile
    ? {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '100%', opacity: 0 },
      }
    : {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 },
      }

  const sheetStyle: React.CSSProperties = isMobile
    ? {
        background: '#ffffff',
        borderTop: '1px solid rgba(30,30,60,0.08)',
        boxShadow: '0 -8px 30px rgba(15,23,42,0.18)',
      }
    : {
        width: 320,
        background: '#ffffff',
        borderLeft: '1px solid rgba(30,30,60,0.08)',
        boxShadow: '-10px 0 30px rgba(15,23,42,0.08)',
      }

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={nodeId}
          {...motionProps}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          style={sheetStyle}
          className={
            isMobile
              ? 'fixed bottom-0 inset-x-0 z-50 max-h-[52vh] rounded-t-2xl flex flex-col overflow-hidden'
              : // Desktop: float OVER the graph (absolute) so selecting a node
                // never resizes the canvas → no 2D/3D jitter on click.
                'absolute right-0 top-0 bottom-0 z-30 flex flex-col overflow-hidden'
          }
        >
          {/* Mobile grab handle */}
          {isMobile && (
            <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
              <span className="w-9 h-1 rounded-full" style={{ background: '#d4d4dc' }} />
            </div>
          )}
          {/* Header */}
          <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(30,30,60,0.07)' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold"
                    style={{ color }}
                  >
                    {ENTITY_LABELS[node.entityType]}
                  </span>
                </div>
                <h2 className="text-[15px] font-semibold leading-tight" style={{ color: '#1c1c2e' }}>
                  {node.label}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md flex-shrink-0 transition-colors"
                style={{ color: '#9494ad' }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <Section icon={<Info size={12} />} title="Summary">
              <p className="text-[12.5px] leading-relaxed" style={{ color: '#4a4a60' }}>
                {node.summary}
              </p>
            </Section>

            {connectedNodes.length > 0 && (
              <Section icon={<Link2 size={12} />} title="Connected To">
                <ul className="space-y-1.5">
                  {connectedNodes.map((cn) => (
                    <li key={cn.id} className="flex items-start gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                        style={{ background: ENTITY_COLORS[cn.entityType] }}
                      />
                      <span className="text-[12px] leading-tight" style={{ color: '#5a5a70' }}>
                        <span className="font-medium" style={{ color: '#2c2c42' }}>{cn.label}</span>
                        <span className="mx-1" style={{ color: '#c4c4d4' }}>·</span>
                        <span style={{ fontStyle: 'italic', color: '#9494ad' }}>{cn.edgeLabel}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {node.sourceNotes.length > 0 && (
              <Section icon={<FileText size={12} />} title="Source Notes">
                <ul className="space-y-1">
                  {node.sourceNotes.map((n, i) => (
                    <li key={i} className="text-[12px]" style={{ color: '#7a7a90' }}>{n}</li>
                  ))}
                </ul>
              </Section>
            )}

            {node.recentActivity.length > 0 && (
              <Section icon={<Clock size={12} />} title="Recent Activity">
                <ul className="space-y-1.5">
                  {node.recentActivity.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#d0d0dc' }} />
                      <span className="text-[12px]" style={{ color: '#6a6a80' }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {node.relatedQuestions.length > 0 && (
              <Section icon={<HelpCircle size={12} />} title="Related Questions">
                <ul className="space-y-1.5">
                  {node.relatedQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="text-[12px] px-3 py-2 rounded-lg"
                      style={{
                        background: 'rgba(99,102,241,0.06)',
                        color: '#4f46e5',
                        borderLeft: '2px solid rgba(99,102,241,0.30)',
                      }}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {node.possibleActions.length > 0 && (
              <Section icon={<Zap size={12} />} title="Possible Actions">
                <ul className="space-y-1.5">
                  {node.possibleActions.map((a, i) => (
                    <li
                      key={i}
                      className="text-[12px] px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 hover:brightness-95"
                      style={{ background: color + '12', color, border: '1px solid ' + color + '30' }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
