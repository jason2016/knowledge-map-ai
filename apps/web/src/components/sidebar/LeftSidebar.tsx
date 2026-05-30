'use client'
import { X } from 'lucide-react'
import { type DemoId, type EntityType } from '@/types'
import { ENTITY_COLORS, ENTITY_LABELS } from '../graph/entityColors'

interface SourceItem { label: string; icon: string; type: EntityType }

const SOURCES: Record<DemoId, SourceItem[]> = {
  accounting: [
    { label: 'Client Files', icon: '📁', type: 'client' },
    { label: 'Invoices', icon: '📄', type: 'invoice' },
    { label: 'VAT Rules', icon: '⚖️', type: 'vatRule' },
    { label: 'Emails', icon: '✉️', type: 'email' },
    { label: 'Deadlines', icon: '⏰', type: 'deadline' },
    { label: 'Case Notes', icon: '🗂️', type: 'case' },
  ],
  exhibition: [
    { label: 'Exhibitor Files', icon: '🖼️', type: 'exhibitor' },
    { label: 'Visitor Lists', icon: '👥', type: 'visitor' },
    { label: 'Campaign Notes', icon: '📣', type: 'campaign' },
    { label: 'Partner Emails', icon: '✉️', type: 'partner' },
    { label: 'Booth Plans', icon: '🏛️', type: 'booth' },
    { label: 'Follow-up Notes', icon: '🔔', type: 'followup' },
  ],
}

const FILTERS: Record<DemoId, EntityType[]> = {
  accounting: ['client', 'company', 'invoice', 'vatRule', 'deadline', 'missingDoc', 'email', 'case', 'action'],
  exhibition: ['exhibition', 'exhibitor', 'visitor', 'lead', 'partner', 'booth', 'campaign', 'content', 'opportunity', 'followup'],
}

export interface ContextPackVaultEntry {
  id: string
  label: string
  loading?: boolean
}

interface Props {
  demo: DemoId
  onDemoChange: (id: DemoId) => void
  activeFilters: EntityType[]
  onFilterToggle: (type: EntityType) => void
  focusType: EntityType | null
  onSourceFocus: (type: EntityType) => void
  onSourceAdd: (type: EntityType) => void
  open: boolean
  onClose: () => void
  // Context Packs available in the vault, parallel to built-in demos.
  contextPacks?: ContextPackVaultEntry[]
  activePackId?: string | null
  onPackClick?: (id: string) => void
}

