"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { loadAll, patientName, assignmentError, type PatientRecord } from "@/lib/doctor-assignments"
type Patient = PatientRecord & { created_at: string; email: string | null; mobile: string | null }
export default function DashboardPatients({ search, onSearch }: { search: string; onSearch: (value: string) => void }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reload, setReload] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError("")
    loadAll<Patient>("/api/external/data/patients", controller.signal).then(rows => {
      if (!controller.signal.aborted) setPatients(rows.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || a.id.localeCompare(b.id)))
    }).catch(error => { if (!controller.signal.aborted) setError(assignmentError(error)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload])
  const query = search.trim().toLowerCase()
  const filtered = patients.filter(p => `${patientName(p)} ${p.patient_code} ${p.id} ${p.email || ""} ${p.mobile || ""}`.toLowerCase().includes(query))
  return <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-5 space-y-3">
      <div className="flex justify-between"><h2 className="font-bold text-gray-800">My Patients</h2><button onClick={() => setReload(n => n + 1)} disabled={loading} className="text-primary text-sm disabled:opacity-50">Refresh</button></div>
      <input aria-label="Search all patients" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search name, patient code, email or mobile…" className="w-full p-3 border rounded-lg text-sm" />
      <p className="text-xs text-gray-500">Newest patients first</p>
      {loading && <p role="status">Loading all patients…</p>}
      {error && <p role="alert" className="text-red-600">{error}</p>}
    </div>
    {!loading && !error && <>
      <div className="max-h-[600px] overflow-auto"><table className="w-full text-sm text-left">
        <thead className="bg-gray-50 sticky top-0"><tr>{["Patient", "Patient Code", "Contact", "Created", "Status", "Action"].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{filtered.map(p => <tr key={p.id} className="border-t">
          <td className="p-3 font-medium">{patientName(p)}</td><td className="p-3">{p.patient_code}</td>
          <td className="p-3"><div>{p.email || "—"}</div><div>{p.mobile || "—"}</div></td>
          <td className="p-3 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td><td className="p-3">{p.status}</td>
          <td className="p-3"><Link className="text-primary" href={`/doctor-dashboard/patients/${p.id}`}>View</Link></td>
        </tr>)}</tbody>
      </table></div>
      {!filtered.length && <p className="p-5 text-gray-500">{patients.length ? "No patients match your search." : "No patients linked to your account."}</p>}
      <p className="p-4 text-xs text-gray-500">Showing {filtered.length} of {patients.length} patients</p>
    </>}
  </section>
}
