export type EntityType =
  | 'client' | 'company' | 'invoice' | 'vatRule' | 'deadline'
  | 'missingDoc' | 'email' | 'case' | 'action'
  | 'exhibition' | 'exhibitor' | 'booth' | 'visitor' | 'lead'
  | 'campaign' | 'content' | 'partner' | 'opportunity' | 'followup'

export interface KnowledgeNodeData extends Record<string, unknown> {
  label: string
  entityType: EntityType
  summary: string
  sourceNotes: string[]
  recentActivity: string[]
  relatedQuestions: string[]
  possibleActions: string[]
}

export interface KnowledgeEdgeData extends Record<string, unknown> {
  weight: number
}

export type DemoId = 'accounting' | 'exhibition'

export interface ConnectedNodeInfo {
  id: string
  label: string
  entityType: EntityType
  edgeLabel: string
}
