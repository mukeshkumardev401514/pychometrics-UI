"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Users, ClipboardList, BarChart2,
  TrendingUp, TrendingDown,
  ChevronDown, ChevronRight,
  Plus, Filter, MoreVertical, ArrowLeft, ArrowRight,
  Search, HelpCircle, UserCircle,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import DoctorCollections, { type PendingTaskState } from "@/components/dashboard/doctor-collections"
import DashboardPatients from "@/components/dashboard/dashboard-patients"
import { loadAll, patientName, assignmentError, type PatientRecord, type AssignmentRecord, type CatalogRecord } from "@/lib/doctor-assignments"
import { apiClient } from "@/lib/api-client"

/* ─────────────── static data ─────────────── */
const statusStyles: Record<string, string> = {
  "Completed":   "bg-green-100 text-green-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-red-100  text-red-600",
}

/* ─────────────── Donut chart (pure SVG) ─────────────── */
function DonutChart({ counts, unavailable }: { counts: number[]; unavailable: boolean }) {
  const total = counts.reduce((sum, count) => sum + count, 0)
  const circumference = 2 * Math.PI * 54
  let offset = 0
  return <svg width="140" height="140" viewBox="0 0 140 140" aria-label="Live assessment status breakdown">
    <circle cx="70" cy="70" r="54" fill="none" stroke="#e5e7eb" strokeWidth="14" />
    {!unavailable && counts.map((count, index) => {
      const length = total ? count / total * circumference : 0
      const start = offset; offset += length
      return <circle key={index} cx="70" cy="70" r="54" fill="none" stroke={["#0d9488", "#f59e0b", "#fca5a5", "#9ca3af"][index]} strokeWidth="14" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-start} transform="rotate(-90 70 70)" />
    })}
    <text x="70" y="64" textAnchor="middle" fontSize="22" fontWeight="700">{unavailable ? "—" : total}</text>
    <text x="70" y="82" textAnchor="middle" fill="#6b7280" fontSize="10">Assessments</text>
  </svg>
}

function BarChartSvg() {
  const bars = [30, 55, 40, 70, 50, 85, 60]
  return (
    <svg width="160" height="80" viewBox="0 0 160 80">
      {bars.map((h, i) => (
        <rect key={i} x={i * 22 + 4} y={80 - h} width="16" height={h}
          rx="4" fill={i === 5 ? "#0d9488" : "#bfdbfe"} />
      ))}
    </svg>
  )
}

