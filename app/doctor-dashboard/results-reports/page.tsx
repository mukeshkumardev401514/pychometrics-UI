"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, Download, MoreVertical, TrendingUp, BarChart2, FileText } from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const results = [
  { patient: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   assessment: "Personality Assessment",  date: "10 May 2024", score: 78, risk: "Low",    trend: "up"   },
  { patient: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  assessment: "Anxiety Assessment",       date: "08 May 2024", score: 62, risk: "Moderate", trend: "down" },
  { patient: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  assessment: "Career Orientation",        date: "05 May 2024", score: 85, risk: "Low",    trend: "up"   },
  { patient: "Sneha Iyer",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   assessment: "Emotional Intelligence",   date: "02 May 2024", score: 71, risk: "Low",    trend: "up"   },
  { patient: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", assessment: "Workplace Wellbeing",       date: "01 May 2024", score: 54, risk: "High",   trend: "down" },
]

const riskStyles: Record<string, string> = {
  "Low":      "bg-green-100 text-green-700",
  "Moderate": "bg-amber-100 text-amber-700",
  "High":     "bg-red-100 text-red-600",
}

function MiniBarChart({ score }: { score: number }) {
  const bars = [score * 0.6, score * 0.8, score * 0.7, score * 0.9, score]
  const max = 100
  return (
    <svg width="80" height="32" viewBox="0 0 80 32">
      {bars.map((h, i) => (
        <rect key={i} x={i * 16 + 2} y={32 - (h / max) * 28} width="12" height={(h / max) * 28}
          rx="3" fill={i === 4 ? "#0d9488" : "#bfdbfe"} />
      ))}
    </svg>
  )
}

export default function ResultsReportsPage() {
  const [search, setSearch] = useState("")
  const filtered = results.filter((r) =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.assessment.toLowerCase().includes(search.toLowerCase())
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
              <h1 className="text-xl font-extrabold text-gray-800">Results & Reports</h1>
              <p className="text-sm text-gray-500 mt-0.5">Review completed assessment results and download reports.</p>
            </div>
            <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Export All
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <FileText  className="w-5 h-5 text-primary"      />, label: "Total Reports",  value: "52" },
              { icon: <TrendingUp className="w-5 h-5 text-green-600"   />, label: "Avg. Score",     value: "70%" },
              { icon: <BarChart2  className="w-5 h-5 text-amber-500"   />, label: "High Risk Cases", value: "5"  },
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

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-sm">Assessment Results</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search results..." className="h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-48" />
                </div>
                <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
              </div>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Assessment</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Completed On</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Score</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Trend</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Risk Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Image src={r.avatar} alt={r.patient} width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-medium text-gray-800">{r.patient}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.assessment}</td>
                    <td className="px-4 py-3 text-gray-400">{r.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${r.score}%` }} />
                        </div>
                        <span className="font-semibold text-gray-700">{r.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><MiniBarChart score={r.score} /></td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${riskStyles[r.risk]}`}>
                        {r.risk} Risk
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-primary font-semibold hover:underline">View</button>
                        <button className="text-gray-400 hover:text-gray-500"><Download className="w-3.5 h-3.5" /></button>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
