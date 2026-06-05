import type { Metadata } from 'next'
import { GraphDemoShell } from '@/components/demo/GraphDemoShell'
import { semanticOsDemo } from '@/data/semanticOsDemo'

export const metadata: Metadata = {
  title: 'Semantic OS in Action | Knowledge Map AI',
  description:
    'See how Semantic OS transforms business records into structured knowledge, actions, feedback, playbooks and visual Context Packs for Knowledge Map AI.',
}

// All content is sanitized, static, and safe for public deployment. The page
// does not load any Context Pack, does not read C:\Drive-semantic, does not
// call any agent and does not depend on Local Private Mode.

export default function SemanticOsDemoPage() {
  return (
    <GraphDemoShell
      dataset={semanticOsDemo}
      otherDemo={{ href: '/agent-workspace', label: 'Agent Workspace' }}
    />
  )
}
