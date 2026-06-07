// Local Web Workspace loader — implements the 13 gate conditions declared in
// the Semantic OS Workspace Load Ready Integration Contract v0.1.
//
// The loader is intentionally write-free: it only reads two static assets
// served from /workspace-load-ready/ via the existing Next.js public folder.
// It performs:
//
//   1. Fetch the manifest JSON.
//   2. Fetch the summary JSON as ArrayBuffer (raw bytes are needed for the
//      SHA-256 verification step).
//   3. Compute SHA-256 of the summary bytes via Web Crypto.
//   4. Evaluate all 13 declared gate conditions.
//
// If any gate fails the loader returns { status: 'blocked', failures } and
// does not expose the parsed summary. The caller (the React shell) must
// not render summary data unless status === 'approved'.

import {
  type GateFailure,
  type GateId,
  type WorkspaceLoadManifest,
  type WorkspaceLoadResult,
  type WorkspaceSummary,
} from '@/types/workspace-load-ready'

export const DEFAULT_MANIFEST_URL = '/workspace-load-ready/export-manifest.json'
export const DEFAULT_SUMMARY_URL = '/workspace-load-ready/workspace-summary.private.json'

export interface LoadOptions {
  manifestUrl?: string
  summaryUrl?: string
}

/**
 * Convert an ArrayBuffer of bytes into a lower-case hex SHA-256 string using
 * the Web Crypto API. No third-party dependency.
 */
async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buf)
  const bytes = new Uint8Array(digest)
  let out = ''
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0')
  }
  return out
}

function fail(id: GateId, message: string): GateFailure {
  return { id, message, severity: 'blocking' }
}

/**
 * Load and verify the workspace-load-ready package. Returns a discriminated
 * union. On `blocked`, `failures` lists every gate that did not pass; the
 * caller must not render any summary data.
 */
