// Minimal Context Pack types — mirror the Semantic OS `context-pack.json` shape.
// Intentionally permissive: optional fields where the source may omit them.

export interface ContextPackNode {
  id: string
  label: string
  type: string
  group?: string
  summary?: string
  memory_file?: string
  priority?: 'high' | 'normal' | 'low' | string
  source_refs?: string[]
  evidence?: string
  confidence?: string
  created_from?: string
}

export interface ContextPackEdge {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  weight?: number
  explanation?: string
  source_refs?: string[]
  evidence?: string
  confidence?: string
}

export interface ContextPackAction {
  id: string
  priority: 'P0' | 'P1' | 'P2' | string
  title: string
  description?: string
  owner?: string
  status?: string
  due?: string
  related_nodes?: string[]
  source_refs?: string[]
  expected_result?: string
  write_back_target?: string
}

export interface ContextPackFuturePlan {
  id: string
  title: string
  description?: string
  related_nodes?: string[]
  write_back_target?: string
}

export interface ContextPackIncrementalUpdate {
  mode?: string
  previous_pack_id?: string
  related_pack_ids?: string[]
  merge_target?: string
  should_promote_to_projection?: boolean
  reason?: string
}

export interface ContextPackSource {
  id: string
  title: string
  path: string
  type?: string
  relevance?: string
}

export interface ContextPackCausalityItem {
  step: number
  node: string
  relation?: string
  next_node?: string
  explanation?: string
  evidence?: string
}

export interface ContextPackWriteBack {
  type: string
  target: string
  description?: string
}

export interface ContextPack {
  pack_id: string
  created: string
  query?: {
    original_question?: string
    query_type?: string
    target_object?: string
  }
  target?: {
    name?: string
    slug?: string
    type?: string
    related_projection_pack?: string
  }
  summary: {
    direct_answer: string
    key_facts?: string[]
    short_explanation?: string
  }
  graph: {
    nodes: ContextPackNode[]
    edges: ContextPackEdge[]
  }
  causality?: ContextPackCausalityItem[]
  actions?: ContextPackAction[]
  future_plan?: ContextPackFuturePlan[]
  sources?: ContextPackSource[]
  source_documents?: string[]
  display?: {
    default_view?: '2d' | '3d' | string
    available_views?: string[]
    highlight_nodes?: string[]
  }
  suggested_write_back?: ContextPackWriteBack[]
  incremental_update?: ContextPackIncrementalUpdate
}
