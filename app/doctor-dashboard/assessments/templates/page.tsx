"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Search, ClipboardList, Clock, BookOpen,
  Plus, Eye, Edit2, Copy, Trash2, Filter, CheckCircle2,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

/* ─── data ─── */
const allTemplates = [
  {
    id: "TPL-001",
    name: "Personality & Stress Assessment",
    category: "Personality",
    questions: 60,
    duration: "45 min",
    usedCount: 128,
    lastUsed: "10 May 2024",
    difficulty: "Moderate",
    description: "Comprehensive assessment measuring the Big Five personality traits alongside perceived stress levels. Validated against established psychometric scales.",
    sections: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism", "Perceived Stress"],
  },
  {
    id: "TPL-002",
    name: "Anxiety Assessment (GAD-7)",
    category: "Mental Health",
    questions: 40,
    duration: "30 min",
    usedCount: 95,
    lastUsed: "08 May 2024",
    difficulty: "Standard",
    description: "Based on the GAD-7 (Generalized Anxiety Disorder 7-item scale). Screens for and measures severity of generalized anxiety disorder.",
    sections: ["Anxiety Frequency", "Impact on Daily Life", "Physical Symptoms", "Coping Mechanisms"],
  },
  {
    id: "TPL-003",
    name: "Career Orientation Test",
    category: "Career",
    questions: 50,
    duration: "40 min",
    usedCount: 64,
    lastUsed: "05 May 2024",
    difficulty: "Standard",
    description: "Identifies vocational strengths, aptitudes and career preferences using Holland's RIASEC model combined with skill-strength indicators.",
    sections: ["Aptitude Mapping", "Interest Areas", "Work Style", "Environment Preferences", "Skill Confidence"],
  },
  {
    id: "TPL-004",
    name: "Depression Screening (PHQ-9)",
    category: "Mental Health",
    questions: 25,
    duration: "20 min",
    usedCount: 42,
    lastUsed: "01 May 2024",
    difficulty: "Standard",
    description: "PHQ-9 validated depression screening tool with supplementary questions for context and functional impact assessment.",
    sections: ["Mood & Affect", "Sleep & Energy", "Cognitive Function", "Functional Impact"],
  },
  {
    id: "TPL-005",
    name: "Emotional Intelligence (EQ-i)",
    category: "Personality",
    questions: 45,
    duration: "35 min",
    usedCount: 37,
    lastUsed: "02 May 2024",
    difficulty: "Moderate",
    description: "Measures intrapersonal and interpersonal emotional intelligence skills. Adapted from EQ-i 2.0 framework with contextual relevance for Indian patients.",
    sections: ["Self-Awareness", "Self-Regulation", "Motivation", "Empathy", "Social Skills"],
  },
  {
    id: "TPL-006",
    name: "Workplace Wellbeing Survey",
    category: "Workplace",
    questions: 35,
    duration: "25 min",
    usedCount: 29,
    lastUsed: "03 May 2024",
    difficulty: "Standard",
    description: "Assesses burnout risk, job satisfaction, work-life balance, and occupational stressors using the Maslach Burnout Inventory as a foundation.",
    sections: ["Burnout Risk", "Job Satisfaction", "Work-Life Balance", "Workload", "Team Dynamics"],
  },
]

const CATEGORIES = ["All", "Personality", "Mental Health", "Career", "Workplace"] as const
type Category = typeof CATEGORIES[number]

const categoryStyle: Record<string, string> = {
  "Personality":   "bg-purple-100 text-purple-700",
  "Mental Health": "bg-red-100 text-red-600",
  "Career":        "bg-blue-100 text-blue-700",
  "Workplace":     "bg-amber-100 text-amber-700",
}

const difficultyStyle: Record<string, string> = {
  "Standard": "bg-gray-100 text-gray-600",
  "Moderate": "bg-teal-100 text-teal-700",
  "Advanced": "bg-orange-100 text-orange-600",
}

