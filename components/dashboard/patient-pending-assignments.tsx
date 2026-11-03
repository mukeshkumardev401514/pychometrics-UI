"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { loadAll, pendingForPatient, pendingCosts, formatTestCost, assignmentError, type AssignmentRecord, type CatalogRecord } from "@/lib/doctor-assignments"

export default function PatientPendingAssignments({ patientId }: { patientId: string }) {
  const [rows, setRows] = useState<AssignmentRecord[]>([])
  const [catalog, setCatalog] = useState<CatalogRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reload, setReload] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError("")
    setRows([])
    async function load() {
      try {
        const [assignments, tests] = await Promise.all([
          loadAll<AssignmentRecord>("/api/external/data/assessment-assignments", controller.signal),
          loadAll<CatalogRecord>("/api/external/assessment-catalog", controller.signal),
        ])
        if (controller.signal.aborted) return
        setRows(pendingForPatient(assignments, patientId))
        setCatalog(tests)
      } catch (error) {
        if (!controller.signal.aborted) setError(assignmentError(error))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [patientId, reload])
  const costs = pendingCosts(rows, catalog)
  return <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-bold text-gray-800">Pending Assignments{!loading && !error ? ` (${rows.length})` : ""}</h2>
      <div className="flex gap-4 text-sm text-primary">
        <button disabled={loading} onClick={() => setReload(n => n + 1)} className="disabled:opacity-50">Refresh</button>
        <Link href={`/doctor-dashboard/assessments/assign?patient=${encodeURIComponent(patientId)}`}>Assign New</Link>
      </div>
    </div>
    <p className="text-sm text-gray-500">Pending payment, assigned and in-progress tests for this patient.</p>
    {loading && <p role="status">Loading pending assignments…</p>}
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {!loading && !error && <>
      {rows.length === 0 ? <p className="text-gray-500">No pending assignments for this patient.</p> : <>
        <div className="overflow-x-auto"><table className="w-full text-sm text-left">
          <thead><tr>{["Test", "Category", "Status", "Assigned", "Due Date", "Cost"].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead>
          <tbody>{rows.map(row => {
            const test = catalog.find(t => t.assessment_version_id === row.assessment_version_id)
            return <tr key={row.id} className="border-t">
              <td className="p-3">{test ? `${test.name} (v${test.version_number})` : row.assessment_id}</td>
              <td className="p-3">{test?.category_name || "—"}</td>
              <td className="p-3">{row.assignment_status.replaceAll("_", " ")}</td>
              <td className="p-3">{new Date(row.assigned_at).toLocaleDateString()}</td>
              <td className="p-3">{row.expires_at ? new Date(row.expires_at).toLocaleDateString() : "—"}</td>
              <td className="p-3">{formatTestCost(test?.price, test?.currency)}</td>
            </tr>
          })}</tbody>
        </table></div>
        <div className="border-t pt-3 font-semibold">
          <p>Total tests: {rows.length}</p>
          <p>{costs.missing ? "Subtotal (priced tests)" : "Total cost"}: {costs.totals.length ? costs.totals.map(t => formatTestCost(t.amount, t.currency)).join(" + ") : "Price unavailable"}</p>
        </div>
        {costs.missing > 0 && <p className="text-sm text-amber-700">Price unavailable for {costs.missing} test(s); excluded from subtotal.</p>}
        <p className="text-xs text-gray-500">Current test prices; this total is not an outstanding payment balance.</p>
      </>}
    </>}
  </section>
}
