"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft, Search, User, ClipboardList, Calendar,
  ChevronDown, CheckCircle2, AlertCircle, Clock,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

/* ─── data ─── */
const patientList = [
  { id: "PT-1001", name: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   age: 28, gender: "Male",   lastAssessment: "10 May 2024" },
  { id: "PT-1002", name: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  age: 34, gender: "Female", lastAssessment: "08 May 2024" },
  { id: "PT-1003", name: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  age: 22, gender: "Male",   lastAssessment: "05 May 2024" },
  { id: "PT-1004", name: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",   age: 29, gender: "Female", lastAssessment: "01 May 2024" },
  { id: "PT-1005", name: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", age: 41, gender: "Male",   lastAssessment: "03 May 2024" },
  { id: "PT-1006", name: "Sneha Iyer",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   age: 26, gender: "Female", lastAssessment: "29 Apr 2024" },
]

const assessmentTypes = [
  { name: "Personality & Stress Assessment", questions: 60, duration: "45 min", category: "Personality",   desc: "Measures core personality traits and stress vulnerability." },
  { name: "Anxiety Assessment",              questions: 40, duration: "30 min", category: "Mental Health", desc: "GAD-7 based anxiety screening and severity grading."        },
  { name: "Career Orientation Test",         questions: 50, duration: "40 min", category: "Career",        desc: "Identifies strengths, aptitudes and career preferences."    },
  { name: "Depression Screening",            questions: 25, duration: "20 min", category: "Mental Health", desc: "PHQ-9 validated depression detection and scoring."           },
  { name: "Emotional Intelligence",          questions: 45, duration: "35 min", category: "Personality",   desc: "Evaluates self-awareness, empathy and relationship skills." },
  { name: "Workplace Wellbeing",             questions: 35, duration: "25 min", category: "Workplace",     desc: "Assesses burnout risk and occupational satisfaction."        },
]

const categoryColor: Record<string, string> = {
  "Personality":   "bg-purple-100 text-purple-700",
  "Mental Health": "bg-red-100 text-red-600",
  "Career":        "bg-blue-100 text-blue-700",
  "Workplace":     "bg-amber-100 text-amber-700",
}

const priorityOpts = ["Low", "Normal", "High", "Urgent"] as const
const priorityColor: Record<string, string> = {
  "Low":    "border-gray-300 text-gray-500",
  "Normal": "border-blue-300 text-blue-600",
  "High":   "border-amber-400 text-amber-600",
  "Urgent": "border-red-400 text-red-600",
}

/* ─── sub-components ─── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

export default function AssignNewPage() {
  const router = useRouter()

  /* form state */
  const [patientSearch, setPatientSearch]   = useState("")
  const [selectedPatient, setSelectedPatient] = useState<typeof patientList[0] | null>(null)
  const [patientDropOpen, setPatientDropOpen] = useState(false)

  const [selectedType, setSelectedType]     = useState<typeof assessmentTypes[0] | null>(null)
  const [dueDate,      setDueDate]          = useState("")
  const [priority,     setPriority]         = useState<typeof priorityOpts[number]>("Normal")
  const [sendEmail,    setSendEmail]         = useState(true)
  const [sendSms,      setSendSms]           = useState(false)
  const [notes,        setNotes]            = useState("")

  const [submitted, setSubmitted] = useState(false)

  const filteredPatients = patientList.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(patientSearch.toLowerCase())
  )

  const canSubmit = selectedPatient && selectedType && dueDate

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
  }

  /* ── Success screen ── */
  if (submitted && selectedPatient && selectedType) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <DoctorSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DoctorTopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-800">Assessment Assigned!</h2>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold text-gray-700">{selectedType.name}</span> has been assigned to{" "}
                  <span className="font-semibold text-gray-700">{selectedPatient.name}</span>.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-xs text-left space-y-2">
                {[
                  { label: "Patient",    value: `${selectedPatient.name} (${selectedPatient.id})` },
                  { label: "Assessment", value: selectedType.name },
                  { label: "Due Date",   value: dueDate },
                  { label: "Priority",   value: priority },
                  { label: "Notified",   value: [sendEmail && "Email", sendSms && "SMS"].filter(Boolean).join(", ") || "None" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-semibold text-gray-800">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setSubmitted(false); setSelectedPatient(null); setSelectedType(null); setDueDate(""); setNotes("") }}
                  className="w-full h-10 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  Assign Another
                </button>
                <Link href="/doctor-dashboard/assessments">
                  <button className="w-full h-10 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:border-gray-300 transition-colors">
                    View All Assessments
                  </button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Back + title */}
          <div className="flex items-center gap-3">
            <Link href="/doctor-dashboard/assessments"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Assign New Assessment</h1>
              <p className="text-sm text-gray-500">Select a patient and assessment type to get started.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">

            {/* ── LEFT: form (2/3) ── */}
            <div className="col-span-2 space-y-5">

              {/* Step 1 – Select Patient */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <h2 className="font-bold text-gray-800">Select Patient</h2>
                </div>

                {/* Patient dropdown */}
                <div className="relative">
                  <FieldLabel required>Patient</FieldLabel>
                  <div
                    onClick={() => setPatientDropOpen((o) => !o)}
                    className={`w-full h-11 px-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors
                      ${patientDropOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
                  >
                    {selectedPatient ? (
                      <>
                        <Image src={selectedPatient.avatar} alt={selectedPatient.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        <span className="flex-1 text-sm font-medium text-gray-800">{selectedPatient.name}</span>
                        <span className="text-xs text-gray-400">{selectedPatient.id}</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 text-sm text-gray-400">Search and select a patient…</span>
                      </>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${patientDropOpen ? "rotate-180" : ""}`} />
                  </div>

                  {patientDropOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            autoFocus
                            value={patientSearch}
                            onChange={(e) => setPatientSearch(e.target.value)}
                            placeholder="Search patient name or ID…"
                            className="w-full h-8 pl-8 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredPatients.map((p) => (
                          <li key={p.id}>
                            <button
                              onClick={() => { setSelectedPatient(p); setPatientDropOpen(false); setPatientSearch("") }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-teal-50 transition-colors text-left"
                            >
                              <Image src={p.avatar} alt={p.name} width={28} height={28} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.id} · {p.age}/{p.gender[0]}</p>
                              </div>
                              <span className="text-[11px] text-gray-400 flex-shrink-0">Last: {p.lastAssessment}</span>
                            </button>
                          </li>
                        ))}
                        {filteredPatients.length === 0 && (
                          <li className="px-4 py-6 text-center text-xs text-gray-400">No patients found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2 – Assessment Type */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <h2 className="font-bold text-gray-800">Choose Assessment Type</h2>
                </div>
                <FieldLabel required>Assessment</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {assessmentTypes.map((at) => (
                    <button
                      key={at.name}
                      onClick={() => setSelectedType(at.name === selectedType?.name ? null : at)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all
                        ${selectedType?.name === at.name
                          ? "border-primary bg-teal-50"
                          : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
                        ${selectedType?.name === at.name ? "border-primary" : "border-gray-300"}`}>
                        {selectedType?.name === at.name && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${selectedType?.name === at.name ? "text-primary" : "text-gray-800"}`}>
                            {at.name}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColor[at.category]}`}>{at.category}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{at.desc}</p>
                        <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-2">
                          <ClipboardList className="w-3 h-3" />{at.questions} questions
                          <Clock className="w-3 h-3 ml-1" />{at.duration}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 – Schedule & Options */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <h2 className="font-bold text-gray-800">Schedule & Options</h2>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <FieldLabel required>Due Date</FieldLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Priority</FieldLabel>
                    <div className="flex gap-2">
                      {priorityOpts.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`flex-1 h-10 rounded-xl border-2 text-xs font-semibold transition-all
                            ${priority === p
                              ? `${priorityColor[p]} bg-white shadow-sm`
                              : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div>
                  <FieldLabel>Notify Patient Via</FieldLabel>
                  <div className="flex gap-3">
                    {[
                      { key: "email", label: "Email", val: sendEmail, set: setSendEmail },
                      { key: "sms",   label: "SMS",   val: sendSms,   set: setSendSms   },
                    ].map((n) => (
                      <button
                        key={n.key}
                        onClick={() => n.set(!n.val)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all
                          ${n.val ? "border-primary bg-teal-50 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center
                          ${n.val ? "border-primary bg-primary" : "border-gray-300"}`}>
                          {n.val && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <FieldLabel>Notes to Patient <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add instructions or context for the patient…"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Link href="/doctor-dashboard/assessments">
                    <button className="h-10 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
                      Cancel
                    </button>
                  </Link>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`flex items-center gap-2 h-10 px-7 text-sm font-semibold rounded-xl transition-colors shadow-sm
                      ${canSubmit
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Assign Assessment
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Summary panel (1/3) ── */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 sticky top-0">
                <h3 className="font-bold text-gray-800 text-sm">Assignment Summary</h3>

                {/* Patient preview */}
                <div className={`rounded-xl border p-3 transition-all ${selectedPatient ? "border-teal-200 bg-teal-50" : "border-dashed border-gray-200 bg-gray-50"}`}>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Patient</p>
                  {selectedPatient ? (
                    <div className="flex items-center gap-2.5">
                      <Image src={selectedPatient.avatar} alt={selectedPatient.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{selectedPatient.name}</p>
                        <p className="text-xs text-gray-500">{selectedPatient.id} · {selectedPatient.age}/{selectedPatient.gender[0]}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 flex items-center gap-2"><User className="w-4 h-4" />No patient selected</p>
                  )}
                </div>

                {/* Assessment preview */}
                <div className={`rounded-xl border p-3 transition-all ${selectedType ? "border-teal-200 bg-teal-50" : "border-dashed border-gray-200 bg-gray-50"}`}>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Assessment</p>
                  {selectedType ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{selectedType.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedType.questions} questions · {selectedType.duration}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 flex items-center gap-2"><ClipboardList className="w-4 h-4" />No assessment chosen</p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  {[
                    { label: "Due Date", value: dueDate || "—" },
                    { label: "Priority", value: priority },
                    { label: "Notify",   value: [sendEmail && "Email", sendSms && "SMS"].filter(Boolean).join(", ") || "None" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-semibold text-gray-800">{row.value}</span>
                    </div>
                  ))}
                </div>

                {!canSubmit && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Please select a patient, choose an assessment type and set a due date to proceed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
