// Minimal types for the workspace-load-ready package consumed by the Local Web
// Workspace loading proof. Intentionally narrow: only the fields the loader
// inspects, plus an index signature so unknown fields pass through without
// breaking. Do not expand this into a full schema mirror.

export interface WorkspaceLoadManifest {
  schema_version?: string
  mode?: string
  data_boundary?: string
  export?: {
    export_id?: string
    status?: string
    summary_file?: string
    [k: string]: unknown
  }
  files?: Array<{
    file_id?: string
    file_name?: string
    sha256?: string
    [k: string]: unknown
  }>
  source_counts?: {
    raw_files_exported?: number
    [k: string]: unknown
  }
  validation?: {
    status?: string
    [k: string]: unknown
  }
  no_secret_scan?: {
    status?: string
    findings_count?: number
    [k: string]: unknown
  }
  integrity?: {
    hash_algorithm?: string
    summary_file_sha256?: string
    [k: string]: unknown
  }
  operator_review?: {
    required?: boolean
    reviewed?: boolean
    decision?: string
    [k: string]: unknown
  }
  [k: string]: unknown
}

export interface WorkspaceSummary {
  schema_version?: string
  mode?: string
  data_boundary?: string
  workspace?: { [k: string]: unknown }
  metrics?: { [k: string]: unknown }
  projects?: unknown[]
  review_queue?: unknown[]
  candidate_reviews?: unknown[]
  action_feedback?: unknown[]
  knowledge_map_entries?: unknown[]
  risks?: unknown[]
  activity?: unknown[]
  [k: string]: unknown
}

/** Identifies one of the 13 declared gate conditions, plus loader-level guards
 *  (manifest unreachable, summary unreachable, SHA-256 mismatch). */
export type GateId =
  | 'env.enabled'
  | 'manifest.reachable'
  | 'manifest.parsed'
  | 'summary.reachable'
  | 'summary.parsed'
  | 'summary.sha256_compute'
  // The 13 declared gate conditions:
  | 'manifest.export.status'
  | 'manifest.operator_review.required'
  | 'manifest.operator_review.reviewed'
  | 'manifest.operator_review.decision'
  | 'manifest.validation.status'
  | 'manifest.no_secret_scan.status'
  | 'manifest.source_counts.raw_files_exported'
  | 'manifest.mode'
  | 'manifest.data_boundary'
  | 'manifest.export.summary_file'
  | 'summary.mode'
  | 'summary.data_boundary'
  | 'sha256.match'

export interface GateFailure {
  id: GateId
  /** Human-readable explanation of why this gate failed. Must not embed any
   *  field value that could be private data. */
  message: string
  severity: 'blocking'
}

export type WorkspaceLoadResult =
  | {
      status: 'approved'
      manifest: WorkspaceLoadManifest
      summary: WorkspaceSummary
    }
  | {
      status: 'blocked'
      failures: GateFailure[]
    }

/** All gates declared in the integration contract, in display order. Used by
 *  BlockedRefusal to render a complete checklist (pass / fail) even when the
 *  loader short-circuited early. */
export const ALL_GATES: { id: GateId; label: string }[] = [
  { id: 'env.enabled',                                label: 'NEXT_PUBLIC_ENABLE_LOCAL_WORKSPACE === "true"' },
  { id: 'manifest.reachable',                         label: 'Manifest reachable at /workspace-load-ready/export-manifest.json' },
  { id: 'manifest.parsed',                            label: 'Manifest parses as JSON' },
  { id: 'summary.reachable',                          label: 'Summary reachable at /workspace-load-ready/workspace-summary.private.json' },
  { id: 'summary.parsed',                             label: 'Summary parses as JSON' },
  { id: 'summary.sha256_compute',                     label: 'SHA-256 of summary computes via Web Crypto' },
  // 13 declared:
  { id: 'manifest.export.status',                     label: 'manifest.export.status === "validated"' },
  { id: 'manifest.operator_review.required',          label: 'manifest.operator_review.required === true' },
  { id: 'manifest.operator_review.reviewed',          label: 'manifest.operator_review.reviewed === true' },
  { id: 'manifest.operator_review.decision',          label: 'manifest.operator_review.decision === "approved"' },
  { id: 'manifest.validation.status',                 label: 'manifest.validation.status === "passed"' },
  { id: 'manifest.no_secret_scan.status',             label: 'manifest.no_secret_scan.status === "passed"' },
  { id: 'manifest.source_counts.raw_files_exported',  label: 'manifest.source_counts.raw_files_exported === 0' },
  { id: 'manifest.mode',                              label: 'manifest.mode === "local_private"' },
  { id: 'manifest.data_boundary',                     label: 'manifest.data_boundary === "local_private_export_manifest"' },
  { id: 'manifest.export.summary_file',               label: 'manifest.export.summary_file === "workspace-summary.private.json"' },
  { id: 'summary.mode',                               label: 'summary.mode === "local_private"' },
  { id: 'summary.data_boundary',                      label: 'summary.data_boundary === "local_private_summary"' },
  { id: 'sha256.match',                               label: 'SHA-256 matches both manifest.integrity.summary_file_sha256 and manifest.files[0].sha256' },
]
