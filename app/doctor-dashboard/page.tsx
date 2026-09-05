"use client"

import { useState } from "react"
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

/* ─────────────── static data ─────────────── */
const patients = [
  { id: "PT-1001", name: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   age: 28, gender: "Male",   assessment: "Personality & Stress",  status: "Completed"   },
  { id: "PT-1002", name: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  age: 34, gender: "Female", assessment: "Anxiety Assessment",    status: "In Progress" },
  { id: "PT-1003", name: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  age: 22, gender: "Male",   assessment: "Career Orientation",    status: "Completed"   },
  { id: "PT-1004", name: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",   age: 29, gender: "Female", assessment: "Depression Screening",  status: "Not Started" },
  { id: "PT-1005", name: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", age: 41, gender: "Male",   assessment: "Workplace Wellbeing",   status: "In Progress" },
]

const recentResults = [
  { name: "Amit Kumar",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",  assessment: "Personality Assessment", date: "10 May 2024" },
  { name: "Priya Singh", avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png", assessment: "Anxiety Assessment",     date: "08 May 2024" },
  { name: "Rahul Mehta", avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png", assessment: "Work Style Assessment",  date: "05 May 2024" },
  { name: "Sneha Iyer",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",  assessment: "Emotional Intelligence",  date: "02 May 2024" },
]

const tasks = [
  { icon: Users,         text: "3 patients have pending assessments",  sub: "" },
  { icon: ClipboardList, text: "Review results for Priya Singh",        sub: "Today, 11:00 AM" },
  { icon: HelpCircle,    text: "Follow up with Amit Kumar",             sub: "Tomorrow, 10:00 AM" },
  { icon: UserCircle,    text: "Assign assessment to new patient",       sub: "" },
]

const statusStyles: Record<string, string> = {
  "Completed":   "bg-green-100 text-green-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-red-100  text-red-600",
}

/* ─────────────── Donut chart (pure SVG) ─────────────── */
function DonutChart() {
  const r = 54, cx = 70, cy = 70, stroke = 14
  const circ = 2 * Math.PI * r
  const completed  = 0.81 * circ
  const inProgress = 0.19 * circ
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth={stroke}
        strokeDasharray={`${inProgress} ${circ}`} strokeDashoffset={0}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0d9488" strokeWidth={stroke}
        strokeDasharray={`${completed} ${circ - completed}`} strokeDashoffset={-inProgress}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-800" fontSize="22" fontWeight="700">64</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize="10">Assessments</text>
    </svg>
  )
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
  const [patientTab, setPatientTab] = useState<"All" | "Active" | "In Progress" | "Completed">("All")

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">Good Morning, Dr. Rajesh!</h1>
              <p className="text-gray-500 text-sm mt-1">Support better mental health with data-driven insights.</p>
            </div>
            <p className="hidden md:block text-teal-700 font-semibold text-sm italic text-right max-w-xs leading-relaxed">
              &ldquo; Understanding people<br />leads to healthier lives. &rdquo;
            </p>
          </div>

          {/* Metric Cards + Assign button */}
          <div className="flex items-center gap-4">
            {[
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-total-patients.png",   value: "128", label: "Total Patients",       change: "+12%", up: true },
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-assessments.png",      value: "64",  label: "Assessments Assigned", change: "+18%", up: true },
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-results.png",          value: "52",  label: "Results Completed",    change: "+25%", up: true },
              { icon: "/psychometrics_doctor_dashboard_assets/icons/metric-progress.png",         value: "12",  label: "In Progress",          change: "-8%",  up: false },
            ].map((m, i) => (
              <div key={i} className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 space-y-2 shadow-sm">
                <Image src={m.icon} alt={m.label} width={48} height={48} className="w-12 h-12 object-contain" />
                <p className="text-2xl font-extrabold text-gray-800">{m.value}</p>
                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                <p className={`text-xs font-semibold flex items-center gap-1 ${m.up ? "text-green-600" : "text-red-500"}`}>
                  {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {m.change} <span className="text-gray-400 font-normal">vs last month</span>
                </p>
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

          {/* Two-column layout */}
          <div className="grid grid-cols-3 gap-5">

            {/* LEFT: Patients table (2/3) */}
            <div className="col-span-2 space-y-5">

              {/* My Patients */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 text-base">My Patients</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input placeholder="Search patient..." className="h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-44" />
                    </div>
                    <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 flex gap-6 border-b border-gray-100">
                  {[
                    { label: "All", count: 128 },
                    { label: "Active", count: 96 },
                    { label: "In Progress", count: 12 },
                    { label: "Completed", count: 20 },
                  ].map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setPatientTab(t.label as any)}
                      className={`py-3 text-xs font-semibold border-b-2 transition-colors
                        ${patientTab === t.label
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-primary"}`}
                    >
                      {t.label} ({t.count})
                    </button>
                  ))}
                </div>

                {/* Table */}
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded accent-primary" /></th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Age / Gender</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Last Assessment</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patients.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3"><input type="checkbox" className="rounded accent-primary" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Image src={p.avatar} alt={p.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-medium text-gray-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.id}</td>
                        <td className="px-4 py-3 text-gray-500">{p.age} / {p.gender}</td>
                        <td className="px-4 py-3 text-gray-600">{p.assessment}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[p.status]}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={p.status === "Not Started"
                                ? `/doctor-dashboard/assessments/assign`
                                : `/doctor-dashboard/patients/${p.id}`}
                              className="text-primary font-semibold hover:underline"
                            >
                              {p.status === "Not Started" ? "Assign" : "View"}
                            </Link>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                  <p className="text-xs text-gray-400">Showing 1 to 5 of 128 patients</p>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                        ${n === 1 ? "bg-primary text-white" : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}>
                        {n}
                      </button>
                    ))}
                    <span className="text-gray-400 text-xs px-1">...</span>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors">26</button>
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-5">
                {/* Recent Assessment Results */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm">Recent Assessment Results</h3>
                    <button className="text-primary text-xs font-semibold hover:underline">View All</button>
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
                      {recentResults.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Image src={r.avatar} alt={r.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-medium text-gray-800">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-500">{r.assessment}</td>
                          <td className="px-4 py-2.5 text-gray-500">{r.date}</td>
                          <td className="px-4 py-2.5">
                            <button className="text-primary font-semibold hover:underline">View Result</button>
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
                    <button className="mt-2 px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors">
                      Compare Now
                    </button>
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
                    Last 6 Months <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <DonutChart />
                  <div className="space-y-2 text-xs">
                    {[
                      { color: "bg-teal-600",  label: "Completed",   val: "52 (81%)" },
                      { color: "bg-amber-400", label: "In Progress", val: "12 (19%)" },
                      { color: "bg-red-300",   label: "Not Started", val: "0 (0%)"   },
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

              {/* Upcoming / Pending Tasks */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Upcoming / Pending Tasks</h3>
                  <button className="text-primary text-xs font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-1">
                  {tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <t.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 leading-tight">{t.text}</p>
                        {t.sub && <p className="text-[10px] text-gray-400 mt-0.5">{t.sub}</p>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

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
                    <Link key={i} href={q.href}>
                      <button className="w-full flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-teal-50/40 transition-all text-center">
                        <Image src={q.icon} alt={q.label} width={40} height={40} className="w-10 h-10 object-contain" />
                        <span className="text-[11px] font-medium text-gray-600 leading-tight">{q.label}</span>
                      </button>
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