export function LeftSidebar({
  demo,
  onDemoChange,
  activeFilters,
  onFilterToggle,
  focusType,
  onSourceFocus,
  onSourceAdd,
  open,
  onClose,
  contextPacks = [],
  activePackId = null,
  onPackClick,
}: Props) {
  // When a Context Pack is active, demo-specific sections (Information Sources,
  // Entity Filters) don't apply — hide them to keep the sidebar clean.
  const packActive = activePackId !== null
  const sources = SOURCES[demo]
  const filters = FILTERS[demo]

  return (
    <aside
      style={{
        width: 220,
        background: '#ffffff',
        borderRight: '1px solid rgba(30,30,60,0.08)',
        flexShrink: 0,
      }}
      className={
        'flex flex-col overflow-y-auto transition-transform duration-200 ' +
        // Mobile: fixed off-canvas drawer below the 52px header. Desktop: static column.
        'fixed top-[52px] bottom-0 left-0 z-40 shadow-xl ' +
        'md:static md:top-auto md:z-auto md:h-full md:shadow-none ' +
        (open ? 'translate-x-0' : '-translate-x-full') +
        ' md:translate-x-0'
      }
    >
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="md:hidden self-end m-2 p-1.5 rounded-md"
        style={{ color: '#9494ad' }}
        aria-label="Close menu"
      >
        <X size={16} />
      </button>

      {/* Demo Vault */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(30,30,60,0.06)' }}>
        <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: '#9494ad' }}>
          Demo Vault
        </p>
        <div className="flex flex-col gap-1">
          {(['accounting', 'exhibition'] as DemoId[]).map((id) => {
            // A demo is "active" only when no Context Pack is loaded.
            const active = !packActive && demo === id
            return (
              <button
                key={id}
                onClick={() => onDemoChange(id)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
                style={{
                  background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                  color: active ? '#4f46e5' : '#5a5a70',
                  border: active ? '1px solid rgba(99,102,241,0.30)' : '1px solid transparent',
                }}
              >
                {id === 'accounting' ? 'Accounting Map' : 'Exhibition Map'}
              </button>
            )
          })}
          {contextPacks.map((p) => {
            const active = activePackId === p.id
            return (
              <button
                key={p.id}
                onClick={() => onPackClick?.(p.id)}
                disabled={p.loading}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 flex items-center justify-between gap-2"
                style={{
                  background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                  color: active ? '#4f46e5' : '#5a5a70',
                  border: active ? '1px solid rgba(99,102,241,0.30)' : '1px solid transparent',
                  opacity: p.loading ? 0.6 : 1,
                }}
              >
                <span className="truncate">{p.label}</span>
                <span
                  className="text-[9px] uppercase tracking-widest flex-shrink-0"
                  style={{ color: active ? '#4f46e5' : '#9494ad' }}
                >
                  {p.loading ? '…' : 'Pack'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Information Sources — demo-specific; hidden when a Context Pack is active. */}
      {!packActive && (
      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(30,30,60,0.06)' }}>
        <p className="text-[9px] uppercase tracking-widest mb-2" style={{ color: '#9494ad' }}>
          Information Sources
        </p>
        <ul className="space-y-0.5">
          {sources.map((s) => {
            const color = ENTITY_COLORS[s.type]
            const active = focusType === s.type
            return (
              <li
                key={s.label}
                className="group flex items-center rounded-md transition-all duration-150"
                style={{ background: active ? color + '14' : 'transparent' }}
              >
                <button
                  onClick={() => onSourceFocus(s.type)}
                  className="flex-1 min-w-0 flex items-center gap-2 px-1 py-1 text-left"
                >
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] flex-shrink-0"
                    style={{
                      background: color + '1a',
                      boxShadow: active ? `0 0 0 2px ${color}55` : 'none',
                    }}
                  >
                    {s.icon}
                  </span>
                  <span
                    className="text-[12px] truncate"
                    style={{ color: active ? '#1e293b' : '#475569', fontWeight: active ? 600 : 400 }}
                  >
                    {s.label}
                  </span>
                </button>
                <button
                  onClick={() => onSourceAdd(s.type)}
                  title={`Ingest a new ${s.label} node`}
                  className="w-5 h-5 mr-1 flex items-center justify-center rounded-md flex-shrink-0 text-[13px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color, background: color + '1a' }}
                >
                  +
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      )}

      {/* Entity Filters — demo-specific; hidden when a Context Pack is active. */}
      {!packActive && (
      <div className="px-4 py-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] uppercase tracking-widest" style={{ color: '#9494ad' }}>
            Entity Filters
          </p>
          {activeFilters.length > 0 && (
            <button
              onClick={() => [...activeFilters].forEach((t) => onFilterToggle(t))}
              className="text-[10px]"
              style={{ color: '#9494ad' }}
            >
              clear
            </button>
          )}
        </div>
        <ul className="space-y-0.5">
          {filters.map((type) => {
            const color = ENTITY_COLORS[type]
            const isActive = activeFilters.includes(type)
            const isDimmed = activeFilters.length > 0 && !isActive
            return (
              <li key={type}>
                <button
                  onClick={() => onFilterToggle(type)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-150 text-left"
                  style={{
                    background: isActive ? color + '14' : 'transparent',
                    opacity: isDimmed ? 0.4 : 1,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: color, boxShadow: isActive ? `0 0 0 2px ${color}33` : 'none' }}
                  />
                  <span className="text-[12px]" style={{ color: isActive ? '#2c2c42' : '#6a6a80' }}>
                    {ENTITY_LABELS[type]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      )}

      {/* Spacer so the footer stays pinned to the bottom when the demo-only
          sections are hidden (Context Pack active). */}
      {packActive && <div className="flex-1" />}

      {/* Footer — connect / import a data source (Obsidian import coming soon) */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(30,30,60,0.06)' }}>
        <button
          title="Connect a data source — Obsidian import coming soon"
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-150"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.4)' }}
        >
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-[13px] leading-none flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#4f46e5' }}
          >
            +
          </span>
          <span className="text-[12px] font-medium text-left leading-tight" style={{ color: '#4f46e5' }}>
            Connect Data Source
            <span className="block text-[9px] font-normal" style={{ color: '#9494ad' }}>
              Obsidian · coming soon
            </span>
          </span>
        </button>
      </div>
    </aside>
  )
}
