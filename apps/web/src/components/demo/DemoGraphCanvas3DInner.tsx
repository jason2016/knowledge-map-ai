'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  __curveRot?: number
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

// 3D demo canvas styled to match the homepage 3D Space view:
//   - soft light radial gradient background (CSS, behind the transparent canvas)
//   - MeshStandardMaterial spheres with an emissive floor so colours stay true
//   - strong AmbientLight + two PointLights for shading
//   - SpriteText labels in slate, growing on selection
//   - curved indigo links on focus
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
      edges.map((e, i) => ({
        source: e.source,
        target: e.target,
        __id: e.id,
        __curveRot: (i * 2.39996) % (Math.PI * 2),
      })),
    [edges]
  )

  const graphData = useMemo(
    () => ({ nodes: nodesArr, links: linksArr }),
    [nodesArr, linksArr]
  )

  // Glow texture for active-node halo (same approach as the homepage 3D view).
  const getGlowTexture = useCallback(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(255,255,255,0.9)')
    g.addColorStop(0.45, 'rgba(255,255,255,0.25)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])

  // Lighting + decoration (once).
  useEffect(() => {
    const fg = fgRef.current
    if (!fg || decoratedRef.current) return
    const scene = fg.scene?.()
    if (!scene) return
    try {
      decoratedRef.current = true
      scene.add(new THREE.AmbientLight(0xffffff, 0.95))
      const p1 = new THREE.PointLight(0xffffff, 0.7)
      p1.position.set(200, 240, 260)
      scene.add(p1)
      const p2 = new THREE.PointLight(0xdfe6ff, 0.4)
      p2.position.set(-220, -140, -200)
      scene.add(p2)
    } catch {
      /* non-essential */
    }
  }, [size.w, size.h])

  // Build a node group: lit sphere + halo sprite + sprite label.
  const buildNode = useCallback(
    (n: GNode) => {
      const color = colorForType(n.type)
      const radius = 5.5
      const group = new THREE.Group()

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.22,
        roughness: 0.5,
        metalness: 0,
        transparent: true,
        opacity: 1,
      })
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat)
      mesh.userData = { role: 'node', baseColor: color }
      group.add(mesh)

      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: getGlowTexture(),
          color: new THREE.Color(color),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0,
        })
      )
      halo.scale.set(radius * 7, radius * 7, 1)
      halo.userData = { role: 'halo' }
      halo.raycast = () => {}
      group.add(halo)

      const label = new SpriteText(n.label)
      label.color = '#334155'
      label.textHeight = 4
      label.fontWeight = '600'
      ;(label as any).position.y = -(radius + 6)
      label.userData = { role: 'label' }
      ;(label as any).raycast = () => {}
      group.add(label)

      // tiny status badge (rendered as another sprite text)
      if (n.status && n.status !== 'idle') {
        const tag = new SpriteText(String(n.status).toUpperCase())
        tag.color = STATUS_COLORS[n.status as keyof typeof STATUS_COLORS] ?? '#64748b'
        tag.textHeight = 2.2
        tag.fontWeight = '600'
        ;(tag as any).position.y = -(radius + 11)
        tag.userData = { role: 'status' }
        ;(tag as any).raycast = () => {}
        group.add(tag)
      }

      return group
    },
    [getGlowTexture]
  )

  // Focus / selection mutation — no rebuild, no jitter.
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
          m.color.set(dim ? '#cdd3e0' : base)
          m.emissive?.set(dim ? '#000000' : base)
          m.emissiveIntensity = dim ? 0 : isSelected ? 0.4 : 0.22
          m.opacity = dim ? 0.18 : 1
          m.needsUpdate = true
        } else if (role === 'halo') {
          ch.material.opacity = isSelected ? 0.85 : inFocus ? 0.35 : 0
        } else if (role === 'label') {
          ch.color = dim ? 'rgba(71,85,105,0.20)' : isSelected ? '#0f172a' : '#334155'
          ch.textHeight = isSelected ? 5.4 : 4
        } else if (role === 'status') {
          ch.material.opacity = dim ? 0.18 : 1
        }
      })
    })
  }, [focusNodeIds, selectedNodeId, nodesArr])

  return (
    <div
      ref={wrapRef}
      className="w-full h-full"
      style={{
        background:
          'radial-gradient(ellipse at 50% 42%, #ffffff 0%, #eef2fb 55%, #e6ebf6 100%)',
      }}
    >
      {size.w > 0 && size.h > 0 && (
        <ForceGraph3D
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={graphData}
          backgroundColor="rgba(255,255,255,0)"
          showNavInfo={false}
          enableNodeDrag={false}
          warmupTicks={0}
          cooldownTicks={0}
          nodeThreeObject={buildNode as any}
          linkCurvature={0.28}
          linkCurveRotation={(l: GLink) => l.__curveRot ?? 0}
          linkColor={(l: GLink) => {
            const touchingSelected =
              !!selectedNodeId &&
              (idOf(l.source) === selectedNodeId || idOf(l.target) === selectedNodeId)
            const inFocus =
              focusEdgeIds.has(l.__id) ||
              (focusNodeIds.has(idOf(l.source)) && focusNodeIds.has(idOf(l.target)))
            if (touchingSelected) return '#4338ca'
            if (inFocus) return '#6366f1'
            return focusNodeIds.size > 0 ? 'rgba(110,124,160,0.18)' : 'rgba(110,124,160,0.55)'
          }}
          linkWidth={(l: GLink) => {
            const inFocus =
              focusEdgeIds.has(l.__id) ||
              (focusNodeIds.has(idOf(l.source)) && focusNodeIds.has(idOf(l.target)))
            return inFocus ? 1.6 : 0.7
          }}
          onNodeClick={(n: any) => onSelect(n.id === selectedNodeId ? null : n.id)}
          onBackgroundClick={() => onSelect(null)}
        />
      )}
    </div>
  )
}