export async function loadWorkspaceLoadReady(
  options: LoadOptions = {}
): Promise<WorkspaceLoadResult> {
  const manifestUrl = options.manifestUrl ?? DEFAULT_MANIFEST_URL
  const summaryUrl = options.summaryUrl ?? DEFAULT_SUMMARY_URL

  // ── (a) Fetch manifest ───────────────────────────────────────────────
  let manifest: WorkspaceLoadManifest
  try {
    const res = await fetch(manifestUrl, { cache: 'no-store' })
    if (!res.ok) {
      return {
        status: 'blocked',
        failures: [
          fail(
            'manifest.reachable',
            `Manifest fetch returned HTTP ${res.status}.`
          ),
        ],
      }
    }
    try {
      manifest = (await res.json()) as WorkspaceLoadManifest
    } catch (err) {
      return {
        status: 'blocked',
        failures: [
          fail(
            'manifest.parsed',
            `Manifest is not valid JSON: ${
              err instanceof Error ? err.message : String(err)
            }`
          ),
        ],
      }
    }
  } catch (err) {
    return {
      status: 'blocked',
      failures: [
        fail(
          'manifest.reachable',
          `Manifest unreachable: ${
            err instanceof Error ? err.message : String(err)
          }`
        ),
      ],
    }
  }

  // ── (b) Fetch summary as bytes + parse as JSON ───────────────────────
  let summaryBuf: ArrayBuffer
  let summary: WorkspaceSummary
  try {
    const res = await fetch(summaryUrl, { cache: 'no-store' })
    if (!res.ok) {
      return {
        status: 'blocked',
        failures: [
          fail(
            'summary.reachable',
            `Summary fetch returned HTTP ${res.status}.`
          ),
        ],
      }
    }
    summaryBuf = await res.arrayBuffer()
    try {
      const text = new TextDecoder('utf-8').decode(summaryBuf)
      summary = JSON.parse(text) as WorkspaceSummary
    } catch (err) {
      return {
        status: 'blocked',
        failures: [
          fail(
            'summary.parsed',
            `Summary is not valid JSON: ${
              err instanceof Error ? err.message : String(err)
            }`
          ),
        ],
      }
    }
  } catch (err) {
    return {
      status: 'blocked',
      failures: [
        fail(
          'summary.reachable',
          `Summary unreachable: ${
            err instanceof Error ? err.message : String(err)
          }`
        ),
      ],
    }
  }

  // ── (c) Compute SHA-256 ──────────────────────────────────────────────
  let summarySha: string
  try {
    summarySha = await sha256Hex(summaryBuf)
  } catch (err) {
    return {
      status: 'blocked',
      failures: [
        fail(
          'summary.sha256_compute',
          `Web Crypto SHA-256 failed: ${
            err instanceof Error ? err.message : String(err)
          }`
        ),
      ],
    }
  }

  // ── (d) Evaluate the 13 declared gate conditions ─────────────────────
  const failures: GateFailure[] = []

  // 1. manifest.export.status === "validated"
  const exportStatus = manifest?.export?.status
  if (exportStatus !== 'validated') {
    failures.push(
      fail(
        'manifest.export.status',
        `expected "validated", got ${JSON.stringify(exportStatus)}`
      )
    )
  }

  // 2. manifest.operator_review.required === true
  const opRequired = manifest?.operator_review?.required
  if (opRequired !== true) {
    failures.push(
      fail(
        'manifest.operator_review.required',
        `expected true, got ${JSON.stringify(opRequired)}`
      )
    )
  }

  // 3. manifest.operator_review.reviewed === true
  const opReviewed = manifest?.operator_review?.reviewed
  if (opReviewed !== true) {
    failures.push(
      fail(
        'manifest.operator_review.reviewed',
        `expected true, got ${JSON.stringify(opReviewed)}`
      )
    )
  }

  // 4. manifest.operator_review.decision === "approved"
  const opDecision = manifest?.operator_review?.decision
  if (opDecision !== 'approved') {
    failures.push(
      fail(
        'manifest.operator_review.decision',
        `expected "approved", got ${JSON.stringify(opDecision)}`
      )
    )
  }

  // 5. manifest.validation.status === "passed"
  const validationStatus = manifest?.validation?.status
  if (validationStatus !== 'passed') {
    failures.push(
      fail(
        'manifest.validation.status',
        `expected "passed", got ${JSON.stringify(validationStatus)}`
      )
    )
  }

  // 6. manifest.no_secret_scan.status === "passed"
  const scanStatus = manifest?.no_secret_scan?.status
  if (scanStatus !== 'passed') {
    failures.push(
      fail(
        'manifest.no_secret_scan.status',
        `expected "passed", got ${JSON.stringify(scanStatus)}`
      )
    )
  }

  // 7. manifest.source_counts.raw_files_exported === 0
  const rawCount = manifest?.source_counts?.raw_files_exported
  if (rawCount !== 0) {
    failures.push(
      fail(
        'manifest.source_counts.raw_files_exported',
        `expected 0, got ${JSON.stringify(rawCount)}`
      )
    )
  }

  // 8. manifest.mode === "local_private"
  if (manifest?.mode !== 'local_private') {
    failures.push(
      fail(
        'manifest.mode',
        `expected "local_private", got ${JSON.stringify(manifest?.mode)}`
      )
    )
  }

  // 9. manifest.data_boundary === "local_private_export_manifest"
  if (manifest?.data_boundary !== 'local_private_export_manifest') {
    failures.push(
      fail(
        'manifest.data_boundary',
        `expected "local_private_export_manifest", got ${JSON.stringify(
          manifest?.data_boundary
        )}`
      )
    )
  }

  // 10. manifest.export.summary_file === "workspace-summary.private.json"
  const summaryFile = manifest?.export?.summary_file
  if (summaryFile !== 'workspace-summary.private.json') {
    failures.push(
      fail(
        'manifest.export.summary_file',
        `expected "workspace-summary.private.json", got ${JSON.stringify(
          summaryFile
        )}`
      )
    )
  }

  // 11. summary.mode === "local_private"
  if (summary?.mode !== 'local_private') {
    failures.push(
      fail(
        'summary.mode',
        `expected "local_private", got ${JSON.stringify(summary?.mode)}`
      )
    )
  }

  // 12. summary.data_boundary === "local_private_summary"
  if (summary?.data_boundary !== 'local_private_summary') {
    failures.push(
      fail(
        'summary.data_boundary',
        `expected "local_private_summary", got ${JSON.stringify(
          summary?.data_boundary
        )}`
      )
    )
  }

  // 13. sha256 must match BOTH manifest.integrity.summary_file_sha256 AND
  //     manifest.files[0].sha256
  const claimedIntegrity = manifest?.integrity?.summary_file_sha256
  const claimedFileEntry = Array.isArray(manifest?.files)
    ? manifest.files[0]?.sha256
    : undefined
  const integrityMatch =
    typeof claimedIntegrity === 'string' && claimedIntegrity === summarySha
  const filesMatch =
    typeof claimedFileEntry === 'string' && claimedFileEntry === summarySha
  if (!integrityMatch || !filesMatch) {
    failures.push(
      fail(
        'sha256.match',
        `computed=${summarySha} ` +
          `integrity=${JSON.stringify(claimedIntegrity)} ` +
          `files[0]=${JSON.stringify(claimedFileEntry)}`
      )
    )
  }

  if (failures.length > 0) {
    return { status: 'blocked', failures }
  }

  return { status: 'approved', manifest, summary }
}
