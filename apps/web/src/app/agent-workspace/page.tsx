import type { Metadata } from 'next'
import { GraphDemoShell } from '@/components/demo/GraphDemoShell'
import { agentWorkspaceDemo } from '@/data/agentWorkspaceDemo'

export const metadata: Metadata = {
  title: 'Agent Workspace | Semantic OS + Knowledge Map AI',
  description:
    'A simulated execution layer showing how Semantic OS can guide AI agents from knowledge to planning, execution, feedback and continuous learning.',
}

// All content is sanitized, static, and safe for public deployment. The page
// does not load any Context Pack, does not read C:\Drive-semantic, does not
// call any agent and does not depend on Local Private Mode.

export default function AgentWorkspacePage() {
  return (
    <GraphDemoShell
      dataset={agentWorkspaceDemo}
      otherDemo={{ href: '/semantic-os-demo', label: 'Semantic OS Demo' }}
    />
  )
}
