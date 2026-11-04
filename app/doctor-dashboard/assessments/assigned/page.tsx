"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import { assignmentError, assignmentSummary, formatTestCost, loadAll, patientName, type AssignmentRecord, type CatalogRecord, type PatientRecord } from "@/lib/doctor-assignments"

type AssignmentRow = AssignmentRecord & { patient: string; assessment: string }

export default function AssignedAssessmentsPage() {
  const [rows, setRows] = useState<AssignmentRow[]>([])
  const [catalog, setCatalog] = useState<CatalogRecord[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const [assignments, patients, tests] = await Promise.all([
          loadAll<AssignmentRecord>("/api/external/data/assessment-assignments", controller.signal),
          loadAll<PatientRecord>("/api/external/data/patients", controller.signal),
          loadAll<CatalogRecord>("/api/external/assessment-catalog", controller.signal),
        ])
        if (controller.signal.aborted) return
        setCatalog(tests)
        const patientNames = new Map(patients.map(patient => [patient.id, patientName(patient)]))
        const assessmentNames = new Map(tests.map(test => [test.assessment_version_id, `${test.name} (v${test.version_number})`]))
        setRows(assignments.map(assignment => ({
          ...assignment,
          patient: patientNames.get(assignment.patient_id) || assignment.patient_id,
          assessment: assessmentNames.get(assignment.assessment_version_id) || assignment.assessment_id,
        })).sort((first, second) => Date.parse(second.assigned_at) - Date.parse(first.assigned_at) || first.id.localeCompare(second.id)))
      } catch (loadError) {
        if (!controller.signal.aborted) setError(assignmentError(loadError))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  const filtered = rows.filter(row => `${row.patient} ${row.assessment} ${row.assignment_status}`.toLowerCase().includes(search.trim().toLowerCase()))
  const summary = assignmentSummary(filtered, catalog)

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div><h1 className="text-xl font-extrabold text-gray-800">Assigned Assessments</h1>
              <p className="text-sm text-gray-500">Track assessments assigned to your patients.</p></div>
            <Link href="/doctor-dashboard/assessments/assign" className="bg-primary text-white px-5 py-3 rounded-xl font-semibold">Assign Assessment</Link>
          </div>
          <input aria-label="Search assigned assessments" value={search} onChange={event => setSearch(event.target.value)}
            placeholder="Search patient, assessment or status…" className="w-full max-w-md border rounded-xl p-3" />
          {loading && <p role="status">Loading assigned assessments…</p>}
          {error && <p role="alert" className="text-red-600">{error}</p>}
          {!loading && !error && <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50"><tr>{["Patient", "Assessment", "Assigned", "Due Date", "Status"].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead>
              <tbody>{filtered.map(row => <tr key={row.id} className="border-t">
                <td className="p-4">{row.patient}</td><td className="p-4">{row.assessment}</td>
                <td className="p-4">{new Date(row.assigned_at).toLocaleDateString()}</td>
                <td className="p-4">{row.expires_at ? new Date(row.expires_at).toLocaleDateString() : "—"}</td>
                <td className="p-4">{row.assignment_status.replaceAll("_", " ")}</td>
              </tr>)}</tbody>
            </table>
            {filtered.length === 0 && <p className="p-6 text-gray-500">{rows.length ? "No assignments match your search." : "No assessments have been assigned to your patients yet."}</p>}
            <footer className="border-t bg-gray-50 p-5 space-y-2" aria-label="Pending assignment totals">
              <div className="flex flex-wrap justify-between gap-4 font-semibold text-gray-800">
                <p>Total pending tests: {summary.pendingCount}</p>
                <p>{summary.missing ? "Expected pending payment subtotal" : "Total expected pending payment"}: {summary.unpaidCount === 0 ? "0.00" : summary.totals.length ? summary.totals.map(total => formatTestCost(total.amount, total.currency)).join(" + ") : "Price unavailable"}</p>
              </div>
              <p className="text-sm text-gray-500">{summary.unpaidCount} test(s) awaiting payment. Expected amount uses current prices.</p>
              {summary.missing > 0 && <p className="text-sm text-amber-700">Price unavailable for {summary.missing} unpaid test(s); excluded from the subtotal.</p>}
              {search.trim() && <p className="text-xs text-gray-500">Totals apply to the current search results.</p>}
            </footer>
          </div>}
        </main>
      </div>
    </div>
  )
}