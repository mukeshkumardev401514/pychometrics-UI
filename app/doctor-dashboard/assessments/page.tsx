"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus, Search, Filter, MoreVertical, ClipboardList, CheckCircle2,
  Clock, XCircle, ChevronDown,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const assessments = [
  { id: "ASS-001", patient: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   type: "Personality & Stress",   assignedOn: "01 May 2024", dueDate: "15 May 2024", status: "Completed"   },
  { id: "ASS-002", patient: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  type: "Anxiety Assessment",     assignedOn: "03 May 2024", dueDate: "17 May 2024", status: "In Progress" },
  { id: "ASS-003", patient: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  type: "Career Orientation",     assignedOn: "04 May 2024", dueDate: "18 May 2024", status: "Completed"   },
  { id: "ASS-004", patient: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",   type: "Depression Screening",   assignedOn: "06 May 2024", dueDate: "20 May 2024", status: "Not Started" },
  { id: "ASS-005", patient: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", type: "Workplace Wellbeing",     assignedOn: "07 May 2024", dueDate: "21 May 2024", status: "In Progress" },
  { id: "ASS-006", patient: "Sneha Iyer",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   type: "Emotional Intelligence", assignedOn: "02 May 2024", dueDate: "16 May 2024", status: "Completed"   },
]

const templates = [
  { name: "Personality Assessment",    questions: 60, duration: "45 min", category: "Personality"  },
  { name: "Anxiety & Stress Module",   questions: 40, duration: "30 min", category: "Mental Health" },
  { name: "Career Orientation Test",   questions: 50, duration: "40 min", category: "Career"       },
  { name: "Depression Screening",      questions: 25, duration: "20 min", category: "Mental Health" },
  { name: "Emotional Intelligence",    questions: 45, duration: "35 min", category: "Personality"  },
  { name: "Workplace Wellbeing",        questions: 35, duration: "25 min", category: "Workplace"    },
]

const statusStyles: Record<string, string> = {
  "Completed":   "bg-green-100 text-green-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-red-100 text-red-600",
}

const statusIcon: Record<string, React.ReactNode> = {
  "Completed":   <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />,
  "In Progress": <Clock        className="w-3.5 h-3.5 text-amber-500" />,
  "Not Started": <XCircle      className="w-3.5 h-3.5 text-red-400"   />,
}

type Tab = "All Assessments" | "Assign New" | "Templates"

export default function AssessmentsPage() {
  const [tab, setTab] = useState<Tab>("All Assessments")
  const [search, setSearch] = useState("")

  const filtered = assessments.filter((a) =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Assessments</h1>
              <p className="text-sm text-gray-500 mt-0.5">Assign, track and manage all patient assessments.</p>
            </div>
            <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Assign Assessment
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Assigned", value: "64",  icon: <ClipboardList className="w-5 h-5 text-primary" /> },
              { label: "Completed",      value: "52",  icon: <CheckCircle2  className="w-5 h-5 text-green-600" /> },
              { label: "In Progress",    value: "12",  icon: <Clock         className="w-5 h-5 text-amber-500" /> },
              { label: "Not Started",    value: "0",   icon: <XCircle       className="w-5 h-5 text-red-400"   /> },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                <div>
                  <p className="text-xl font-extrabold text-gray-800">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 shadow-sm w-fit">
            {(["All Assessments", "Assign New", "Templates"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                  ${tab === t ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          {tab === "All Assessments" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-sm">All Assigned Assessments</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search assessment..." className="h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-48" />
                  </div>
                  <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Assessment ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Assessment Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Assigned On</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Due Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 font-mono">{a.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Image src={a.avatar} alt={a.patient} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-medium text-gray-800">{a.patient}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.type}</td>
                      <td className="px-4 py-3 text-gray-400">{a.assignedOn}</td>
                      <td className="px-4 py-3 text-gray-400">{a.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[a.status]}`}>
                          {statusIcon[a.status]} {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-primary font-semibold hover:underline">View</button>
                          <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Assign New" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl space-y-5">
              <h2 className="font-bold text-gray-800">Assign New Assessment</h2>
              <div className="space-y-4">
                {[
                  { label: "Select Patient", type: "select", placeholder: "Choose a patient..." },
                  { label: "Assessment Type", type: "select", placeholder: "Choose assessment type..." },
                  { label: "Due Date", type: "date", placeholder: "" },
                  { label: "Notes (optional)", type: "textarea", placeholder: "Add any notes for the patient..." },
                ].map((f) => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea placeholder={f.placeholder} rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    ) : (
                      <div className="relative">
                        <input type={f.type} placeholder={f.placeholder}
                          className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        {f.type === "select" && <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                      </div>
                    )}
                  </div>
                ))}
                <button className="w-full h-10 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  Assign Assessment
                </button>
              </div>
            </div>
          )}

          {tab === "Templates" && (
            <div className="grid grid-cols-3 gap-4">
              {templates.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{t.category}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{t.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t.questions} questions · {t.duration}</p>
                  </div>
                  <button className="w-full h-8 border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
