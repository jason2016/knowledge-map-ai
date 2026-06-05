import { type DemoDataset } from '@/types/demo'

// All content is sanitized static simulation. No real customer / IP / GUID /
// internal path. Safe for public deployment.

export const semanticOsDemo: DemoDataset = {
  title: 'Semantic OS in Action',
  subtitle: 'From business records to structured AI memory',
  intro:
    'Semantic OS turns daily business records into structured operational memory, reusable playbooks and visual Context Packs.',

  nodes: [
    {
      id: 'business-record',
      label: 'Business Record',
      type: 'record',
      layer: 'capture',
      description: 'A raw business record entering the system.',
      example:
        'A production operation note describing a domain onboarding and SSL setup.',
    },
    {
      id: 'distillation',
      label: 'Distillation',
      type: 'process',
      layer: 'distill',
      description: 'Extracts key facts, entities and risks from the raw record.',
      example: 'Identifies the topic, project, action and risks.',
    },
    {
      id: 'structured-memory',
      label: 'Structured Memory',
      type: 'memory',
      layer: 'memory',
      description: 'Normalized facts kept as long-lived operational memory.',
      example: 'Project, topic, action, evidence and risks become reusable structure.',
    },
    {
      id: 'evidence',
      label: 'Evidence',
      type: 'evidence',
      layer: 'memory',
      description: 'Concrete signals that support the structured facts.',
      example: 'Configuration outputs, validation logs and dated screenshots.',
    },
    {
      id: 'risk',
      label: 'Risk',
      type: 'risk',
      layer: 'memory',
      description: 'Known risks attached to a topic so future decisions can avoid them.',
      example:
        'DNS delay, server configuration conflict and certificate renewal failure.',
    },
    {
      id: 'decision',
      label: 'Decision',
      type: 'decision',
      layer: 'plan',
      description: 'A choice taken given the available memory and risks.',
      example: 'Use a unified domain-onboarding procedure with SSL automation.',
    },
    {
      id: 'action',
      label: 'Action',
      type: 'action',
      layer: 'execute',
      description: 'The concrete operation that follows the decision.',
      example: 'Provision DNS, configure HTTPS and validate the renewal cycle.',
    },
    {
      id: 'outcome',
      label: 'Outcome',
      type: 'outcome',
      layer: 'execute',
      description: 'What actually happened after the action ran.',
      example: 'HTTPS active and verified, renewal scheduled and confirmed.',
    },
    {
      id: 'action-feedback',
      label: 'Action Feedback',
      type: 'feedback',
      layer: 'feedback',
      description: 'Lessons recorded so the next cycle can do better.',
      example:
        'Always separate production and test environments; verify DNS, configuration and renewal.',
    },
    {
      id: 'reusable-rule',
      label: 'Reusable Rule',
      type: 'rule',
      layer: 'memory',
      description: 'A rule promoted from a repeated lesson.',
      example: 'Repeatable operations must become playbooks.',
    },
    {
      id: 'playbook',
      label: 'Playbook',
      type: 'playbook',
      layer: 'memory',
      description: 'A reusable checklist for a known operation.',
      example:
        'Confirm DNS, check server mapping, test config, issue/renew SSL, verify HTTPS.',
    },
    {
      id: 'context-pack',
      label: 'Context Pack',
      type: 'export',
      layer: 'export',
      description: 'A clean structured packet of knowledge for visualization.',
      example: 'Nodes, edges, causality, sources, actions and playbooks bundled together.',
    },
    {
      id: 'knowledge-map-ai-view',
      label: 'Knowledge Map AI View',
      type: 'visualization',
      layer: 'view',
      description: 'The 2D / 3D visual layer humans actually look at.',
      example:
        'Relationships, action chains, sources and context surfaced as a navigable graph.',
    },
  ],

  edges: [
    { id: 'e1',  source: 'business-record',    target: 'distillation',          label: 'distill' },
    { id: 'e2',  source: 'distillation',       target: 'structured-memory',     label: 'produces' },
    { id: 'e3',  source: 'evidence',           target: 'structured-memory',     label: 'supports' },
    { id: 'e4',  source: 'risk',               target: 'decision',              label: 'informs' },
    { id: 'e5',  source: 'structured-memory',  target: 'decision',              label: 'guides' },
    { id: 'e6',  source: 'decision',           target: 'action',                label: 'triggers' },
    { id: 'e7',  source: 'action',             target: 'outcome',               label: 'produces' },
    { id: 'e8',  source: 'outcome',            target: 'action-feedback',       label: 'becomes' },
    { id: 'e9',  source: 'action-feedback',    target: 'reusable-rule',         label: 'distills' },
    { id: 'e10', source: 'action-feedback',    target: 'playbook',              label: 'updates' },
    { id: 'e11', source: 'structured-memory',  target: 'context-pack',          label: 'exports' },
    { id: 'e12', source: 'context-pack',       target: 'knowledge-map-ai-view', label: 'renders' },
    { id: 'e13', source: 'playbook',           target: 'context-pack',          label: 'included in' },
    { id: 'e14', source: 'reusable-rule',      target: 'structured-memory',     label: 'enriches' },
  ],

  steps: [
    {
      id: 's1',
      title: 'Capture',
      description:
        'A business record enters the system: support note, meeting note, email, operation log or AI conversation.',
      focusNodeIds: ['business-record'],
    },
    {
      id: 's2',
      title: 'Distill',
      description:
        'Semantic OS extracts key facts, entities, risks, decisions and business context.',
      focusNodeIds: ['business-record', 'distillation', 'structured-memory', 'evidence', 'risk'],
      focusEdgeIds: ['e1', 'e2', 'e3'],
    },
    {
      id: 's3',
      title: 'Decide and Act',
      description:
        'Structured memory becomes a decision, an action and a measurable outcome.',
      focusNodeIds: ['structured-memory', 'risk', 'decision', 'action', 'outcome'],
      focusEdgeIds: ['e4', 'e5', 'e6', 'e7'],
    },
    {
      id: 's4',
      title: 'Feedback',
      description: 'Results are written back as lessons, rules and reusable playbooks.',
      focusNodeIds: ['outcome', 'action-feedback', 'reusable-rule', 'playbook'],
      focusEdgeIds: ['e8', 'e9', 'e10', 'e14'],
    },
    {
      id: 's5',
      title: 'Export',
      description:
        'Semantic OS exports a clean Context Pack for graph visualization.',
      focusNodeIds: ['structured-memory', 'playbook', 'context-pack', 'knowledge-map-ai-view'],
      focusEdgeIds: ['e11', 'e12', 'e13'],
    },
  ],
}
