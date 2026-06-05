import { type DemoStatus } from '@/types/demo'

// One palette for all demo graphs. Tuned to match the homepage 2D / 3D look
// (light backgrounds, slightly deeper saturation so labels read on white).
export const TYPE_COLORS: Record<string, string> = {
  // Semantic OS demo
  record:        '#3b82f6', // blue
  process:       '#6366f1', // indigo
  memory:        '#8b5cf6', // violet
  evidence:      '#06b6d4', // cyan
  risk:          '#ef4444', // red
  decision:      '#f59e0b', // amber
  action:        '#ec4899', // pink
  outcome:       '#10b981', // emerald
  feedback:      '#14b8a6', // teal
  rule:          '#eab308', // yellow
  playbook:      '#0ea5e9', // sky
  export:        '#d946ef', // fuchsia
  visualization: '#4f46e5', // indigo

  // Agent workspace demo
  goal:      '#f59e0b', // amber
  query:     '#06b6d4', // cyan
  context:   '#6366f1', // indigo
  planner:   '#8b5cf6', // violet
  agent:     '#d946ef', // fuchsia
  review:    '#f97316', // orange
  result:    '#10b981', // emerald
  writeback: '#ec4899', // pink
}

export function colorForType(t?: string): string {
  if (!t) return '#94a3b8'
  return TYPE_COLORS[t] ?? '#94a3b8'
}

// Status accents (border / ring colour, badge background, etc.) tuned for a
// white canvas: deep enough to read on light backgrounds, not neon.
export const STATUS_COLORS: Record<DemoStatus, string> = {
  idle:      '#64748b',
  active:    '#4f46e5',
  running:   '#06b6d4',
  completed: '#10b981',
  waiting:   '#94a3b8',
  review:    '#f59e0b',
}

export const STATUS_LABEL: Record<DemoStatus, string> = {
  idle:      'idle',
  active:    'active',
  running:   'running',
  completed: 'completed',
  waiting:   'waiting',
  review:    'review',
}
