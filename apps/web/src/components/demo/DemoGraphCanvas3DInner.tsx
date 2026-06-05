'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force-3d'
import { type DemoEdge, type DemoNode } from '@/types/demo'
import { STATUS_COLORS, colorForType } from './demoColors'

interface GNode {
  id: string
  label: string
  type: string
  status?: string
  x?: number
  y?: number
  z?: number
  fx?: number
  fy?: number
  fz?: number
  __threeObj?: any
}
interface GLink {
  source: string | GNode
  target: string | GNode
  __id: string
}

const idOf = (e: string | GNode) => (typeof e === 'object' ? e.id : e)

interface Props {
  nodes: DemoNode[]
  edges: DemoEdge[]
  focusNodeIds: Set<string>
  focusEdgeIds: Set<string>
  selectedNodeId: string | null
  onSelect: (id: string | null) => void
}

export function DemoGraphCanvas3DInner({
  nodes,
  edges,
  focusNodeIds,
  focusEdgeIds,
  selectedNodeId,
  onSelect,
}: Props) {
  const fgRef = useRef<any>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const decoratedRef = useRef(false)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight })
    )
    ro.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Pre-settle layout once per dataset, then pin everything (static graph).
  const nodesArr = useMemo<GNode[]>(() => {
    const arr: any[] = nodes.map((n) => ({
      id: n.id,
      label: n.label,
      type: n.type,
      status: n.status,
    }))
    const lnk = edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation(arr, 3)
      .force('link', forceLink(lnk).id((d: any) => d.id).distance(60).strength(0.45))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter())
      .force('collide', forceCollide(20))
      .stop()
    for (let i = 0; i < 400; i++) sim.tick()
    arr.forEach((n) => {
      n.fx = n.x
      n.fy = n.y
      n.fz = n.z
    })
    return arr
  }, [nodes, edges])

  const linksArr = useMemo<GLink[]>(
    () =>
      edges.map((e) => ({
        source: e.source,
        target: e.target,
        __id: e.id,
      })),
    [edges]
  )

  const graphData = useMemo(
    () => ({ nodes: nodesArr, links: linksArr }),
    [nodesArr, linksArr]
  )

  // Lighting + decoration (once).
  useEffect(() => {
    const fg = fgRef.current
    if (!fg || decoratedRef.current) return
    const scene = fg.scene?.()
    if (!scene) return
    try {
      decoratedRef.current = true
      scene.add(new THREE.AmbientLight(0xffffff, 0.85))
      const p1 = new THREE.PointLight(0xffffff, 0.5)
      p1.position.set(220, 260, 280)
      scene.add(p1)
      const p2 = new THREE.PointLight(0x8da4ff, 0.35)
      p2.position.set(-220, -160, -220)
      scene.add(p2)
    } catch {
      /* non-essential */
    }
  }, [size.w, size.h])

  // Build node objects once (stable; focus / selection styling applied via mutation).
  const buildNode = (n: GNode) => {
    const color = colorForType(n.type)
    const radius = 5
    const group = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.25,
      roughness: 0.5,
      metalness: 0,
      transparent: true,
      opacity: 1,
    })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 28), mat)
    mesh.userData = { role: 'node', baseColor: color }
    group.add(mesh)

    const label = new SpriteText(n.label)
    label.color = '#e2e8f0'
    label.textHeight = 4
    label.fontWeight = '600'
    ;(label as any).position.y = -(radius + 5)
    label.userData = { role: 'label' }
    ;(label as any).raycast = () => {}
    group.add(label)
    return group
  }

  // Focus / select mutation (no rebuild → no jitter).
  useEffect(() => {
    const anyFocus = focusNodeIds.size > 0
    nodesArr.forEach((n) => {
      const obj = n.__threeObj
      if (!obj) return
      const inFocus = focusNodeIds.has(n.id)
      const isSelected = n.id === selectedNodeId
      const dim = anyFocus && !inFocus && !isSelected
      const scale = isSelected ? 1.4 : inFocus ? 1.1 : 1
      obj.scale.setScalar(scale)
      obj.children.forEach((ch: any) => {
        const role = ch.userData?.role
        if (role === 'node') {
          const m = ch.material
          const base = ch.userData.baseColor
          m.color.set(dim ? '#475569' : base)
          m.emissive?.set(dim ? '#000000' : base)
          m.emissiveIntensity = dim ? 0 : isSelected ? 0.55 : 0.25
          m.opacity = dim ? 0.18 : 1
          m.needsUpdate = true
        } else if (role === 'label') {
          ch.color = dim ? 'rgba(148,163,184,0.18)' : isSelected ? '#ffffff' : '#e2e8f0'
          ch.textHeight = isSelected ? 5.2 : 4
        }
      })
    })
  }, [focusNodeIds, selectedNodeId, nodesArr])

  return (
    <div ref={wrapRef} className="w-full h-full">
      {size.w > 0 && size.h > 0 && (
        <ForceGraph3D
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          showNavInfo={false}
          enableNodeDrag={false}
          warmupTicks={0}
          cooldownTicks={0}
          nodeThreeObject={buildNode as any}
          linkColor={(l: GLink) => {
            const touchingSelected =
              !!selectedNodeId &&
              (idOf(l.source) === selectedNodeId || idOf(l.target) === selectedNodeId)
            const inFocus =
              focusEdgeIds.has(l.__id) ||
              (focusNodeIds.has(idOf(l.source)) && focusNodeIds.has(idOf(l.target)))
            if (touchingSelected) return '#ffffff'
            if (inFocus) return '#a5b4fc'
            return focusNodeIds.size > 0 ? 'rgba(148,163,184,0.10)' : 'rgba(148,163,184,0.40)'
          }}
          linkWidth={(l: GLink) => {
            const inFocus =
              focusEdgeIds.has(l.__id) ||
              (focusNodeIds.has(idOf(l.source)) && focusNodeIds.has(idOf(l.target)))
            return inFocus ? 1.6 : 0.5
          }}
          linkCurvature={0.2}
          onNodeClick={(n: any) => onSelect(n.id === selectedNodeId ? null : n.id)}
          onBackgroundClick={() => onSelect(null)}
        />
      )}
    </div>
  )
}
