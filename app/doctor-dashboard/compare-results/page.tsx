"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, X, BarChart2, TrendingUp, TrendingDown } from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const patients = [
  { id: "PT-1001", name: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   scores: { personality: 78, anxiety: 35, career: 82, emotional: 74, workplace: 68 } },
  { id: "PT-1002", name: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  scores: { personality: 65, anxiety: 62, career: 70, emotional: 58, workplace: 72 } },
  { id: "PT-1003", name: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  scores: { personality: 85, anxiety: 28, career: 90, emotional: 80, workplace: 76 } },
  { id: "PT-1004", name: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",   scores: { personality: 55, anxiety: 70, career: 60, emotional: 50, workplace: 58 } },
  { id: "PT-1005", name: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", scores: { personality: 70, anxiety: 55, career: 65, emotional: 62, workplace: 54 } },
]

type ScoreKey = keyof typeof patients[0]["scores"]
const dimensions: { key: ScoreKey; label: string }[] = [
  { key: "personality", label: "Personality"   },
  { key: "anxiety",     label: "Anxiety"       },
  { key: "career",      label: "Career"        },
  { key: "emotional",   label: "Emotional IQ"  },
  { key: "workplace",   label: "Workplace"     },
]

const COLORS = ["#0d9488", "#3b82f6", "#f59e0b", "#8b5cf6"]

function CompareBar({ val, color }: { val: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${val}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{val}%</span>
    </div>
  )
}

export default function CompareResultsPage() {
  const [selected, setSelected] = useState<string[]>(["PT-1001", "PT-1002"])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const selectedPatients = patients.filter((p) => selected.includes(p.id))

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div>
            <h1 className="text-xl font-extrabold text-gray-800">Compare Results</h1>
            <p className="text-sm text-gray-500 mt-0.5">Select up to 4 patients to compare their psychometric scores side-by-side.</p>
          </div>

          {/* Patient selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-800 text-sm mb-4">Select Patients to Compare</h2>
            <div className="flex flex-wrap gap-3">
              {patients.map((p) => {
                const isSelected = selected.includes(p.id)
                const colorIdx = selected.indexOf(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all
                      ${isSelected ? "border-primary bg-teal-50 text-primary" : "border-gray-200 text-gray-600 hover:border-primary/40"}`}
                  >
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[colorIdx] }} />
                    )}
                    <Image src={p.avatar} alt={p.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                    {p.name}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </button>
                )
              })}
              {selected.length < 4 && (
                <div className="flex items-center gap-1 px-3 py-2 text-xs text-gray-400">
                  <Plus className="w-3.5 h-3.5" /> Add up to {4 - selected.length} more
                </div>
              )}
            </div>
          </div>

          {/* Comparison chart */}
          {selectedPatients.length >= 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-gray-800 text-sm">Score Comparison</h2>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4">
                {selectedPatients.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs font-medium text-gray-600">{p.name}</span>
                  </div>
                ))}
              </div>

              {/* Dimension rows */}
              <div className="space-y-5">
                {dimensions.map((dim) => (
                  <div key={dim.key} className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700">{dim.label}</p>
                    <div className="space-y-1.5">
                      {selectedPatients.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <span className="text-[11px] text-gray-500 w-24 truncate">{p.name}</span>
                          <div className="flex-1">
                            <CompareBar val={p.scores[dim.key]} color={COLORS[i]} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary table */}
          {selectedPatients.length >= 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-sm">Summary Table</h2>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Dimension</th>
                    {selectedPatients.map((p, i) => (
                      <th key={p.id} className="px-4 py-3 text-left font-semibold" style={{ color: COLORS[i] }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dimensions.map((dim) => (
                    <tr key={dim.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{dim.label}</td>
                      {selectedPatients.map((p, i) => {
                        const val = p.scores[dim.key]
                        const isHighest = val === Math.max(...selectedPatients.map((q) => q.scores[dim.key]))
                        return (
                          <td key={p.id} className="px-4 py-3">
                            <span className={`font-semibold ${isHighest ? "text-primary" : "text-gray-600"}`}>{val}%</span>
                            {isHighest && <TrendingUp className="inline w-3 h-3 ml-1 text-primary" />}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
