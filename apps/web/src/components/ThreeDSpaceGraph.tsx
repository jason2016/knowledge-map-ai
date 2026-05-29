'use client'
import dynamic from 'next/dynamic'
import { type Node, type Edge } from '@xyflow/react'
import { type KnowledgeNodeData, type KnowledgeEdgeData } from '@/types'

// Loaded client-side only: three.js / WebGL must never run during SSR.
const Inner = dynamic(() => import('./graph/ThreeDSpaceGraphInner'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#eef2f8', color: '#94a3b8' }}
    >
      <span className="text-[13px]">Loading 3D space…</span>
    </div>
  ),
})

interface Props {
  nodes: Node<KnowledgeNodeData>[]
  edges: Edge<KnowledgeEdgeData>[]
  selectedNodeId: string | null
  onNodeSelect: (id: string | null) => void
  visible?: boolean
}

export function ThreeDSpaceGraph(props: Props) {
  return <Inner {...props} />
}
