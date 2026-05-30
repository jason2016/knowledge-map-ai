'use client'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  X,
  Zap,
  FileText,
  GitBranch,
  Info,
  Rocket,
  RefreshCw,
  ArrowRightCircle,
} from 'lucide-react'
import { type ContextPack, type ContextPackAction } from '@/types/context-pack'

interface Props {
  pack: ContextPack
  onClose: () => void
}

const PRIORITY_RANK: Record<string, number> = { P0: 0, P1: 1, P2: 2 }
const PRIORITY_COLOR: Record<string, string> = {
  P0: '#dc2626',
  P1: '#f59e0b',
  P2: '#0ea5e9',
}

function SectionHeader({
  icon,
  title,
  open,
  onClick,
  count,
}: {
  icon: React.ReactNode
  title: string
  open: boolean
  onClick: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1.5 px-2 py-1.5 text-left"
      style={{ color: '#475569' }}
    >
      {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      <span style={{ color: '#9494ad' }}>{icon}</span>
      <span className="text-[10.5px] uppercase tracking-widest font-semibold">{title}</span>
      {typeof count === 'number' && (
        <span className="ml-auto text-[10px]" style={{ color: '#9494ad' }}>
          {count}
        </span>
      )}
    </button>
  )
}

export function ContextPackPanel({ pack, onClose }: Props) {
  const [openSummary, setOpenSummary] = useState(true)
  const [openCausality, setOpenCausality] = useState(false)
  const [openActions, setOpenActions] = useState(true)
  const [openFuturePlan, setOpenFuturePlan] = useState(false)
  const [openSources, setOpenSources] = useState(false)
  const [openWriteBack, setOpenWriteBack] = useState(false)
  const [openIncremental, setOpenIncremental] = useState(false)

  const sortedActions: ContextPackAction[] = (pack.actions ?? [])
    .slice()
    .sort((a, b) => (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9))

  return (
    <div
      className="absolute bottom-3 left-3 z-20 w-[320px] max-h-[70vh] flex flex-col rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.96)',
        border: '1px solid #e5e7eb',
        boxShadow: '0 6px 24px rgba(15,23,42,0.12)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest" style={{ color: '#9494ad' }}>
            Context Pack
          </div>
          <div
            className="text-[12px] font-semibold truncate"
            style={{ color: '#1c1c2e' }}
            title={pack.target?.name ?? pack.pack_id}
          >
            {pack.target?.name ?? pack.pack_id}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ color: '#94a3b8' }}>
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Summary */}
        <SectionHeader
          icon={<Info size={11} />}
          title="Summary"
          open={openSummary}
          onClick={() => setOpenSummary((v) => !v)}
        />
        {openSummary && (
          <div className="px-3 pb-3">
            <p className="text-[12px] leading-relaxed" style={{ color: '#334155' }}>
              {pack.summary.direct_answer}
            </p>
            {pack.summary.key_facts && pack.summary.key_facts.length > 0 && (
              <ul className="mt-2 space-y-1">
                {pack.summary.key_facts.map((f, i) => (
                  <li
                    key={i}
                    className="text-[11.5px] leading-snug pl-2"
                    style={{ color: '#5a5a70', borderLeft: '2px solid #e2e8f0' }}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Causality */}
        {pack.causality && pack.causality.length > 0 && (
          <>
            <SectionHeader
              icon={<GitBranch size={11} />}
              title="Causality"
              open={openCausality}
              onClick={() => setOpenCausality((v) => !v)}
              count={pack.causality.length}
            />
            {openCausality && (
              <ol className="px-3 pb-3 space-y-1.5">
                {pack.causality.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="text-[10px] flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                      style={{ background: '#eef2ff', color: '#4f46e5' }}
                    >
                      {c.step}
                    </span>
                    <span className="text-[11.5px] leading-snug" style={{ color: '#475569' }}>
                      <span className="font-medium" style={{ color: '#1c1c2e' }}>
                        {c.node}
                      </span>
                      {c.relation && (
                        <span className="mx-1 italic" style={{ color: '#94a3b8' }}>
                          {c.relation}
                        </span>
                      )}
                      {c.next_node && (
                        <span className="font-medium" style={{ color: '#1c1c2e' }}>
                          {c.next_node}
                        </span>
                      )}
                      {c.explanation && (
                        <span className="block text-[10.5px] mt-0.5" style={{ color: '#94a3b8' }}>
                          {c.explanation}
                        </span>
                      )}
                      {c.evidence && (
                        <span
                          className="block text-[10px] mt-0.5 italic"
                          style={{ color: '#a3a3b8' }}
                        >
                          evidence: {c.evidence}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        {/* Actions */}
        {sortedActions.length > 0 && (
          <>
            <SectionHeader
              icon={<Zap size={11} />}
              title="Actions"
              open={openActions}
              onClick={() => setOpenActions((v) => !v)}
              count={sortedActions.length}
            />
            {openActions && (
              <ul className="px-3 pb-3 space-y-2">
                {sortedActions.map((a) => {
                  const color = PRIORITY_COLOR[a.priority] ?? '#64748b'
                  return (
                    <li
                      key={a.id}
                      className="rounded-lg p-2"
                      style={{ background: color + '0d', border: `1px solid ${color}30` }}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="text-[9.5px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: color, color: '#ffffff' }}
                        >
                          {a.priority}
                        </span>
                        <span className="text-[11.5px] font-semibold" style={{ color: '#1c1c2e' }}>
                          {a.title}
                        </span>
                      </div>
                      {a.description && (
                        <p className="text-[11px] leading-snug" style={{ color: '#475569' }}>
                          {a.description}
                        </p>
                      )}
                      {a.expected_result && (
                        <div className="mt-1 text-[10.5px] leading-snug">
                          <span className="font-semibold" style={{ color: '#475569' }}>
                            Expected:{' '}
                          </span>
                          <span style={{ color: '#5a5a70' }}>{a.expected_result}</span>
                        </div>
                      )}
                      {a.write_back_target && (
                        <div
                          className="mt-1 text-[10px] font-mono truncate"
                          style={{ color: '#94a3b8' }}
                          title={a.write_back_target}
                        >
                          ↳ {a.write_back_target}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                        {a.status && (
                          <span
                            className="text-[9.5px] px-1.5 py-0.5 rounded uppercase tracking-wide"
                            style={{
                              background: a.status === 'open' ? '#fef3c7' : '#dcfce7',
                              color: a.status === 'open' ? '#92400e' : '#166534',
                            }}
                          >
                            {a.status}
                          </span>
                        )}
                        {(a.related_nodes ?? []).map((id) => (
                          <span
                            key={id}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: '#f1f5f9', color: '#64748b' }}
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}

        {/* Sources */}
        {pack.sources && pack.sources.length > 0 && (
          <>
            <SectionHeader
              icon={<FileText size={11} />}
              title="Sources"
              open={openSources}
              onClick={() => setOpenSources((v) => !v)}
              count={pack.sources.length}
            />
            {openSources && (
              <ul className="px-3 pb-3 space-y-1.5">
                {pack.sources.map((s) => (
                  <li key={s.id} className="text-[11px]">
                    <div className="font-medium" style={{ color: '#1c1c2e' }}>
                      {s.title}
                      {s.relevance && (
                        <span
                          className="ml-1.5 text-[9.5px] px-1.5 py-0.5 rounded"
                          style={{ background: '#eef2ff', color: '#4f46e5' }}
                        >
                          {s.relevance}
                        </span>
                      )}
                    </div>
                    <div
                      className="text-[10.5px] font-mono truncate"
                      style={{ color: '#94a3b8' }}
                      title={s.path}
                    >
                      {s.path}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Future Plan */}
        {pack.future_plan && pack.future_plan.length > 0 && (
          <>
            <SectionHeader
              icon={<Rocket size={11} />}
              title="Future Plan"
              open={openFuturePlan}
              onClick={() => setOpenFuturePlan((v) => !v)}
              count={pack.future_plan.length}
            />
            {openFuturePlan && (
              <ul className="px-3 pb-3 space-y-2">
                {pack.future_plan.map((fp) => (
                  <li
                    key={fp.id}
                    className="rounded-lg p-2"
                    style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}
                  >
                    <div className="text-[11.5px] font-semibold" style={{ color: '#5b21b6' }}>
                      {fp.title}
                    </div>
                    {fp.description && (
                      <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#5a5a70' }}>
                        {fp.description}
                      </p>
                    )}
                    {fp.write_back_target && (
                      <div
                        className="mt-1 text-[10px] font-mono truncate"
                        style={{ color: '#8b5cf6' }}
                        title={fp.write_back_target}
                      >
                        ↳ {fp.write_back_target}
                      </div>
                    )}
                    {fp.related_nodes && fp.related_nodes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fp.related_nodes.map((id) => (
                          <span
                            key={id}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: '#ede9fe', color: '#6d28d9' }}
                          >
                            {id}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Suggested Write-Back */}
        {pack.suggested_write_back && pack.suggested_write_back.length > 0 && (
          <>
            <SectionHeader
              icon={<ArrowRightCircle size={11} />}
              title="Suggested Write-Back"
              open={openWriteBack}
              onClick={() => setOpenWriteBack((v) => !v)}
              count={pack.suggested_write_back.length}
            />
            {openWriteBack && (
              <ul className="px-3 pb-3 space-y-2">
                {pack.suggested_write_back.map((w, i) => (
                  <li
                    key={i}
                    className="rounded-lg p-2"
                    style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}
                  >
                    <div
                      className="text-[10px] uppercase tracking-widest font-semibold"
                      style={{ color: '#0369a1' }}
                    >
                      {w.type}
                    </div>
                    {w.target && (
                      <div
                        className="text-[10.5px] font-mono mt-0.5 break-all"
                        style={{ color: '#0c4a6e' }}
                      >
                        {w.target}
                      </div>
                    )}
                    {w.description && (
                      <p className="text-[11px] leading-snug mt-1" style={{ color: '#475569' }}>
                        {w.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Incremental Update */}
        {pack.incremental_update && (
          <>
            <SectionHeader
              icon={<RefreshCw size={11} />}
              title="Incremental Update"
              open={openIncremental}
              onClick={() => setOpenIncremental((v) => !v)}
            />
            {openIncremental && (
              <div
                className="mx-3 mb-3 rounded-lg p-2 text-[11px] space-y-1"
                style={{ background: '#fafafa', border: '1px solid #e5e7eb', color: '#475569' }}
              >
                {pack.incremental_update.mode && (
                  <div>
                    <span className="font-semibold">mode:</span>{' '}
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px]"
                      style={{ background: '#e0e7ff', color: '#4f46e5' }}
                    >
                      {pack.incremental_update.mode}
                    </span>
                  </div>
                )}
                {pack.incremental_update.previous_pack_id && (
                  <div className="break-all">
                    <span className="font-semibold">previous:</span>{' '}
                    {pack.incremental_update.previous_pack_id}
                  </div>
                )}
                {pack.incremental_update.related_pack_ids &&
                  pack.incremental_update.related_pack_ids.length > 0 && (
                    <div className="break-all">
                      <span className="font-semibold">related:</span>{' '}
                      {pack.incremental_update.related_pack_ids.join(', ')}
                    </div>
                  )}
                {pack.incremental_update.merge_target && (
                  <div className="font-mono text-[10.5px] break-all">
                    <span className="font-semibold not-italic">merge_target:</span>{' '}
                    {pack.incremental_update.merge_target}
                  </div>
                )}
                <div>
                  <span className="font-semibold">should_promote_to_projection:</span>{' '}
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px]"
                    style={{
                      background: pack.incremental_update.should_promote_to_projection
                        ? '#dcfce7'
                        : '#fef3c7',
                      color: pack.incremental_update.should_promote_to_projection
                        ? '#166534'
                        : '#92400e',
                    }}
                  >
                    {pack.incremental_update.should_promote_to_projection ? 'yes' : 'no'}
                  </span>
                </div>
                {pack.incremental_update.reason && (
                  <div className="leading-snug">
                    <span className="font-semibold">reason:</span> {pack.incremental_update.reason}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
