import { type DemoStatus } from '@/types/demo'

// One palette for all demo graphs. Soft, distinct, friendly on a dark canvas.
export const TYPE_COLORS: Record<string, string> = {
  // Semantic OS demo
  record:        '#60a5fa', // blue
  process:       '#818cf8', // indigo
  memory:        '#a78bfa', // violet
  evidence:      '#22d3ee', // cyan
  risk:          '#f87171', // red
  decision:      '#fbbf24', // amber
  action:        '#f472b6', // pink
  outcome:       '#34d399', // emerald
  feedback:      '#2dd4bf', // teal
  rule:          '#facc15', // yellow
  playbook:      '#38bdf8', // sky
  export:        '#e879f9', // fuchsia
  visualization: '#818cf8', // indigo

  // Agent workspace demo
  goal:      '#fbbf24', // amber
  query:     '#22d3ee', // cyan
  context:   '#818cf8', // indigo
  planner:   '#a78bfa', // violet
  agent:     '#e879f9', // fuchsia
  review:    '#fb923c', // orange
  result:    '#34d399', // emerald
  writeback: '#f472b6', // pink
}

export function colorForType(t?: string): string {
  if (!t) return '#94a3b8'
  return TYPE_COLORS[t] ?? '#94a3b8'
}

// Status accents (border / ring colour, badge background, etc.)
export const STATUS_COLORS: Record<DemoStatus, string> = {
  idle:      '#64748b',
  active:    '#818cf8',
  running:   '#22d3ee',
  completed: '#34d399',
  waiting:   '#94a3b8',
  review:    '#fbbf24',
}

export const STATUS_LABEL: Record<DemoStatus, string> = {
  idle:      'idle',
  active:    'active',
  running:   'running',
  completed: 'completed',
  waiting:   'waiting',
  review:    'review',
}
