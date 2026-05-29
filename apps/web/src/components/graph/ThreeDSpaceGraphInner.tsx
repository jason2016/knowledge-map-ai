'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import ForceGraph3D from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force-3d'
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
}

interface Props {
  nodes: Node<KnowledgeNodeData>[]
  edges: Edge<KnowledgeEdgeData>[]
  selectedNodeId: string | null
  onNodeSelect: (id: string | null) => void
  visible?: boolean
}

const idOf = (end: string | GNode) => (typeof end === 'object' ? end.id : end)

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
  visible = true,
}: Props) {
  const fgRef = useRef<any>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const decoratedRef = useRef(false)
  const fittedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  // Replay = step-by-step build of ONE node's relationships.
  const [replayMode, setReplayMode] = useState<'focus' | 'global' | null>(null)
  const [replayFocus, setReplayFocus] = useState<string | null>(null)
  const [replayStep, setReplayStep] = useState(0)
  const playing = replayMode !== null

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    setSize({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  // Pre-settle a 3D layout synchronously, then PIN it (static, framed, no jitter).
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


  // The focus node's relationship links (ordered) — used by Replay.
  const focusLinks = useMemo(
    () =>
      replayFocus
        ? linksAll.filter((l) => idOf(l.source) === replayFocus || idOf(l.target) === replayFocus)
        : [],
    [replayFocus, linksAll]
  )

  // Links shown: during replay only the focus node's links, revealed one by one.
  const visibleLinks = useMemo(() => {
    if (replayMode === 'focus') return focusLinks.slice(0, replayStep)
    if (replayMode === 'global') return linksAll.slice(0, replayStep)
    return linksAll
  }, [replayMode, focusLinks, linksAll, replayStep])
  const graphData = useMemo(() => ({ nodes: nodesArr, links: visibleLinks }), [nodesArr, visibleLinks])

  // Active node (focus replay → focus; global replay → none; else hover/select).
  const baseActive = hoveredNodeId ?? selectedNodeId
  const activeId = replayMode === 'focus' ? replayFocus : replayMode === 'global' ? null : baseActive

  const neighborSet = useMemo(() => {
    const s = new Set<string>()
    if (replayMode === 'focus') {
      focusLinks.slice(0, replayStep).forEach((l) => {
        s.add(idOf(l.source) === replayFocus ? idOf(l.target) : idOf(l.source))
      })
      return s
    }
    if (replayMode === 'global' || !activeId) return s
    edges.forEach((e) => {
      if (e.source === activeId) s.add(e.target)
      if (e.target === activeId) s.add(e.source)
    })
    return s
  }, [replayMode, focusLinks, replayStep, replayFocus, activeId, edges])

  // Global replay: nodes light up as they get connected (in time order).
  const globalBright = useMemo(() => {
    if (replayMode !== 'global') return null
    const s = new Set<string>()
    if (nodesArr[0]) s.add(nodesArr[0].id)
    linksAll.slice(0, replayStep).forEach((l) => {
      s.add(idOf(l.source))
      s.add(idOf(l.target))
    })
    return s
  }, [replayMode, replayStep, linksAll, nodesArr])

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

  useEffect(() => () => clearTimers(), [clearTimers])

  // Reset fit on dataset change.
  useEffect(() => {
    setReplayFocus(null)
    setReplayStep(0)
    fittedRef.current = false
  }, [nodesArr])

  // Frame the whole layout once (no delayed zoom → no sudden enlarge).
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
      const D = Math.max(R / Math.tan(fov / 2), R / (Math.tan(fov / 2) * aspect)) * 0.82
      const c = fg.controls?.()
      if (c) {
        c.minDistance = Math.max(140, D * 0.5)
        c.maxDistance = D * 1.6
      }
      fg.cameraPosition({ x: 0, y: 0, z: D }, { x: 0, y: 0, z: 0 }, ms)
    },
    [nodesArr, size.w, size.h]
  )

  // Frame on first paint AND whenever the viewport changes (mobile/desktop,
  // orientation, window resize) so 3D always fits — incl. narrow phone screens.
  // The Node Memory Panel is an overlay/bottom-sheet, so selecting a node does
  // NOT resize this canvas → no refit/jitter on click.
  // Fit on mount / size change / becoming visible only. NOT tied to `playing`,
  // so finishing a Replay never re-frames the camera (no jump at the end).
  useEffect(() => {
    if (!visible || size.w === 0) return
    const id = window.requestAnimationFrame(() => frameToFit(0))
    return () => window.cancelAnimationFrame(id)
  }, [visible, size.w, size.h, frameToFit])

  // Looser layout safeguard.
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return
    fg.d3Force('charge')?.strength(-180)
  }, [size.w, size.h])

  // Lighting + volumetric light dot-field (once).
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return
    const scene = fg.scene?.()
    if (!scene || decoratedRef.current) return
    try {
      decoratedRef.current = true
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

  // Build each node ONCE (stable; selection styling applied by mutation).
  const buildNode = useCallback((n: GNode) => {
    const base = ENTITY_COLORS[n.entityType] ?? '#6366f1'
    const radius = 4 + Math.min(n.deg, 6) + 3
    const group = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(base),
      roughness: 0.5,
      metalness: 0,
      emissive: new THREE.Color(base),
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
        opacity: 0,
      })
    )
    halo.scale.set(radius * 7, radius * 7, 1)
    halo.userData = { role: 'halo' }
    halo.raycast = () => {}
    group.add(halo)

    const sprite = new SpriteText(n.label)
    sprite.color = '#334155'
    sprite.textHeight = 3.6
    sprite.fontWeight = '600'
    ;(sprite as any).position.y = -(radius + 7)
    sprite.userData = { role: 'label' }
    ;(sprite as any).raycast = () => {}
    group.add(sprite)
    return group
  }, [])

  // Highlight by mutation only (no rebuild / no move → no jitter).
  useEffect(() => {
    nodesArr.forEach((n) => {
      const obj = n.__threeObj
      if (!obj) return
      let active: boolean
      let dim: boolean
      if (globalBright) {
        // Global replay: revealed nodes are bright, the rest fade in over time.
        active = false
        dim = !globalBright.has(n.id)
      } else {
        active = n.id === activeId
        const neighbor = neighborSet.has(n.id)
        dim = !!activeId && !active && !neighbor
      }
      obj.children.forEach((ch: any) => {
        const role = ch.userData?.role
        if (role === 'node') {
          const m = ch.material
          m.color.set(dim ? '#cdd3e0' : ch.userData.baseColor)
          m.emissive?.set(dim ? '#000000' : ch.userData.baseColor)
          m.emissiveIntensity = dim ? 0 : 0.22
          m.opacity = dim ? 0.14 : 1
          m.needsUpdate = true
        } else if (role === 'halo') {
          ch.material.opacity = active ? 0.85 : 0
        } else if (role === 'label') {
          const targetH = active ? 5.4 : 3.6
          if (ch.textHeight !== targetH) ch.textHeight = targetH
          ch.color = dim ? 'rgba(71,85,105,0.22)' : active ? '#0f172a' : '#334155'
        }
      })
    })
  }, [activeId, neighborSet, nodesArr, replayStep, globalBright])

  const handleNodeClick = useCallback(
    (node: GNode) => onNodeSelect(node.id === selectedNodeId ? null : node.id),
    [onNodeSelect, selectedNodeId]
  )

  // Replay:
  //  • a node selected → build THAT node's relationships one connection at a time;
  //  • nothing selected → build the WHOLE map, nodes/links appearing in time order.
  const playReplay = useCallback(() => {
    clearTimers()
    const t = timersRef.current
    // Focus the picked node (selected OR currently touched/hovered). Only when
    // nothing is picked does Replay build the whole map.
    const focusCandidate = selectedNodeId ?? hoveredNodeId
    if (focusCandidate) {
      const focus = focusCandidate
      const fl = linksAll.filter((l) => idOf(l.source) === focus || idOf(l.target) === focus)
      setReplayMode('focus')
      setReplayFocus(focus)
      setReplayStep(0)
      fl.forEach((_, i) => t.push(window.setTimeout(() => setReplayStep(i + 1), 500 + i * 750)))
      t.push(
        window.setTimeout(() => {
          setReplayMode(null)
          setReplayFocus(null)
          setReplayStep(0)
          onNodeSelect(focus)
        }, 500 + fl.length * 750 + 500)
      )
    } else {
      const total = linksAll.length
      setReplayMode('global')
      setReplayFocus(null)
      setReplayStep(0)
      for (let i = 1; i <= total; i++) {
        t.push(window.setTimeout(() => setReplayStep(i), 400 + i * 550))
      }
      t.push(
        window.setTimeout(() => {
          setReplayMode(null)
          setReplayStep(0)
        }, 400 + total * 550 + 500)
      )
    }
  }, [selectedNodeId, hoveredNodeId, linksAll, clearTimers, onNodeSelect])

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative"
      style={{ background: 'radial-gradient(ellipse at 50% 42%, #ffffff 0%, #eef2fb 55%, #e6ebf6 100%)' }}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        {playing && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', backdropFilter: 'blur(6px)' }}
          >
            <span className="text-[11px] font-medium" style={{ color: '#4f46e5' }}>
              {replayMode === 'global'
                ? `Building map · ${replayStep}/${linksAll.length}`
                : `Building relationships · ${replayStep}/${focusLinks.length}`}
            </span>
          </div>
        )}
        <button
          onClick={playReplay}
          title="Replay how this node's relationships are built"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium"
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #e5e7eb', color: '#64748b' }}
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
          cooldownTicks={0}
          nodeVal={(n: GNode) => 3 + Math.min(n.deg, 6)}
          nodeRelSize={6}
          nodeThreeObject={buildNode as any}
          linkCurvature={0.28}
          linkCurveRotation={(l: GLink) => l.__curveRot ?? 0}
          linkColor={(l: GLink) => {
            const touching =
              !!activeId && (idOf(l.source) === activeId || idOf(l.target) === activeId)
            if (touching) return '#4338ca'
            return activeId ? 'rgba(150,160,185,0.10)' : 'rgba(110,124,160,0.55)'
          }}
          linkWidth={0.7}
          linkOpacity={0.8}
          linkDirectionalParticles={(l: GLink) =>
            activeId && (idOf(l.source) === activeId || idOf(l.target) === activeId) ? 3 : 0
          }
          linkDirectionalParticleWidth={2.2}
          linkDirectionalParticleColor="#4f46e5"
          linkDirectionalParticleSpeed={0.0025}
          onNodeClick={handleNodeClick as any}
          onNodeHover={(n: any) => !playing && setHoveredNodeId(n ? n.id : null)}
          onBackgroundClick={() => onNodeSelect(null)}
        />
      )}
    </div>
  )
}
