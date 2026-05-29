'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force-3d'
import { type Node, type Edge } from '@xyflow/react'
import { type KnowledgeNodeData, type KnowledgeEdgeData, type EntityType } from '@/types'
import { ENTITY_COLORS } from './entityColors'

interface GNode {
  id: string
  label: string
  entityType: EntityType
  deg: number
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
  label?: string
  __curveRot?: number
  __lineObj?: any
  __ownMat?: boolean
}

interface Props {
  nodes: Node<KnowledgeNodeData>[]
  edges: Edge<KnowledgeEdgeData>[]
  selectedNodeId: string | null
  onNodeSelect: (id: string | null) => void
}

const PHASES = [
  'Information Sources',
  'Entity Recognition',
  'Relationship Generation',
  'Map Formation',
  'Node Expansion',
]

const idOf = (end: string | GNode) => (typeof end === 'object' ? end.id : end)

// White soft radial glow (tinted per-node via material.color).
let glowTex: THREE.Texture | null = null
function getGlowTexture(): THREE.Texture {
  if (glowTex) return glowTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.25)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  glowTex = new THREE.CanvasTexture(c)
  return glowTex
}

export default function ThreeDSpaceGraphInner({
  nodes,
  edges,
  selectedNodeId,
  onNodeSelect,
}: Props) {
  const fgRef = useRef<any>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const decoratedRef = useRef(false)
  const fittedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const [phase, setPhase] = useState(4)
  const [linkCount, setLinkCount] = useState(999)
  const [playing, setPlaying] = useState(false)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Pre-settle a 3D layout synchronously, then PIN it. The render engine never
  // runs (warmup/cooldown 0), so the map is static & framed from frame one —
  // no warmup delay, no sudden zoom.
  const nodesArr = useMemo<GNode[]>(() => {
    const deg = new Map<string, number>()
    edges.forEach((e) => {
      deg.set(e.source, (deg.get(e.source) ?? 0) + 1)
      deg.set(e.target, (deg.get(e.target) ?? 0) + 1)
    })
    const arr: any[] = nodes.map((n) => ({
      id: n.id,
      label: n.data.label,
      entityType: n.data.entityType,
      deg: deg.get(n.id) ?? 0,
    }))
    const lnk = edges.map((e) => ({ source: e.source, target: e.target }))
    const sim = forceSimulation(arr, 3)
      .force('link', forceLink(lnk).id((d: any) => d.id).distance(58).strength(0.45))
      .force('charge', forceManyBody().strength(-180))
      .force('center', forceCenter())
      .force('collide', forceCollide(18))
      .stop()
    for (let i = 0; i < 400; i++) sim.tick()
    arr.forEach((n) => {
      n.fx = n.x
      n.fy = n.y
      n.fz = n.z
    })
    return arr
  }, [nodes, edges])

  const linksAll = useMemo<GLink[]>(
    () =>
      edges.map((e, i) => ({
        source: e.source,
        target: e.target,
        label: (e.label as string) ?? '',
        __curveRot: (i * 2.39996) % (Math.PI * 2),
      })),
    [edges]
  )

  const hubId = useMemo(() => {
    let best = ''
    let bestDeg = -1
    nodesArr.forEach((n) => {
      if (n.deg > bestDeg) {
        bestDeg = n.deg
        best = n.id
      }
    })
    return best
  }, [nodesArr])

  const visibleLinks = useMemo(
    () => (phase >= 2 ? linksAll.slice(0, linkCount) : []),
    [phase, linkCount, linksAll]
  )
  const graphData = useMemo(() => ({ nodes: nodesArr, links: visibleLinks }), [nodesArr, visibleLinks])

  // Hover takes priority over click for the highlight (like the 2D view).
  const activeNodeId = hoveredNodeId ?? selectedNodeId

  const neighborIds = useMemo(() => {
    const s = new Set<string>()
    if (!activeNodeId) return s
    edges.forEach((e) => {
      if (e.source === activeNodeId) s.add(e.target)
      if (e.target === activeNodeId) s.add(e.source)
    })
    return s
  }, [activeNodeId, edges])

  const pinAll = useCallback(() => {
    nodesArr.forEach((n) => {
      n.fx = n.x
      n.fy = n.y
      n.fz = n.z
    })
  }, [nodesArr])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }, [])

  // Default = static formed map (already pre-settled + pinned in nodesArr).
  useEffect(() => {
    clearTimers()
    setPlaying(false)
    setPhase(4)
    setLinkCount(linksAll.length || 999)
    fittedRef.current = false
    return () => clearTimers()
  }, [nodesArr, linksAll, clearTimers])

  // Compute a camera distance that frames the whole (pre-settled) layout with
  // margin, and set it directly — no delayed zoomToFit, so the graph appears at
  // the right size from the first frame (no "sudden enlarge a few seconds in").
  const frameToFit = useCallback(
    (ms: number) => {
      const fg = fgRef.current
      const cam = fg?.camera?.()
      if (!fg || !cam || size.w === 0) return
      let R = 1
      nodesArr.forEach((n) => {
        const d = Math.hypot(n.x ?? 0, n.y ?? 0, n.z ?? 0)
        if (d > R) R = d
      })
      R += 24
      const fov = ((cam.fov ?? 50) * Math.PI) / 180
      const aspect = size.w / size.h || 1
      const D = Math.max(R / Math.tan(fov / 2), R / (Math.tan(fov / 2) * aspect)) * 1.0
      const c = fg.controls?.()
      if (c) {
        c.minDistance = Math.max(140, D * 0.5)
        c.maxDistance = D * 1.6
      }
      fg.cameraPosition({ x: 0, y: 0, z: D }, { x: 0, y: 0, z: 0 }, ms)
    },
    [nodesArr, size.w, size.h]
  )

  useEffect(() => {
    if (playing || fittedRef.current || size.w === 0) return
    const id = window.requestAnimationFrame(() => {
      frameToFit(0)
      fittedRef.current = true
    })
    return () => window.cancelAnimationFrame(id)
  }, [size.w, size.h, playing, frameToFit])

  // Lighting + volumetric light dot-field (soft; once).
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return
    const scene = fg.scene?.()
    if (!scene || decoratedRef.current) return
    try {
      decoratedRef.current = true
      // Strong ambient keeps node colours TRUE; point lights add the 3D gradient.
      scene.add(new THREE.AmbientLight(0xffffff, 0.95))
      const p1 = new THREE.PointLight(0xffffff, 0.7)
      p1.position.set(200, 240, 260)
      scene.add(p1)
      const p2 = new THREE.PointLight(0xdfe6ff, 0.4)
      p2.position.set(-220, -140, -200)
      scene.add(p2)
      const makeField = (n: number, rMin: number, rSpan: number, ptSize: number, op: number, col: number) => {
        const a = new Float32Array(n * 3)
        for (let i = 0; i < n; i++) {
          const r = rMin + Math.random() * rSpan
          const th = Math.random() * Math.PI * 2
          const ph = Math.acos(2 * Math.random() - 1)
          a[i * 3] = r * Math.sin(ph) * Math.cos(th)
          a[i * 3 + 1] = r * Math.cos(ph) * 0.6
          a[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(a, 3))
        scene.add(
          new THREE.Points(
            g,
            new THREE.PointsMaterial({ color: col, size: ptSize, transparent: true, opacity: op, sizeAttenuation: true, depthWrite: false })
          )
        )
      }
      makeField(150, 150, 280, 2.0, 0.4, 0xc4ccdd)
      makeField(140, 320, 360, 1.3, 0.28, 0xd2d9e6)
    } catch {
      /* non-essential */
    }
  }, [size.w, size.h])

  // Build each node ONCE (stable). Soft matte material; halo tinted node color.
  const buildNode = useCallback(
    (n: GNode) => {
      const recognized = phase >= 1
      const base = ENTITY_COLORS[n.entityType] ?? '#6366f1'
      const radius = 4 + Math.min(n.deg, 6) + 3

      const group = new THREE.Group()
      // Lit sphere (real 3D shading gradient) + emissive floor so the shaded
      // side keeps the TRUE colour (never darkens to brown). With strong ambient
      // the colour stays accurate; the directional point lights add the 3D look.
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(recognized ? base : '#c2c8d6'),
        roughness: 0.5,
        metalness: 0,
        emissive: new THREE.Color(recognized ? base : '#c2c8d6'),
        emissiveIntensity: 0.22,
        transparent: true,
        opacity: 1,
      })
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat)
      mesh.userData = { role: 'node', baseColor: base }
      group.add(mesh)

      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: getGlowTexture(),
          color: new THREE.Color(base),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0, // halo only shows on the SELECTED node (set in the effect)
        })
      )
      halo.scale.set(radius * 7, radius * 7, 1)
      halo.userData = { role: 'halo' }
      halo.raycast = () => {} // big halo must NOT intercept hover/clicks
      group.add(halo)

      const sprite = new SpriteText(n.label)
      sprite.color = recognized ? '#334155' : 'rgba(71,85,105,0.35)'
      sprite.textHeight = 3.6
      sprite.fontWeight = '600'
      ;(sprite as any).position.y = -(radius + 7)
      sprite.userData = { role: 'label' }
      ;(sprite as any).raycast = () => {} // label must not intercept hover/clicks
      group.add(sprite)
      return group
    },
    [phase, hubId]
  )

  // Selection highlight: MUTATE materials only. Selected ball keeps its exact
  // colour (no recolour, no emissive) — only a soft same-colour halo + others
  // dim + connected links light up. No rebuild, no move → no jump.
  useEffect(() => {
    nodesArr.forEach((n) => {
      const obj = n.__threeObj
      if (!obj) return
      const active = n.id === activeNodeId
      const neighbor = neighborIds.has(n.id)
      const dim = !!activeNodeId && !active && !neighbor
      obj.children.forEach((ch: any) => {
        const role = ch.userData?.role
        if (role === 'node') {
          const m = ch.material
          // Active/neighbour keep their TRUE colour; only unrelated nodes fade.
          m.color.set(dim ? '#cdd3e0' : ch.userData.baseColor)
          m.emissive?.set(dim ? '#000000' : ch.userData.baseColor)
          m.emissiveIntensity = dim ? 0 : 0.22
          m.opacity = dim ? 0.16 : 1
          m.needsUpdate = true
        } else if (role === 'halo') {
          ch.material.opacity = active ? 0.85 : 0 // only the active (hovered/selected) node glows
        } else if (role === 'label') {
          // Active node's name grows + darkens (like the 2D hover); others normal/faded.
          const targetH = active ? 5.4 : 3.6
          if (ch.textHeight !== targetH) ch.textHeight = targetH
          ch.color = dim ? 'rgba(71,85,105,0.22)' : active ? '#0f172a' : '#334155'
        }
      })
    })
  }, [activeNodeId, neighborIds, nodesArr, hubId, phase, linkCount])

  const handleNodeClick = useCallback(
    (node: GNode) => onNodeSelect(node.id === selectedNodeId ? null : node.id),
    [onNodeSelect, selectedNodeId]
  )

  // Replay the evolution on demand.
  const playEvolution = useCallback(() => {
    clearTimers()
    setPlaying(true)
    fittedRef.current = true
    nodesArr.forEach((n) => {
      // Tighter scatter so the "Information Sources" start stays on-screen.
      const r = 90 + Math.random() * 120
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      n.x = r * Math.sin(ph) * Math.cos(th)
      n.y = r * Math.cos(ph) * 0.7
      n.z = r * Math.sin(ph) * Math.sin(th)
      n.fx = n.fy = n.fz = undefined
    })
    setPhase(0)
    setLinkCount(0)
    fgRef.current?.d3ReheatSimulation?.()
    // Frame the scattered nodes right away so the replay starts framed (not "broken").
    window.requestAnimationFrame(() => frameToFit(400))
    const total = linksAll.length
    const t = timersRef.current
    t.push(window.setTimeout(() => setPhase(1), 900))
    t.push(window.setTimeout(() => setPhase(2), 1800))
    for (let i = 1; i <= total; i++) t.push(window.setTimeout(() => setLinkCount(i), 1800 + i * 220))
    const mapAt = 1800 + total * 220 + 300
    t.push(window.setTimeout(() => setPhase(3), mapAt))
    t.push(
      window.setTimeout(() => {
        setPhase(4)
        pinAll()
        frameToFit(700)
        setPlaying(false)
      }, mapAt + 1200)
    )
  }, [nodesArr, linksAll, clearTimers, pinAll, frameToFit])

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative"
      style={{ background: 'radial-gradient(ellipse at 50% 42%, #ffffff 0%, #eef2fb 55%, #e6ebf6 100%)' }}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        {/* Phase caption only while replaying the evolution (hidden when static) */}
        {playing && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb', backdropFilter: 'blur(6px)' }}
          >
            <span className="flex gap-1">
              {PHASES.map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= phase ? '#4f46e5' : '#d1d5db' }} />
              ))}
            </span>
            <span className="text-[11px] font-medium" style={{ color: '#4f46e5' }}>
              {PHASES[phase]}
            </span>
          </div>
        )}
        <button
          onClick={playEvolution}
          title="Replay the evolution"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium"
          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb', color: '#64748b' }}
        >
          <RotateCcw size={12} />
          Replay
        </button>
      </div>

      {size.w > 0 && size.h > 0 && (
        <ForceGraph3D
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={graphData}
          backgroundColor="rgba(255,255,255,0)"
          showNavInfo={false}
          controlType="orbit"
          enableNodeDrag={false}
          warmupTicks={0}
          cooldownTicks={playing ? 2000 : 0}
          nodeVal={(n: GNode) => 3 + Math.min(n.deg, 6)}
          nodeRelSize={6}
          nodeThreeObject={buildNode as any}
          linkCurvature={0.28}
          linkCurveRotation={(l: GLink) => l.__curveRot ?? 0}
          linkColor={(l: GLink) => {
            const touching =
              !!activeNodeId && (idOf(l.source) === activeNodeId || idOf(l.target) === activeNodeId)
            if (touching) return '#4338ca' // active relationship links: deep indigo
            return activeNodeId ? 'rgba(150,160,185,0.10)' : 'rgba(120,134,170,0.36)'
          }}
          linkWidth={1.4}
          linkOpacity={0.85}
          // Flow particles ONLY on the active node's relationship links (like 2D
          // emphasis); slow & calm. Other links stay light/static.
          linkDirectionalParticles={(l: GLink) =>
            activeNodeId && (idOf(l.source) === activeNodeId || idOf(l.target) === activeNodeId) ? 3 : 0
          }
          linkDirectionalParticleWidth={2.2}
          linkDirectionalParticleColor="#4f46e5"
          linkDirectionalParticleSpeed={0.0025}
          onNodeClick={handleNodeClick as any}
          onNodeHover={(n: any) => setHoveredNodeId(n ? n.id : null)}
          onBackgroundClick={() => onNodeSelect(null)}
        />
      )}
    </div>
  )
}
