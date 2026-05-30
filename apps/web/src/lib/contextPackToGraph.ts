import { type Node, type Edge } from '@xyflow/react'
import { type EntityType, type KnowledgeNodeData, type KnowledgeEdgeData } from '@/types'
import { type ContextPack, type ContextPackNode } from '@/types/context-pack'

// Map Context Pack node `type` strings → the existing Knowledge Map AI EntityType.
// Reuses the colour palette so no graph rendering changes are needed.
// Direct semantic mapping — Context Pack types map to dedicated EntityType values
// so labels read truthfully (e.g. "Problem" instead of "Missing Document").
const TYPE_TO_ENTITY: Record<string, EntityType> = {
  Customer: 'customer',
  Event: 'event',
  Problem: 'problem',
  Conflict: 'conflict',
  Playbook: 'playbook',
  Checklist: 'checklist',
  Action: 'action',
  Feedback: 'feedback',
  RefactoringNote: 'refactoring',
  Refactoring: 'refactoring',
  FuturePlan: 'futurePlan',
  Source: 'source',
}

function entityFor(node: ContextPackNode): EntityType {
  const t = node.type ?? ''
  if (TYPE_TO_ENTITY[t]) return TYPE_TO_ENTITY[t]
  // Case-insensitive fallback against the same map's keys.
  const tl = t.toLowerCase()
  const hit = Object.keys(TYPE_TO_ENTITY).find((k) => k.toLowerCase() === tl)
  return hit ? TYPE_TO_ENTITY[hit] : 'event'
}

export interface ContextPackGraph {
  nodes: Node<KnowledgeNodeData>[]
  edges: Edge<KnowledgeEdgeData>[]
}

export function contextPackToGraph(pack: ContextPack): ContextPackGraph {
  const nodes: Node<KnowledgeNodeData>[] = pack.graph.nodes.map((n) => ({
    id: n.id,
    type: 'knowledgeNode',
    position: { x: 0, y: 0 }, // KnowledgeGraph re-lays out via d3-force; position is replaced.
    data: {
      label: n.label,
      entityType: entityFor(n),
      summary: n.summary ?? '',
      sourceNotes: [],
      recentActivity: [],
      relatedQuestions: [],
      possibleActions: [],
      memoryFile: n.memory_file && n.memory_file.length > 0 ? n.memory_file : undefined,
      sourceRefs: n.source_refs && n.source_refs.length > 0 ? n.source_refs : undefined,
      evidence: n.evidence || undefined,
      confidence: n.confidence || undefined,
      createdFrom: n.created_from || undefined,
    },
  }))

  const edges: Edge<KnowledgeEdgeData>[] = pack.graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label ?? e.type ?? '',
    data: {
      weight: typeof e.weight === 'number' ? e.weight : 1,
      type: e.type,
      explanation: e.explanation,
      sourceRefs: e.source_refs,
      evidence: e.evidence,
      confidence: e.confidence,
    },
  }))

  return { nodes, edges }
}