export default function TemplatesPage() {
  const [search,       setSearch]       = useState("")
  const [category,     setCategory]     = useState<Category>("All")
  const [expanded,     setExpanded]     = useState<string | null>(null)
  const [copiedId,     setCopiedId]     = useState<string | null>(null)

  const filtered = allTemplates.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "All" || t.category === category
    return matchSearch && matchCat
  })

  const handleCopy = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Back + title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/doctor-dashboard/assessments"
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-extrabold text-gray-800">Assessment Templates</h1>
                <p className="text-sm text-gray-500">Browse, preview and use standardised assessment templates.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Create Template
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Templates",    value: allTemplates.length.toString(),                            color: "text-gray-800" },
              { label: "Mental Health",      value: allTemplates.filter((t) => t.category === "Mental Health").length.toString(), color: "text-red-500"   },
              { label: "Personality",        value: allTemplates.filter((t) => t.category === "Personality").length.toString(),   color: "text-purple-600" },
              { label: "Total Uses",         value: allTemplates.reduce((s, t) => s + t.usedCount, 0).toString(),                 color: "text-teal-600"  },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates…"
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm" />
            </div>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`h-9 px-4 rounded-xl text-xs font-semibold border-2 transition-all
                    ${category === cat ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-600 hover:border-primary/40"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No templates match your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((t) => {
                const isOpen = expanded === t.id
                return (
                  <div key={t.id}
                    className={`bg-white rounded-2xl border shadow-sm transition-all overflow-hidden
                      ${isOpen ? "border-primary/30" : "border-gray-100"}`}>

                    {/* Card header */}
                    <div className="p-5 flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-800 text-sm">{t.name}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryStyle[t.category]}`}>{t.category}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyStyle[t.difficulty]}`}>{t.difficulty}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{t.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1"><ClipboardList className="w-3 h-3" />{t.questions} questions</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration}</span>
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" />Used {t.usedCount} times</span>
                          <span>Last used: {t.lastUsed}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setExpanded(isOpen ? null : t.id)}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> {isOpen ? "Hide" : "Preview"}
                        </button>
                        <button
                          onClick={() => handleCopy(t.id)}
                          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-semibold transition-colors
                            ${copiedId === t.id
                              ? "border-green-300 bg-green-50 text-green-600"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {copiedId === t.id
                            ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>
                            : <><Copy className="w-3.5 h-3.5" /> Duplicate</>}
                        </button>
                        <Link href={`/doctor-dashboard/assessments/assign?template=${encodeURIComponent(t.name)}`}>
                          <button className="flex items-center gap-1.5 h-8 px-3 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                            Use Template
                          </button>
                        </Link>
                        <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-200 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded preview */}
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">
                        <div className="grid grid-cols-2 gap-5">
                          {/* Sections */}
                          <div>
                            <p className="text-xs font-bold text-gray-700 mb-2">Sections in this Template</p>
                            <div className="space-y-1.5">
                              {t.sections.map((sec, si) => (
                                <div key={sec} className="flex items-center gap-2.5 text-xs">
                                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                    {si + 1}
                                  </span>
                                  <span className="text-gray-700 font-medium">{sec}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Template details */}
                          <div>
                            <p className="text-xs font-bold text-gray-700 mb-2">Template Details</p>
                            <div className="space-y-2">
                              {[
                                { label: "Template ID",   value: t.id         },
                                { label: "Questions",     value: `${t.questions} total` },
                                { label: "Est. Duration", value: t.duration   },
                                { label: "Difficulty",    value: t.difficulty },
                                { label: "Category",      value: t.category   },
                                { label: "Total Uses",    value: `${t.usedCount} times` },
                              ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between text-xs border-b border-gray-100 pb-1.5 last:border-0">
                                  <span className="text-gray-500">{row.label}</span>
                                  <span className="font-semibold text-gray-800">{row.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <Link href={`/doctor-dashboard/assessments/assign?template=${encodeURIComponent(t.name)}`}>
                            <button className="flex items-center gap-2 h-9 px-5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Use This Template
                            </button>
                          </Link>
                          <button className="flex items-center gap-2 h-9 px-4 border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:border-gray-300 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" /> Edit Template
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
