import { isAxiosError } from "axios"
import { apiClient } from "@/lib/api-client"

export interface PatientRecord {
  id: string; user_id?: string; patient_code: string; first_name: string | null; last_name: string | null; email?: string | null
  status: string; gender: string | null; date_of_birth: string | null
}
export interface CatalogRecord {
  code?: string
  price: string | null; currency: string | null
  category_id: string | null; category_name: string | null; category_order: number | null
  assessment_id: string; assessment_version_id: string; name: string
  description: string | null; version_number: number; duration_minutes: number; total_questions: number
}
export interface AssignmentRecord {
  payment_required?: boolean; payment_completed_at?: string | null
  id: string; patient_id: string; assessment_id: string; assessment_version_id: string
  assigned_at: string; expires_at: string | null; assignment_status: string
}
export async function loadAll<T>(path: string, signal?: AbortSignal): Promise<T[]> {
  const rows: T[] = []
  for (let offset = 0; ; offset += 100) {
    const { data } = await apiClient.get<{ items: T[] }>(`${path}?limit=100&offset=${offset}`, { signal })
    rows.push(...data.items)
    if (data.items.length < 100) return rows
  }
}
export function patientName(patient: PatientRecord) {
  return [patient.first_name, patient.last_name].filter(Boolean).join(" ") || patient.patient_code
}
export function assignmentError(error: unknown) {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) return detail.map((item) => item.msg).join("; ")
  }
  return error instanceof Error ? error.message : "Unable to load or save the assignment."
}

export function pendingForPatient(rows: AssignmentRecord[], patientId: string) {
  return rows.filter(row => row.patient_id === patientId &&
    ["PENDING_PAYMENT", "ASSIGNED", "IN_PROGRESS"].includes(row.assignment_status))
    .sort((a, b) => Date.parse(b.assigned_at) - Date.parse(a.assigned_at) || a.id.localeCompare(b.id))
}
export function groupAssessments(rows: CatalogRecord[]) {
  const groups = new Map<string, { id: string; name: string; order: number; tests: CatalogRecord[] }>()
  for (const test of rows) {
    const id = test.category_id || "uncategorized"
    const group = groups.get(id) || { id, name: test.category_name || "Uncategorized", order: test.category_order ?? Number.MAX_SAFE_INTEGER, tests: [] }
    group.tests.push(test)
    groups.set(id, group)
  }
  return [...groups.values()].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
}

export function pendingCosts(rows: AssignmentRecord[], catalog: CatalogRecord[]) {
  const totals = new Map<string, number>()
  let missing = 0
  for (const row of rows) {
    const test = catalog.find(t => t.assessment_version_id === row.assessment_version_id)
    if (test?.price == null || !test.currency) { missing++; continue }
    const cents = Math.round(Number(test.price) * 100)
    if (!Number.isSafeInteger(cents) || cents < 0) { missing++; continue }
    totals.set(test.currency, (totals.get(test.currency) || 0) + cents)
  }
  return { totals: [...totals].map(([currency, cents]) => ({ currency, amount: cents / 100 })), missing }
}
export function formatTestCost(price: string | number | null | undefined, currency: string | null | undefined) {
  if (price == null || !currency || !Number.isFinite(Number(price))) return "Price unavailable"
  return `${currency} ${Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function assignmentSummary(rows: AssignmentRecord[], catalog: CatalogRecord[]) {
  const pending = rows.filter(row => ["PENDING_PAYMENT", "ASSIGNED", "IN_PROGRESS"].includes(row.assignment_status))
  const unpaid = pending.filter(row => row.assignment_status === "PENDING_PAYMENT" && row.payment_required !== false && !row.payment_completed_at)
  return { pendingCount: pending.length, unpaidCount: unpaid.length, ...pendingCosts(unpaid, catalog) }
}
