export type EntityType =
  | 'client' | 'company' | 'invoice' | 'vatRule' | 'deadline'
  | 'missingDoc' | 'email' | 'case' | 'action'
  | 'exhibition' | 'exhibitor' | 'booth' | 'visitor' | 'lead'
  | 'campaign' | 'content' | 'partner' | 'opportunity' | 'followup'
  // Semantic Context Pack types — used by Context Pack datasets so node labels
  // are meaningful (avoids misleading reuse of accounting/exhibition types).
  | 'customer' | 'event' | 'problem' | 'conflict' | 'playbook'
  | 'feedback' | 'refactoring' | 'source' | 'futurePlan' | 'checklist'

export interface KnowledgeNodeData extends Record<string, unknown> {
  label: string
  entityType: EntityType
  summary: string
  sourceNotes: string[]
  recentActivity: string[]
  relatedQuestions: string[]
  possibleActions: string[]
  // Context Pack only: relative path to a node-memory markdown file.
  memoryFile?: string
  // Context Pack only: provenance + quality fields carried through the adapter.
  sourceRefs?: string[]
  evidence?: string
  confidence?: string
  createdFrom?: string
}

export interface KnowledgeEdgeData extends Record<string, unknown> {
  weight: number
  // Context Pack only: edge provenance + semantic fields preserved by the adapter.
  type?: string
  explanation?: string
  sourceRefs?: string[]
  evidence?: string
  confidence?: string
}

export type DemoId = 'accounting' | 'exhibition'

export interface ConnectedNodeInfo {
  id: string
  label: string
  entityType: EntityType
  edgeLabel: string
}
