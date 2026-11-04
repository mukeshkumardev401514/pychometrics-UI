"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import { apiClient } from "@/lib/api-client"
import { loadAll, patientName, assignmentError, pendingCosts, formatTestCost, pendingForPatient, groupAssessments, type PatientRecord, type CatalogRecord, type AssignmentRecord } from "@/lib/doctor-assignments"

type BrowserAssessment = {
  id: string
  code: string
  name: string
  description: string | null
  status: string
  category_id: string | null
  category_name: string | null
  versions?: BrowserVersion[]
}
type BrowserVersion = {
  id: string
  version_number: number
  duration_minutes: number
  status: string
}
type BrowserAssessmentDetail = BrowserAssessment & { versions: BrowserVersion[] }
type BrowserCategory = { id: string; name: string; display_order: number }

export default function AssignNewPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [categories, setCategories] = useState<BrowserCategory[]>([])
  const [categoryId, setCategoryId] = useState("")
  const [catalog, setCatalog] = useState<CatalogRecord[]>([])
  const [assignments, setAssignments] = useState<AssignmentRecord[]>([])
  const [doctorId, setDoctorId] = useState("")
  const [patientId, setPatientId] = useState("")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [assessmentVersionId, setAssessmentVersionId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [pendingError, setPendingError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const submitting = useRef(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [platformPaymentId, setPlatformPaymentId] = useState("")

  const GST_RATE = 0.18

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const results = await Promise.allSettled([
          loadAll<PatientRecord>("/api/external/data/patients", controller.signal),
          loadAll<BrowserAssessment>("/api/external/assessment-browser/assessments", controller.signal),
          loadAll<CatalogRecord>("/api/external/assessment-catalog", controller.signal),
          loadAll<BrowserCategory>("/api/external/assessment-browser/categories", controller.signal),
          apiClient.get<{ id: string }>("/api/external/doctors/me", { signal: controller.signal }),
          loadAll<AssignmentRecord>("/api/external/data/assessment-assignments", controller.signal),
        ])
        const valueAt = <T,>(index: number): T | undefined => {
          const result = results[index]
          return result.status === "fulfilled" ? result.value as T : undefined
        }
        const patientRows = valueAt<PatientRecord[]>(0) || []
        const importedAssessments = valueAt<BrowserAssessment[]>(1) || []
        const pricingCatalog = valueAt<CatalogRecord[]>(2) || []
        const categoryRows = valueAt<BrowserCategory[]>(3) || []
        const doctor = valueAt<{ data: { id: string } }>(4)
        const assigned = valueAt<AssignmentRecord[]>(5) || []
        const publishedAssessments = importedAssessments.filter(assessment => assessment.status === "PUBLISHED")
        const detailResults = await Promise.all(publishedAssessments.map(async assessment => {
          try {
            const { data } = await apiClient.get<BrowserAssessmentDetail>(`/api/external/assessment-browser/assessments/${encodeURIComponent(assessment.id)}`, { signal: controller.signal })
            return data
          } catch {
            return null
          }
        }))
        const detailPublished = detailResults.filter((assessment): assessment is BrowserAssessmentDetail => assessment !== null)
        const publishedById = new Map(publishedAssessments.map(assessment => [assessment.id, assessment]))
        const pricedByVersion = new Map(pricingCatalog.map(test => [test.assessment_version_id, test]))
        const tests = new Map<string, CatalogRecord>()
        for (const detail of detailPublished) {
          for (const version of detail.versions.filter(version => version.status === "PUBLISHED")) {
            const priced = pricedByVersion.get(version.id)
            const listAssessment = publishedById.get(detail.id)
            tests.set(version.id, {
              ...priced,
              assessment_id: detail.id,
              assessment_version_id: version.id,
              code: detail.code || listAssessment?.code || priced?.code || "",
              name: detail.name || listAssessment?.name || priced?.name || detail.id,
              description: detail.description ?? listAssessment?.description ?? priced?.description ?? null,
              category_id: detail.category_id || listAssessment?.category_id || priced?.category_id || null,
              category_name: detail.category_name || listAssessment?.category_name || priced?.category_name || null,
              version_number: version.version_number,
              duration_minutes: version.duration_minutes,
              total_questions: priced?.total_questions ?? 0,
              price: priced?.price ?? null,
              currency: priced?.currency ?? null,
              category_order: priced?.category_order ?? null,
            })
          }
        }
        for (const test of pricingCatalog) {
          const assessment = publishedById.get(test.assessment_id)
          if (assessment?.status === "PUBLISHED" && !tests.has(test.assessment_version_id)) {
            tests.set(test.assessment_version_id, {
              ...test,
              code: assessment.code || test.code,
              name: assessment.name || test.name,
              description: assessment.description ?? test.description,
              category_id: assessment.category_id || test.category_id,
              category_name: assessment.category_name || test.category_name,
            })
          }
        }
        const testRows = [...tests.values()]
        if (controller.signal.aborted) return
        setPatients(patientRows.filter(p => p.status === "ACTIVE"))
        setCategories(categoryRows)
        setCatalog(testRows)
        if (doctor?.data?.id) setDoctorId(doctor.data.id)
        setAssignments(assigned)
        const query = new URLSearchParams(window.location.search)
        const requestedPatient = query.get("patient")
        if (patientRows.some(p => p.id === requestedPatient && p.status === "ACTIVE")) setPatientId(requestedPatient!)
        const version = query.get("version")
        const initial = testRows.find(t => t.assessment_version_id === version)
        setCategoryId(initial ? initial.category_id || "uncategorized" : "")
        setAssessmentVersionId(initial?.assessment_version_id || "")
        setSelected(testRows.some(t => t.assessment_version_id === version) ? [version!] : [])
      } catch (error) {
        if (!controller.signal.aborted) setError(assignmentError(error))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  const patient = patients.find(p => p.id === patientId)
  const pending = pendingForPatient(assignments, patientId)
  const costs = pendingCosts(pending, catalog)
  const pendingTests = new Set(pending.map(a => a.assessment_id))
  const chosen = catalog.filter(t => selected.includes(t.assessment_version_id) && !pendingTests.has(t.assessment_id))
  const groups = groupAssessments(catalog)
  const categoryOptions = [...categories.map(({ id, name }) => ({ id, name })),
    ...groups.filter(group => !categories.some(category => category.id === group.id)).map(({ id, name }) => ({ id, name }))]
  const visibleGroups = groups.filter(g => g.id === categoryId)
  const visiblePatients = patients.filter(p => p.id === patientId || `${patientName(p)} ${p.patient_code} ${p.email || ""}`.toLowerCase().includes(search.trim().toLowerCase()))

  async function refreshPending() {
    setRefreshing(true)
    setPendingError("")
    try {
      setAssignments(await loadAll<AssignmentRecord>("/api/external/data/assessment-assignments"))
    } catch (error) {
      setPendingError(`Could not refresh assignments: ${assignmentError(error)}`)
    } finally {
      setRefreshing(false)
    }
  }

  async function handleConfirmPayment() {
    if (!patient || !doctorId || !chosen.length || !dueDate || !platformPaymentId.trim()) {
      setError("Enter the existing platform payment ID before confirming payment.")
      return
    }
    const expiresAt = new Date(`${dueDate}T23:59:59`)
    if (!Number.isFinite(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      setError("Please select today or a future due date.")
      return
    }
    submitting.current = true
    setPaymentLoading(true)
    setSaving(true)
    setError("")
    setMessage("")
    let saved = 0
    try {
      const current = await loadAll<AssignmentRecord>("/api/external/data/assessment-assignments")
      const existing = new Set(pendingForPatient(current, patientId).map(a => a.assessment_id))
      for (const test of chosen) {
        if (existing.has(test.assessment_id)) continue
        const { data: assignment } = await apiClient.post<AssignmentRecord>("/api/external/data/assessment-assignments", {
          doctor_id: doctorId,
          patient_id: patientId,
          assessment_id: test.assessment_id,
          assessment_version_id: test.assessment_version_id,
          expires_at: expiresAt.toISOString(),
          notes: notes || null,
        })
        await apiClient.post(`/api/external/assessment-assignments/${encodeURIComponent(assignment.id)}/payment/confirm`, {
          payment_id: platformPaymentId.trim(),
        })
        existing.add(test.assessment_id)
        saved++
        setAssignments(rows => [assignment, ...rows.filter(row => row.id !== assignment.id)])
        setSelected(ids => ids.filter(id => id !== test.assessment_version_id))
      }
      setPaymentComplete(true)
      setMessage(saved ? `${saved} assessment${saved === 1 ? "" : "s"} assigned and payment confirmed.` : "Selected assessments are already pending for this patient.")
    } catch (confirmationError) {
      setError(`Assignment/payment confirmation failed: ${assignmentError(confirmationError)}`)
    } finally {
      await refreshPending()
      submitting.current = false
      setPaymentLoading(false)
      setSaving(false)
    }
  }

  useEffect(() => {
    setPaymentComplete(false)
    setPlatformPaymentId("")
  }, [selected, patientId])

  const chosenSubtotal = chosen.reduce((total, test) => total + (Number.isFinite(Number(test.price)) ? Number(test.price) : 0), 0)
  const chosenGst = chosenSubtotal * GST_RATE
  const chosenGrandTotal = chosenSubtotal + chosenGst
  const currency = chosen.find(test => test.currency)?.currency || "INR"

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-4 space-y-3">
          <Link href="/doctor-dashboard/assessments" className="text-primary text-sm">← All Assessments</Link>
          <div><h1 className="text-xl font-extrabold text-gray-800">Assign Assessments</h1>
            <p className="text-sm text-gray-500">Select a patient, then choose assessments.</p></div>
          {loading && <p role="status">Loading patients, categories and assignments…</p>}
          {error && <p role="alert" className="text-red-600">{error}</p>}
          {message && <p role="status" className="bg-green-50 text-green-800 rounded-xl p-4">{message}</p>}
          <fieldset disabled={loading || saving} className="space-y-3 disabled:opacity-70">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
              <div className="space-y-3">
                <section className="bg-white border rounded-xl p-4 space-y-2">
                  <h2 className="font-bold">1. Select Patient</h2>
                  <input aria-label="Search patients" placeholder="Search patient name or code…" value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-lg p-2.5" />
                  <select aria-label="Patient" value={patientId} onChange={e => { setPatientId(e.target.value); setMessage(""); setError("") }} className="w-full border rounded-lg p-2.5">
                    <option value="">Select a patient</option>
                    {visiblePatients.map(p => <option key={p.id} value={p.id}>{patientName(p)}{p.email ? ` · ${p.email}` : ""} ({p.patient_code})</option>)}
                  </select>
                </section>

                <section className="bg-white border rounded-xl p-4 space-y-3">
                  <div><h2 className="font-bold">2. Choose Tests by Category</h2><p className="text-xs text-gray-500">{chosen.length} selected</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="block text-sm font-medium">Category
                      <select aria-label="Assessment category" value={categoryId} onChange={e => { setCategoryId(e.target.value); setAssessmentVersionId("") }} className="block w-full border rounded-lg p-2.5 mt-1">
                        <option value="">Select a category</option>
                        {categoryOptions.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                    </label>
                    <label className="block text-sm font-medium">Assessment
                      <select aria-label="Assessment" value={assessmentVersionId} disabled={!categoryId} onChange={e => {
                        const nextVersionId = e.target.value
                        setAssessmentVersionId(nextVersionId)
                        if (!nextVersionId) return
                        const nextAssessmentId = catalog.find(test => test.assessment_version_id === nextVersionId)?.assessment_id
                        setSelected(ids => [...ids.filter(id => {
                          const existing = catalog.find(test => test.assessment_version_id === id)
                          return existing?.assessment_id !== nextAssessmentId
                        }), nextVersionId])
                      }} className="block w-full border rounded-lg p-2.5 mt-1 disabled:bg-gray-100">
                        <option value="">Select an assessment</option>
                        {visibleGroups.flatMap(group => group.tests.map(test => <option key={test.assessment_version_id} value={test.assessment_version_id} disabled={pendingTests.has(test.assessment_id)}>{test.code ? `${test.code} · ` : ""}{test.name} (v{test.version_number})</option>))}
                      </select>
                    </label>
                  </div>

                  {chosen.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Selected tests">{chosen.map(test => <button type="button" key={test.assessment_version_id} onClick={() => setSelected(ids => ids.filter(id => id !== test.assessment_version_id))} className="rounded-lg bg-teal-50 text-primary px-2.5 py-1.5 text-xs" aria-label={`Remove ${test.name}`}>{test.code ? `${test.code} · ` : ""}{test.name} (v{test.version_number}) ×</button>)}</div>}
                  {!categoryId && <p className="text-xs text-gray-500">Select a category to view tests.</p>}
                  {categoryId && !visibleGroups.length && <p className="text-xs text-gray-500">No published tests are available in this category.</p>}
                  {visibleGroups.map(group => <section key={group.id} className="space-y-2">
                    <h3 className="text-sm font-semibold text-primary">{group.name} ({group.tests.length})</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {group.tests.map(test => {
                        const alreadyPending = pendingTests.has(test.assessment_id)
                        const checked = selected.includes(test.assessment_version_id) && !alreadyPending
                        return <label key={test.assessment_version_id} className={`flex gap-2 p-3 border rounded-lg ${checked ? "border-primary bg-teal-50" : "border-gray-200"} ${alreadyPending ? "opacity-60" : "cursor-pointer"}`}>
                          <input type="checkbox" disabled={alreadyPending} checked={checked} onChange={e => setSelected(ids => e.target.checked
                            ? [...ids.filter(id => !catalog.some(t => t.assessment_id === test.assessment_id && t.assessment_version_id === id)), test.assessment_version_id]
                            : ids.filter(id => id !== test.assessment_version_id))} className="mt-0.5 shrink-0" />
                          <span className="min-w-0"><span className="block text-sm font-semibold truncate">{test.code && <span className="text-primary mr-1">{test.code}</span>}{test.name}</span>
                            <span className="block text-xs text-gray-500 mt-1 line-clamp-2">{test.description}</span>
                            <span className="block text-xs text-gray-500 mt-1">{test.duration_minutes} min · {formatTestCost(test.price, test.currency)}</span></span>
                        </label>
                      })}
                    </div>
                  </section>)}
                </section>
              </div>

              <aside className="bg-white border rounded-xl p-4 space-y-3 xl:sticky xl:top-4">
                <div><h2 className="font-bold">Payment Summary</h2><p className="text-xs text-gray-500">Review and pay before assignment</p></div>
                {chosen.length > 0 ? <>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                    {chosen.map(test => <div key={test.assessment_version_id} className="flex justify-between gap-2 text-xs border-b pb-2"><span className="text-gray-700">{test.code} · {test.name}</span><span className="font-semibold whitespace-nowrap">{formatTestCost(test.price, test.currency)}</span></div>)}
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{currency} {chosenSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">GST (18%)</span><span>{currency} {chosenGst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between border-t pt-2 text-base"><span className="font-bold">Grand Total</span><span className="font-bold text-primary">{currency} {chosenGrandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  </div>
                </> : <p className="text-xs text-gray-500">Select an assessment to see payment details.</p>}

                <div className="border-t pt-3 space-y-2">
                  <h3 className="font-bold">3. Schedule</h3>
                  <label className="block text-xs font-medium">Due Date<input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="block w-full border rounded-lg p-2 mt-1" /></label>
                  <label className="block text-xs font-medium">Notes<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="block w-full border rounded-lg p-2 mt-1 resize-none" /></label>
                  {!paymentComplete ? (
                    <>
                      <input type="text" value={platformPaymentId} onChange={e => setPlatformPaymentId(e.target.value)} placeholder="Platform payment ID" className="w-full rounded-lg border p-2 text-sm" />
                      <button type="button" onClick={handleConfirmPayment} disabled={!chosen.length || !dueDate || !platformPaymentId.trim() || paymentLoading} className="w-full rounded-lg bg-primary text-white px-3 py-2 text-sm font-semibold disabled:opacity-50">{paymentLoading ? "Confirming…" : "Confirm Payment & Assign"}</button>
                    </>
                  ) : <div className="rounded-lg bg-green-50 text-green-800 border border-green-200 px-3 py-2 text-xs font-semibold">Payment confirmed and assessments assigned</div>}
                </div>
              </aside>
            </div>
          </fieldset>
          {patient && <section className="bg-white border rounded-xl p-5 space-y-3">
            <div className="flex justify-between gap-3"><h2 className="font-bold">Pending Assignments — {patientName(patient)} ({pending.length})</h2>
              <button onClick={refreshPending} disabled={saving || refreshing} className="text-primary disabled:opacity-50">{refreshing ? "Refreshing…" : "Refresh"}</button></div>
            <p className="text-sm text-gray-500">Includes pending payment, assigned and in-progress tests.</p>
            {pendingError && <p role="alert" className="text-red-600">{pendingError}</p>}
            <div className="overflow-x-auto"><table className="w-full text-sm text-left">
              <thead><tr>{["Test", "Category", "Cost", "Status", "Assigned", "Due Date"].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
              <tbody>{pending.map(row => {
                const test = catalog.find(t => t.assessment_version_id === row.assessment_version_id)
                return <tr key={row.id} className="border-t"><td className="p-3">{test ? `${test.name} (v${test.version_number})` : row.assessment_id}</td>
                  <td className="p-3">{test?.category_name || "Uncategorized"}</td><td className="p-3">{formatTestCost(test?.price, test?.currency)}</td><td className="p-3">{row.assignment_status.replaceAll("_", " ")}</td>
                  <td className="p-3">{new Date(row.assigned_at).toLocaleDateString()}</td><td className="p-3">{row.expires_at ? new Date(row.expires_at).toLocaleDateString() : "—"}</td></tr>
              })}</tbody>
            </table></div>
            {pending.length > 0 && <div className="border-t pt-4 space-y-1">
              <p className="font-semibold">Total tests: {pending.length}</p>
              <p className="font-semibold">{costs.missing ? "Subtotal (priced tests)" : "Total cost"}: {costs.totals.length ? costs.totals.map(total => formatTestCost(total.amount, total.currency)).join(" + ") : "Price unavailable"}</p>
              {costs.missing > 0 && <p className="text-amber-700 text-sm">Price unavailable for {costs.missing} test(s); these are excluded from the subtotal.</p>}
              <p className="text-xs text-gray-500">Current test prices. This is the cost of pending tests, not an outstanding payment balance.</p>
            </div>}
            {!pending.length && !pendingError && <p className="text-gray-500">No pending assignments for this patient.</p>}
          </section>}
        </main>
      </div>
    </div>
  )
}
