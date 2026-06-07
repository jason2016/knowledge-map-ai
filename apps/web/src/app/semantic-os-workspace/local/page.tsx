import type { Metadata } from 'next'
import { WorkspaceLoadReadyShell } from '@/components/workspace-local/WorkspaceLoadReadyShell'

export const metadata: Metadata = {
  title: 'Local Web Workspace | Semantic OS Workspace',
  description:
    'Local Private Workspace loading proof. Default Public Demo Mode refuses to render private data. All gate conditions must pass.',
}

// Local Web Workspace loading proof — step 1.
// Static server route shell. Hands off to a client component that:
//   - refuses to fetch unless NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE === "true",
//   - evaluates all 13 declared gate conditions,
//   - never renders private summary data unless the loader returns approved.
// In step 1 the approved view is intentionally a placeholder only.
export default function LocalWebWorkspacePage() {
  return <WorkspaceLoadReadyShell />
}
