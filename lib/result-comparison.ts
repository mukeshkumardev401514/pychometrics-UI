import type { AssignmentRecord } from "@/lib/doctor-assignments"
export interface ComparisonResult { id: string; assignment_id: string; attempt_id: string; assessment_id: string; assessment_version_id: string; total_score: string | number | null; status?: string; report_status?: string; calculated_at: string | null; created_at: string }
export interface ResultAttempt { id: string; completed_at: string | null }
export interface ResultDimension { result_id: string; dimension_code: string; dimension_name: string; raw_score: string | number | null; normalized_score: string | number | null; percentile: string | number | null }
export function patientResults(results: ComparisonResult[], assignments: AssignmentRecord[], patientId: string) {
  const owned = new Set(assignments.filter(a => a.patient_id === patientId).map(a => a.id))
  return results.filter(r => owned.has(r.assignment_id) && (!!r.calculated_at || (r.status ?? r.report_status) === "GENERATED"))
}
export function score(value: string | number | null | undefined) {
  return value == null || !Number.isFinite(Number(value)) ? "—" : Number(value).toLocaleString("en-IN", { maximumFractionDigits: 4 })
}
export function difference(before: string | number | null | undefined, after: string | number | null | undefined) {
  if (before == null || after == null || !Number.isFinite(Number(before)) || !Number.isFinite(Number(after))) return "—"
  const change = Number(after) - Number(before)
  return `${change > 0 ? "+" : ""}${score(change)}`
}
