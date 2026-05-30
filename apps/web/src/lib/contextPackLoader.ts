import { type ContextPack } from '@/types/context-pack'

export const NEIGE_ROUGE_PACK_URL =
  '/context-packs/neige-rouge/2026-05-30-query-commercial-launch-problems/context-pack.json'

export async function loadContextPack(packUrl: string): Promise<ContextPack> {
  const res = await fetch(packUrl, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch Context Pack (${res.status}): ${packUrl}`)
  }
  const pack = (await res.json()) as Partial<ContextPack>
  if (!pack || typeof pack !== 'object') {
    throw new Error('Context Pack JSON is empty or not an object')
  }
  if (!pack.graph || !Array.isArray(pack.graph.nodes)) {
    throw new Error('Context Pack is missing graph.nodes')
  }
  if (!Array.isArray(pack.graph.edges)) {
    throw new Error('Context Pack is missing graph.edges')
  }
  if (!pack.summary || typeof pack.summary.direct_answer !== 'string') {
    throw new Error('Context Pack is missing summary.direct_answer')
  }
  return pack as ContextPack
}

// Resolve a node's memory_file (relative to the pack) into a fetchable URL.
export function resolveMemoryFileUrl(packUrl: string, memoryFile: string): string {
  // packUrl ends with /context-pack.json — strip the file name to get the pack root.
  const base = packUrl.replace(/[^/]+$/, '')
  return base + memoryFile.replace(/^\.?\//, '')
}

export async function loadMemoryFileMarkdown(packUrl: string, memoryFile: string): Promise<string> {
  const url = resolveMemoryFileUrl(packUrl, memoryFile)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch memory file (${res.status}): ${url}`)
  return res.text()
}
