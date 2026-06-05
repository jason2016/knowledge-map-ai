'use client'
import dynamic from 'next/dynamic'
import { type DemoEdge, type DemoNode } from '@/types/demo'

const Inner = dynamic(() => import('./DemoGraphCanvas3DInner').then((m) => m.DemoGraphCanvas3DInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-[12px] text-slate-500">
      Loading 3D space…
    </div>
  ),
})

interface Props {
  nodes: DemoNode[]
  edges: DemoEdge[]
  focusNodeIds: Set<string>
  focusEdgeIds: Set<string>
  selectedNodeId: string | null
  onSelect: (id: string | null) => void
}

export function DemoGraphCanvas3D(props: Props) {
  return <Inner {...props} />
}
