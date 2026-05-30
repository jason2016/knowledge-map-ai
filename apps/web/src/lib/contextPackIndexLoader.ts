// Index loader — discovers Context Packs from /context-packs/index.json (which
// is served from C:\Drive-semantic\context-packs\index.json through the public
// junction; see docs/setup/2026-05-30-context-pack-exchange-setup.md).

export interface ContextPackIndexEntry {
  pack_id: string
  title: string
  target?: {
    name?: string
    slug?: string
    type?: string
  }
  query?: {
    original_question?: string
    query_mode?: string
  }
  created?: string
  path?: string
  public_fetch_path: string
  status?: string
  source?: string
  node_count?: number
  edge_count?: number
  action_count?: number
  future_plan_count?: number
}

export interface ContextPackIndex {
  updated?: string
  description?: string
  packs: ContextPackIndexEntry[]
}

export const CONTEXT_PACK_INDEX_URL = '/context-packs/index.json'

export async function loadContextPackIndex(
  url: string = CONTEXT_PACK_INDEX_URL
): Promise<ContextPackIndex> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch Context Pack index (${res.status}): ${url}`)
  const json = (await res.json()) as Partial<ContextPackIndex>
  if (!json || !Array.isArray(json.packs)) {
    throw new Error('Context Pack index is missing the `packs` array')
  }
  // Defensive: require public_fetch_path so click handlers always have a URL.
  const packs = json.packs.filter(
    (p): p is ContextPackIndexEntry =>
      !!p && typeof p.pack_id === 'string' && typeof p.public_fetch_path === 'string'
  )
  return { updated: json.updated, description: json.description, packs }
}