/* ─────────────── main component ─────────────── */
export default function DoctorDashboard() {
  const [pendingTasks, setPendingTasks] = useState<PendingTaskState>({ loading: true, error: "", assignments: [], catalog: [], patients: [] })
  const pendingRows = pendingTasks.assignments.filter(a => ["PENDING_PAYMENT", "ASSIGNED", "IN_PROGRESS"].includes(a.assignment_status))
    .sort((a, b) => Date.parse(b.assigned_at) - Date.parse(a.assigned_at) || a.id.localeCompare(b.id))
  const unpaidCount = pendingRows.filter(a => a.assignment_status === "PENDING_PAYMENT" && a.payment_required !== false && !a.payment_completed_at).length
  const unavailable = pendingTasks.loading || !!pendingTasks.error
  const completedCount = pendingTasks.assignments.filter(a => a.assignment_status === "COMPLETED").length
  const inProgressCount = pendingTasks.assignments.filter(a => a.assignment_status === "IN_PROGRESS").length
  const notStartedCount = pendingTasks.assignments.filter(a => ["PENDING_PAYMENT", "ASSIGNED"].includes(a.assignment_status)).length
  const assignedCount = completedCount + inProgressCount + notStartedCount
  const otherCount = pendingTasks.assignments.length - assignedCount
  const metricValue = (count: number) => unavailable ? "—" : String(count)
  const overviewValue = (count: number) => unavailable ? "—" : `${count} (${assignedCount ? Math.round(count / assignedCount * 100) : 0}%)`
  const [patientSearch, setPatientSearch] = useState("")
  const [recentResults, setRecentResults] = useState<{ id: string; resultId: string; name: string; avatar: string; assessment: string; date: string }[]>([])
  const [resultsLoading, setResultsLoading] = useState(true)
  const [resultsError, setResultsError] = useState("")
  useEffect(() => {
    const controller = new AbortController()
    async function loadResults() {
      try {
        const [patients, assignments, tests, results] = await Promise.all([
          loadAll<PatientRecord>("/api/external/data/patients", controller.signal),
          loadAll<AssignmentRecord>("/api/external/data/assessment-assignments", controller.signal),
          loadAll<CatalogRecord>("/api/external/assessment-catalog", controller.signal),
          loadAll<{ id: string; assignment_id: string; assessment_version_id: string; status: string; calculated_at: string | null; created_at: string }>("/api/external/data/assessment-results", controller.signal),
        ])
        if (controller.signal.aborted) return
        setRecentResults(results.filter(r => r.status === "GENERATED").sort((a, b) => Date.parse(b.calculated_at || b.created_at) - Date.parse(a.calculated_at || a.created_at)).flatMap(r => {
          const assignment = assignments.find(a => a.id === r.assignment_id)
          const patient = patients.find(p => p.id === assignment?.patient_id)
          if (!patient) return []
          const test = tests.find(t => t.assessment_version_id === r.assessment_version_id)
          return [{ id: patient.id, resultId: r.id, name: patientName(patient), avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png", assessment: test?.name || assignment!.assessment_id, date: new Date(r.calculated_at || r.created_at).toLocaleDateString() }]
        }).slice(0, 5))
      } catch (error) {
        if (!controller.signal.aborted) setResultsError(assignmentError(error))
      } finally {
        if (!controller.signal.aborted) setResultsLoading(false)
      }
    }
    void loadResults()
    return () => controller.abort()
  }, [])

  const [doctorName, setDoctorName] = useState("Doctor")

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const response = await apiClient.get<{
          first_name: string
          last_name: string
        }>("/api/external/doctors/me")

        setDoctorName(response.data.first_name)
      } catch {
        // The API interceptor handles expired sessions.
      }
    }

    void loadDoctorProfile()
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar patientSearch={patientSearch} onPatientSearch={setPatientSearch} />

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Good Morning, Dr. {doctorName}!</h1>
              <p className="text-gray-500 text-sm mt-1">Support better mental health with data-driven insights.</p>
            </div>
            <p className="hidden md:block text-teal-700 font-semibold text-sm italic text-right max-w-xs leading-relaxed">
              &ldquo; Understanding people<br />leads to healthier lives. &rdquo;
            </p>
          </div>

          {/* Metric Cards + Assign button */}
          <div className="flex items-center gap-4">
            {[
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-total-patients.png",   value: metricValue(pendingTasks.patients.length), label: "Total Patients",       change: "+12%", up: true },
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-assessments.png",      value: metricValue(assignedCount),  label: "Assessments Assigned", change: "+18%", up: true },
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-results.png",          value: metricValue(completedCount),  label: "Tests Completed",    change: "+25%", up: true },
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-progress.png",         value: metricValue(inProgressCount),  label: "In Progress",          change: "-8%",  up: false },
            ].map((m, i) => (
              <div key={i} className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-sm">
                <Image src={m.icon} alt={m.label} width={48} height={48} className="w-12 h-12 object-contain" />
                <p className="text-2xl font-extrabold text-gray-800">{m.value}</p>
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>

              </div>
            ))}
            <Link href="/doctor-dashboard/assessments/assign" className="flex-shrink-0">
              <button className="flex items-center gap-2 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Assign Assessment
                <span className="w-px h-4 bg-white/30 mx-1" />
                <ChevronDown className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {!unavailable && <p className="text-sm text-gray-600">
            Assigned {assignedCount} = Not Started {notStartedCount} + In Progress {inProgressCount} + Completed {completedCount}.
            {" "}{otherCount} cancelled/expired assignment(s) excluded. Pending tasks include not-started and in-progress tests.
          </p>}

          <DoctorCollections onPendingChange={setPendingTasks} />

          {/* Two-column layout */}
          <div className="grid grid-cols-3 gap-5">

            {/* LEFT: Patients table (2/3) */}
            <div className="col-span-2 space-y-5">

              <DashboardPatients search={patientSearch} onSearch={setPatientSearch} />

              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-5">
                {/* Recent Assessment Results */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm">Recent Assessment Results</h3>
                    <Link href="/doctor-dashboard/results-reports" className="text-primary text-xs font-semibold hover:underline">View All</Link>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Patient Name</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Assessment</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Completed On</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Result</th>
                        <th className="px-4 py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {resultsLoading && <tr><td colSpan={5} className="p-4" role="status">Loading recent results…</td></tr>}
                      {resultsError && <tr><td colSpan={5} className="p-4 text-red-600" role="alert">{resultsError}</td></tr>}
                      {!resultsLoading && !resultsError && !recentResults.length && <tr><td colSpan={5} className="p-4 text-gray-500">No assessment results available yet.</td></tr>}
                      {recentResults.map((r) => (
                        <tr key={r.resultId} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Image src={r.avatar} alt={r.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-medium text-gray-800">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-500">{r.assessment}</td>
                          <td className="px-4 py-2.5 text-gray-500">{r.date}</td>
                          <td className="px-4 py-2.5">
                            <Link href={`/doctor-dashboard/patients/${r.id}`} className="text-primary font-semibold hover:underline">View Patient</Link>
                          </td>
                          <td className="px-4 py-2.5">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Compare Patient Results */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-gray-800 text-sm">Compare Patient Results</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Compare psychometric results between patients to identify patterns and insights.
                    </p>
                    <Link href="/doctor-dashboard/compare-results">
                      <button className="mt-2 px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors">
                        Compare Now
                      </button>
                    </Link>
                  </div>
                  <div className="flex justify-end mt-4">
                    <BarChartSvg />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Panels (1/3) */}
            <div className="space-y-5">

              {/* Assessment Overview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Assessment Overview</h3>
                  <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1 hover:border-primary hover:text-primary transition-colors">
                    All time
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <DonutChart counts={[completedCount, inProgressCount, notStartedCount]} unavailable={unavailable} />
                  <div className="space-y-2 text-xs">
                    {[
                      { color: "bg-teal-600",  label: "Completed",   val: overviewValue(completedCount) },
                      { color: "bg-amber-400", label: "In Progress", val: overviewValue(inProgressCount) },
                      { color: "bg-red-300",   label: "Not Started", val: overviewValue(notStartedCount)   },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold text-gray-800 ml-auto">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm">Upcoming / Pending Tasks</h3>
                {pendingTasks.loading && <p role="status" className="text-sm text-gray-500">Loading pending tests…</p>}
                {pendingTasks.error && <p role="alert" className="text-sm text-red-600">{pendingTasks.error}</p>}
                {!pendingTasks.loading && !pendingTasks.error && <>
                  <p className="text-sm font-semibold">{pendingRows.length} pending tests · {unpaidCount} awaiting payment</p>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {pendingRows.map(row => {
                      const patient = pendingTasks.patients.find(p => p.id === row.patient_id)
                      const test = pendingTasks.catalog.find(t => t.assessment_version_id === row.assessment_version_id)
                      return <Link key={row.id} href={`/doctor-dashboard/patients/${row.patient_id}`} className="block border rounded-lg p-3 hover:bg-teal-50">
                        <p className="text-sm font-semibold">{patient ? patientName(patient) : row.patient_id}</p>
                        <p className="text-xs text-gray-600">{test?.name || row.assessment_id}</p>
                        <p className="text-xs text-gray-500 mt-1">{row.assignment_status.replaceAll("_", " ")}</p>
                        {row.expires_at && <p className="text-xs text-gray-500">Due: {new Date(row.expires_at).toLocaleDateString()}</p>}
                      </Link>
                    })}
                  </div>
                  {!pendingRows.length && <p className="text-sm text-gray-500">No pending tests.</p>}
                </>}
              </section>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "/psychometrics_doctor_dashboard_assets/icons/quick-create-patient.png",    label: "Create New Patient",  href: "/doctor-dashboard/patients/add"               },
                    { icon: "/psychometrics_doctor_dashboard_assets/icons/quick-assign-assessment.png", label: "Assign Assessment",   href: "/doctor-dashboard/assessments/assign"         },
                    { icon: "/psychometrics_doctor_dashboard_assets/icons/quick-download-reports.png",  label: "Download Reports",    href: "/doctor-dashboard/results-reports"            },
                    { icon: "/psychometrics_doctor_dashboard_assets/icons/quick-manage-templates.png",  label: "Manage Templates",    href: "/doctor-dashboard/assessments/templates"      },
                  ].map((q, i) => (
                    <Link key={i} href={q.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-teal-50/40 transition-all text-center">
                      <Image src={q.icon} alt={q.label} width={40} height={40} className="w-10 h-10 object-contain" />
                      <span className="text-[11px] font-medium text-gray-600 leading-tight">{q.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
