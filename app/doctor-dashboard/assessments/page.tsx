"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import { assignmentError, loadAll } from "@/lib/doctor-assignments"

type ImportedAssessment = {
  id: string
  code: string
  name: string
  description: string | null
  status: string
  category_id: string | null
  category_name: string | null
  subcategory_id: string | null
  subcategory_name: string | null
}

export default function AssessmentsPage() {
  const [importedAssessments, setImportedAssessments] = useState<ImportedAssessment[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const importedAssessments = await loadAll<ImportedAssessment>("/api/external/assessment-browser/assessments", controller.signal)
        if (controller.signal.aborted) return
        setImportedAssessments(importedAssessments)
      } catch (error) {
        if (!controller.signal.aborted) setError(assignmentError(error))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])
  const categories = [...new Map(importedAssessments
    .filter(assessment => assessment.category_id && assessment.category_name)
    .map(assessment => [assessment.category_id!, assessment.category_name!])).entries()]
  const statuses = [...new Set(importedAssessments.map(assessment => assessment.status))].sort()
  const filtered = importedAssessments.filter(assessment => {
    const matchesSearch = `${assessment.name} ${assessment.code} ${assessment.description || ""} ${assessment.category_name || ""} ${assessment.subcategory_name || ""}`.toLowerCase().includes(search.trim().toLowerCase())
    return matchesSearch && (category === "all" || assessment.category_id === category) && (status === "all" || assessment.status === status)
  })
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div><h1 className="text-xl font-extrabold text-gray-800">All Assessments</h1>
              <p className="text-sm text-gray-500">Browse assessments imported into the assessment library.</p></div>
            <Link href="/doctor-dashboard/assessments/assign" className="bg-primary text-white px-5 py-3 rounded-xl font-semibold">Assign Assessment</Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <input aria-label="Search assessments" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, code or description…" className="w-full max-w-md border rounded-xl p-3" />
            <select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)} className="border rounded-xl px-3 py-2">
              <option value="all">All categories</option>
              {categories.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select>
            <select aria-label="Filter by status" value={status} onChange={e => setStatus(e.target.value)} className="border rounded-xl px-3 py-2">
              <option value="all">All statuses</option>
              {statuses.map(value => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}
            </select>
          </div>
          {loading && <p role="status">Loading assessments…</p>}
          {error && <p role="alert" className="text-red-600">{error}</p>}
          {!loading && !error && <div className="space-y-3">
            <p className="text-sm text-gray-500">Showing {filtered.length} of {importedAssessments.length} assessments</p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtered.map(assessment => <article key={assessment.id} className="bg-white border rounded-xl p-5 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">{assessment.code}</p>
                    <h2 className="font-bold text-gray-800">{assessment.name}</h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{assessment.status.replaceAll("_", " ")}</span>
                </div>
                <p className="text-xs text-gray-500">{assessment.category_name || "Uncategorized"}{assessment.subcategory_name ? ` / ${assessment.subcategory_name}` : ""}</p>
                {assessment.description && <p className="text-sm text-gray-600">{assessment.description}</p>}
              </article>)}
            </div>
            {filtered.length === 0 && <p className="bg-white border rounded-xl p-6 text-gray-500">{importedAssessments.length ? "No assessments match these filters." : "No assessments are available in the assessment browser."}</p>}
          </div>}
        </main>
      </div>
    </div>
  )
}
