// Demo graph types — used by /semantic-os-demo and /agent-workspace.
//
// These demo datasets are intentionally structured as video-ready scenes.
// Future pipeline: DemoStep[] -> HTML scene animation -> HyperFrames -> MP4.

export type DemoStatus =
  | 'idle'
  | 'active'
  | 'running'
  | 'completed'
  | 'waiting'
  | 'review'

export interface DemoNode {
  id: string
  label: string
  /** Semantic type used to choose a colour from `TYPE_COLORS`. */
  type: string
  description: string
  example?: string
  status?: DemoStatus
  layer?: string
}

export interface DemoEdge {
  id: string
  source: string
  target: string
  label?: string
  type?: string
}

/** A single demo scene: title, narration, and which nodes/edges to focus on. */
export interface DemoStep {
  id: string
  title: string
  description: string
  focusNodeIds: string[]
  focusEdgeIds?: string[]
}

export interface DemoDataset {
  title: string
  subtitle: string
  intro: string
  nodes: DemoNode[]
  edges: DemoEdge[]
  steps: DemoStep[]
}
