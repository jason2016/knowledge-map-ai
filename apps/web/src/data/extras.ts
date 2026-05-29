import { type Node, type Edge } from '@xyflow/react'
import { type KnowledgeNodeData, type KnowledgeEdgeData, type DemoId, type EntityType } from '@/types'

// Predefined "newly ingested" nodes. Clicking the + on a data source appends the
// next unused batch for that entity type, so the map demonstrably grows a new
// node together with its relationships.
export interface ExtraBatch {
  type: EntityType
  node: Node<KnowledgeNodeData>
  edges: Edge<KnowledgeEdgeData>[]
}

function n(
  id: string,
  entityType: EntityType,
  label: string,
  summary: string
): Node<KnowledgeNodeData> {
  return {
    id,
    type: 'knowledgeNode',
    position: { x: 0, y: 0 },
    data: {
      label,
      entityType,
      summary,
      sourceNotes: ['Newly ingested in this session'],
      recentActivity: ['Added just now'],
      relatedQuestions: ['What is this connected to?', 'Why was it created?'],
      possibleActions: ['Review details', 'Link to a case'],
    },
  }
}

function e(id: string, source: string, target: string, label: string): Edge<KnowledgeEdgeData> {
  return { id, source, target, label, data: { weight: 2 }, type: 'floating' }
}

export const EXTRAS: Record<DemoId, ExtraBatch[]> = {
  accounting: [
    {
      type: 'client',
      node: n('x-client-2', 'client', 'Client Beta', 'New client onboarded this quarter. Linked to Alpha Consulting group.'),
      edges: [e('x-e1', 'x-client-2', 'company-1', 'part of'), e('x-e2', 'x-client-2', 'deadline-1', 'subject to')],
    },
    {
      type: 'invoice',
      node: n('x-invoice-2', 'invoice', 'Invoice #2026-002', '€8,200 follow-on invoice for Client Alpha. TVA 20%.'),
      edges: [e('x-e3', 'x-invoice-2', 'client-1', 'issued'), e('x-e4', 'x-invoice-2', 'vat-1', 'applies')],
    },
    {
      type: 'vatRule',
      node: n('x-vat-2', 'vatRule', 'VAT Rule FR-2024-02', 'Reduced VAT 10% for specific services. CGI Art. 279.'),
      edges: [e('x-e5', 'x-vat-2', 'invoice-1', 'may apply'), e('x-e6', 'x-vat-2', 'deadline-1', 'due by')],
    },
    {
      type: 'email',
      node: n('x-email-2', 'email', 'Reminder Email', 'Automated reminder sent to Client Alpha about the missing KBIS.'),
      edges: [e('x-e7', 'x-email-2', 'client-1', 'sent to'), e('x-e8', 'x-email-2', 'missing-1', 'about')],
    },
    {
      type: 'deadline',
      node: n('x-deadline-2', 'deadline', 'Payment Deadline', 'Invoice #2026-001 payment due 5 Mar 2026.'),
      edges: [e('x-e9', 'x-deadline-2', 'invoice-1', 'for'), e('x-e10', 'x-deadline-2', 'client-1', 'concerns')],
    },
    {
      type: 'case',
      node: n('x-case-2', 'case', 'Audit Case 2026', 'Annual audit case covering Client Alpha and applicable VAT rules.'),
      edges: [e('x-e11', 'x-case-2', 'client-1', 'regarding'), e('x-e12', 'x-case-2', 'vat-1', 'involves')],
    },
  ],
  exhibition: [
    {
      type: 'exhibitor',
      node: n('x-exhib-2', 'exhibitor', 'Exhibitor Beta', 'Second-time exhibitor showcasing fintech tools.'),
      edges: [e('x-e1', 'x-exhib-2', 'exh-1', 'features'), e('x-e2', 'x-exhib-2', 'booth-1', 'near')],
    },
    {
      type: 'visitor',
      node: n('x-visitor-2', 'visitor', 'Visitor John Doe', 'CTO at DataForge. Visited multiple AI booths.'),
      edges: [e('x-e3', 'x-visitor-2', 'exh-1', 'attended'), e('x-e4', 'x-visitor-2', 'exhib-1', 'interested in')],
    },
    {
      type: 'campaign',
      node: n('x-campaign-2', 'campaign', 'Campaign Summer 2026', 'Post-event nurture campaign across email and social.'),
      edges: [e('x-e5', 'x-campaign-2', 'exh-1', 'promotes'), e('x-e6', 'x-campaign-2', 'content-1', 'uses')],
    },
    {
      type: 'partner',
      node: n('x-partner-2', 'partner', 'Partner — TechDaily', 'Tech media partner amplifying the expo to 60k readers.'),
      edges: [e('x-e7', 'x-partner-2', 'campaign-1', 'sponsors')],
    },
    {
      type: 'booth',
      node: n('x-booth-2', 'booth', 'Booth C7', '18m² booth in Hall C for Exhibitor Beta.'),
      edges: [e('x-e8', 'x-booth-2', 'exh-1', 'located in'), e('x-e9', 'x-booth-2', 'exhib-1', 'occupied by')],
    },
    {
      type: 'followup',
      node: n('x-followup-2', 'followup', 'Follow-up Call', 'Scheduled call with Lead #L-204 to advance the opportunity.'),
      edges: [e('x-e10', 'x-followup-2', 'lead-1', 'for'), e('x-e11', 'x-followup-2', 'visitor-1', 'with')],
    },
  ],
}
