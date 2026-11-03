"use client"
import { useEffect, useState } from "react"
import { loadAll, assignmentError, assignmentSummary, formatTestCost, type AssignmentRecord, type CatalogRecord, type PatientRecord } from "@/lib/doctor-assignments"
import { summarizeCollections, type PaymentHistory } from "@/lib/doctor-collections"
const show = (amounts: { currency: string; amount: number }[]) => amounts.length ? amounts.map(a => formatTestCost(a.amount, a.currency)).join(" + ") : "0.00"
export type PendingTaskState = { loading: boolean; error: string; assignments: AssignmentRecord[]; catalog: CatalogRecord[]; patients: PatientRecord[] }
export default function DoctorCollections({ onPendingChange }: { onPendingChange?: (state: PendingTaskState) => void } = {}) {
  const [data, setData] = useState<{ collected: ReturnType<typeof summarizeCollections>; pending: ReturnType<typeof assignmentSummary> } | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError("")
    onPendingChange?.({ loading: true, error: "", assignments: [], catalog: [], patients: [] })
    async function load() {
      try {
        const [history, assignments, catalog, patients] = await Promise.all([
          loadAll<PaymentHistory>("/api/doctor/payment-history", controller.signal),
          loadAll<AssignmentRecord>("/api/external/data/assessment-assignments", controller.signal),
          loadAll<CatalogRecord>("/api/external/assessment-catalog", controller.signal),
          loadAll<PatientRecord>("/api/external/data/patients", controller.signal),
        ])
        if (!controller.signal.aborted) {
          setData({ collected: summarizeCollections(history), pending: assignmentSummary(assignments, catalog) })
          onPendingChange?.({ loading: false, error: "", assignments, catalog, patients })
        }
      } catch (error) { if (!controller.signal.aborted) {
        setError(assignmentError(error))
        onPendingChange?.({ loading: false, error: assignmentError(error), assignments: [], catalog: [], patients: [] })
      } }
      finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [reload, onPendingChange])
  return <section className="bg-white border rounded-2xl p-5 space-y-4">
    <div className="flex justify-between"><h2 className="font-bold text-lg">Revenue Collection</h2><button onClick={() => setReload(n => n + 1)} disabled={loading} className="text-primary disabled:opacity-50">Refresh</button></div>
    {loading && <p role="status">Loading collections…</p>}
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {!loading && !error && data && <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-teal-50 rounded-xl p-4"><p className="text-sm">Total Collection (all time)</p><p className="text-2xl font-bold mt-2">{data.collected.missing && !data.collected.totals.length ? "Unavailable" : show(data.collected.totals)}</p></div>
        <div className="bg-blue-50 rounded-xl p-4"><p className="text-sm">Yesterday’s Collection{data.collected.yesterdayMissing ? " (subtotal)" : ""}</p><p className="text-2xl font-bold mt-2">{data.collected.yesterdayMissing && !data.collected.yesterday.length ? "Unavailable" : show(data.collected.yesterday)}</p><p className="text-sm mt-1">{new Date(`${data.collected.yesterdayDate}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })} · IST</p></div>
        <div className="bg-amber-50 rounded-xl p-4"><p className="text-sm">Pending Expected Collection{data.pending.missing ? " (subtotal)" : ""}</p><p className="text-2xl font-bold mt-2">{data.pending.missing && !data.pending.totals.length ? "Price unavailable" : show(data.pending.totals)}</p><p className="text-sm mt-1">{data.pending.unpaidCount} tests awaiting payment</p></div>
      </div>
      {data.collected.missing > 0 && <p className="text-amber-700 text-sm">{data.collected.missing} successful payment(s) have incomplete amounts or dates; collection totals are partial.</p>}
      {data.pending.missing > 0 && <p className="text-amber-700 text-sm">Prices unavailable for {data.pending.missing} unpaid test(s); excluded from expected collection.</p>}
      <h3 className="font-semibold">Monthwise Collection</h3>
      <table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr><th className="p-3">Month</th><th className="p-3 text-right">Collected Amount</th></tr></thead>
        <tbody>{data.collected.months.map(row => <tr key={row.month} className="border-t"><td className="p-3">{new Date(`${row.month}-01T00:00:00Z`).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</td><td className="p-3 text-right font-semibold">{show(row.amounts)}</td></tr>)}</tbody>
      </table>
      {!data.collected.months.length && <p className="text-sm text-gray-500">No recorded collections available.</p>}
      <p className="text-xs text-gray-500">Gross successful payments recorded for your assignments, before refunds and revenue sharing. Months use India time. Expected collection uses current prices of unpaid tests.</p>
    </>}
  </section>
}
