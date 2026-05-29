'use client'
import { createContext } from 'react'
import { type EntityType } from '@/types'

// Volatile interaction state lives OUTSIDE the React Flow nodes/edges arrays.
// Driving hover / selection / focus through context (instead of mutating the
// node objects) keeps those arrays referentially stable, so React Flow never
// reconciles or re-measures nodes on hover — which is what eliminates the
// canvas jitter for good.
export interface GraphInteraction {
  activeNodeId: string | null
  selectedNodeId: string | null
  neighborIds: Set<string>
  focusType: EntityType | null
  focusNodeIds: Set<string>
}

export const GraphInteractionContext = createContext<GraphInteraction>({
  activeNodeId: null,
  selectedNodeId: null,
  neighborIds: new Set(),
  focusType: null,
  focusNodeIds: new Set(),
})
