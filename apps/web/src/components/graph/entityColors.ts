import { type EntityType } from '@/types'

// Single source of truth for entity colors across node, minimap, sidebar, panel.
export const ENTITY_COLORS: Record<EntityType, string> = {
  client: '#3b82f6',      // blue   — Client / Person
  company: '#22c55e',     // green  — Company / Organization
  invoice: '#eab308',     // yellow — Invoice / Document
  vatRule: '#14b8a6',     // teal   — VAT Rule / Topic
  deadline: '#ef4444',    // red    — Deadline / Risk
  missingDoc: '#f97316',  // orange — Missing Document
  email: '#06b6d4',       // cyan   — Email
  case: '#a855f7',        // purple — Case / Project
  action: '#ec4899',      // pink   — Action
  exhibition: '#6366f1',  // indigo
  exhibitor: '#3b82f6',   // blue
  booth: '#f97316',       // orange
  visitor: '#22c55e',     // green
  lead: '#eab308',        // yellow
  campaign: '#ec4899',    // pink
  content: '#06b6d4',     // cyan
  partner: '#a855f7',     // purple
  opportunity: '#14b8a6', // teal
  followup: '#ef4444',    // red
}

export const ENTITY_LABELS: Record<EntityType, string> = {
  client: 'Client', company: 'Company', invoice: 'Invoice', vatRule: 'VAT Rule',
  deadline: 'Deadline', missingDoc: 'Missing Document', email: 'Email', case: 'Case',
  action: 'Action', exhibition: 'Exhibition', exhibitor: 'Exhibitor', booth: 'Booth',
  visitor: 'Visitor', lead: 'Lead', campaign: 'Campaign', content: 'Content',
  partner: 'Partner', opportunity: 'Opportunity', followup: 'Follow-up',
}
