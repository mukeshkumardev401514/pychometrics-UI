"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, ClipboardList,
  BarChart2, FileText, MessageSquare, Edit2, Plus,
  CheckCircle2, Clock, XCircle, ChevronRight, Download,
  TrendingUp, AlertCircle,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import { apiClient } from "@/lib/api-client"

/* ─── static patient data (keyed by ID) ─── */
const PATIENT_DB: Record<string, {
  id: string; name: string; avatar: string; age: number; gender: string;
  dob: string; phone: string; email: string; address: string;
  primaryConcern: string; referredBy: string; status: string;
  joinDate: string; lastSeen: string; medHistory: string;
  medications: string; emergencyName: string; emergencyPhone: string;
  emergencyRelation: string;
}> = {
  "PT-1001": {
    id: "PT-1001", name: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",
    age: 28, gender: "Male",   dob: "14 Mar 1996", phone: "+91 98765 43210", email: "amit@email.com",
    address: "12, Andheri West, Mumbai, Maharashtra – 400053",
    primaryConcern: "Anxiety & Stress", referredBy: "Self-referred",
    status: "Completed", joinDate: "01 Jan 2024", lastSeen: "10 May 2024",
    medHistory: "No significant medical history. Reports occasional insomnia.",
    medications: "None currently.",
    emergencyName: "Sunita Kumar", emergencyPhone: "+91 98765 11111", emergencyRelation: "Spouse",
  },
  "PT-1002": {
    id: "PT-1002", name: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",
    age: 34, gender: "Female", dob: "22 Jun 1989", phone: "+91 91234 56789", email: "priya@email.com",
    address: "45, Koramangala, Bengaluru, Karnataka – 560034",
    primaryConcern: "Anxiety", referredBy: "GP / Family Doctor",
    status: "In Progress", joinDate: "15 Feb 2024", lastSeen: "08 May 2024",
    medHistory: "Diagnosed with generalised anxiety disorder in 2022.",
    medications: "Escitalopram 10mg daily.",
    emergencyName: "Rohan Singh", emergencyPhone: "+91 91234 99999", emergencyRelation: "Spouse",
  },
  "PT-1003": {
    id: "PT-1003", name: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",
    age: 22, gender: "Male",   dob: "05 Nov 2001", phone: "+91 99887 76655", email: "rahul@email.com",
    address: "8, Deccan Gymkhana, Pune, Maharashtra – 411004",
    primaryConcern: "Career Guidance", referredBy: "School / College",
    status: "Completed", joinDate: "10 Mar 2024", lastSeen: "05 May 2024",
    medHistory: "No significant medical history.",
    medications: "None.",
    emergencyName: "Vijay Mehta", emergencyPhone: "+91 99887 00001", emergencyRelation: "Parent",
  },
  "PT-1004": {
    id: "PT-1004", name: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",
    age: 29, gender: "Female", dob: "18 Sep 1994", phone: "+91 88123 45678", email: "neha@email.com",
    address: "33, Lajpat Nagar, New Delhi – 110024",
    primaryConcern: "Depression", referredBy: "Psychiatrist",
    status: "Not Started", joinDate: "20 Apr 2024", lastSeen: "01 May 2024",
    medHistory: "History of mild depression (2020). Therapy completed in 2021.",
    medications: "Vitamin D supplements.",
    emergencyName: "Sanjay Verma", emergencyPhone: "+91 88123 77777", emergencyRelation: "Parent",
  },
  "PT-1005": {
    id: "PT-1005", name: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png",
    age: 41, gender: "Male",   dob: "30 Jan 1983", phone: "+91 77654 32109", email: "suresh@email.com",
    address: "99, CG Road, Ahmedabad, Gujarat – 380009",
    primaryConcern: "Workplace Stress", referredBy: "HR / Employer",
    status: "In Progress", joinDate: "05 Mar 2024", lastSeen: "03 May 2024",
    medHistory: "Hypertension (managed). No psychiatric history.",
    medications: "Amlodipine 5mg daily.",
    emergencyName: "Meena Patel", emergencyPhone: "+91 77654 00002", emergencyRelation: "Spouse",
  },
  "PT-1006": {
    id: "PT-1006", name: "Sneha Iyer",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",
    age: 26, gender: "Female", dob: "12 Jul 1997", phone: "+91 90011 22334", email: "sneha@email.com",
    address: "77, T-Nagar, Chennai, Tamil Nadu – 600017",
    primaryConcern: "Emotional Intelligence", referredBy: "Self-referred",
    status: "Completed", joinDate: "01 Feb 2024", lastSeen: "29 Apr 2024",
    medHistory: "No significant medical history.",
    medications: "None.",
    emergencyName: "Lakshmi Iyer", emergencyPhone: "+91 90011 55555", emergencyRelation: "Parent",
  },
}

const ASSESSMENTS: Record<string, { type: string; assignedOn: string; dueDate: string; status: string; score?: number }[]> = {
  "PT-1001": [
    { type: "Personality & Stress",   assignedOn: "01 Jan 2024", dueDate: "15 Jan 2024", status: "Completed", score: 78 },
    { type: "Anxiety Assessment",     assignedOn: "01 Mar 2024", dueDate: "15 Mar 2024", status: "Completed", score: 65 },
  ],
  "PT-1002": [
    { type: "Anxiety Assessment",     assignedOn: "15 Feb 2024", dueDate: "01 Mar 2024", status: "In Progress" },
  ],
  "PT-1003": [
    { type: "Career Orientation",     assignedOn: "10 Mar 2024", dueDate: "24 Mar 2024", status: "Completed", score: 85 },
  ],
  "PT-1004": [
    { type: "Depression Screening",   assignedOn: "20 Apr 2024", dueDate: "05 May 2024", status: "Not Started" },
  ],
  "PT-1005": [
    { type: "Workplace Wellbeing",    assignedOn: "05 Mar 2024", dueDate: "20 Mar 2024", status: "In Progress" },
  ],
  "PT-1006": [
    { type: "Emotional Intelligence", assignedOn: "01 Feb 2024", dueDate: "15 Feb 2024", status: "Completed", score: 71 },
  ],
}

const NOTES: Record<string, { date: string; note: string; author: string }[]> = {
  "PT-1001": [
    { date: "10 May 2024", note: "Patient reports significant improvement in sleep quality. Anxiety levels reduced from 7/10 to 4/10.", author: "Dr. Rajesh Sharma" },
    { date: "15 Mar 2024", note: "Initial assessment completed. Patient shows moderate stress levels. Recommended CBT exercises.", author: "Dr. Rajesh Sharma" },
  ],
  "PT-1002": [
    { date: "08 May 2024", note: "Assessment in progress. Patient engaged and cooperative. Follow-up scheduled.", author: "Dr. Rajesh Sharma" },
  ],
  "PT-1003": [
    { date: "05 May 2024", note: "Career assessment completed. Strong aptitude for technology and creative fields.", author: "Dr. Rajesh Sharma" },
  ],
  "PT-1004": [{ date: "01 May 2024", note: "Patient registered. Assessment pending assignment confirmation.", author: "Dr. Rajesh Sharma" }],
  "PT-1005": [{ date: "03 May 2024", note: "Workplace stress levels elevated. Assessment ongoing. HR liaised.", author: "Dr. Rajesh Sharma" }],
  "PT-1006": [{ date: "29 Apr 2024", note: "Emotional intelligence assessment completed. High empathy scores noted.", author: "Dr. Rajesh Sharma" }],
}

const statusStyles: Record<string, string> = {
  "Completed":   "bg-green-100 text-green-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-red-100 text-red-600",
}
const statusIcon: Record<string, React.ReactNode> = {
  "Completed":   <CheckCircle2 className="w-3.5 h-3.5" />,
  "In Progress": <Clock        className="w-3.5 h-3.5" />,
  "Not Started": <XCircle      className="w-3.5 h-3.5" />,
}

type Tab = "Overview" | "Assessments" | "Results" | "Notes"

interface PatientDetailsResponse {
  id: string
  patient_code: string
  date_of_birth: string
  gender: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  emergency_contact_name: string
  emergency_contact_mobile: string
  emergency_contact_relation: string
  status: string
  created_at: string
  updated_at: string
  notes?: string
  email?: string
  first_name?: string
  last_name?: string
  mobile?: string
}

export default function ViewPatientPage() {
  const params   = useParams()
  const id = (params?.id as string) ?? ""
  const [patient, setPatient] = useState<typeof PATIENT_DB[string] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const response = await apiClient.get<PatientDetailsResponse>(
          `/api/doctor/patients/${id}`,
        )
        const data = response.data
        const birthDate = new Date(data.date_of_birth)
        const now = new Date()
        const age = now.getFullYear() - birthDate.getFullYear() - (
          now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0
        )

        setPatient({
          id: data.patient_code,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || data.patient_code,
          avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",
          age,
          gender: data.gender,
          dob: birthDate.toLocaleDateString(),
          phone: data.mobile ?? "—",
          email: data.email ?? "—",
          address: [
            data.address_line1,
            data.address_line2,
            data.city,
            data.state,
            data.postal_code,
          ].filter(Boolean).join(", "),
          primaryConcern: "—",
          referredBy: "—",
          status: data.status === "ACTIVE" ? "Active" : data.status,
          joinDate: new Date(data.created_at).toLocaleDateString(),
          lastSeen: new Date(data.updated_at).toLocaleDateString(),
          medHistory: data.notes ?? "—",
          medications: "—",
          emergencyName: data.emergency_contact_name,
          emergencyPhone: data.emergency_contact_mobile,
          emergencyRelation: data.emergency_contact_relation,
        })
      } catch (loadError: unknown) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load patient")
      } finally {
        setLoading(false)
      }
    }

    if (id) void loadPatient()
  }, [id])

  const assmnts: typeof ASSESSMENTS[string] = []
  const notes: typeof NOTES[string] = []

  const [tab, setTab] = useState<Tab>("Overview")
  const [newNote, setNewNote] = useState("")

  if (loading) {
    return <div className="p-8 text-gray-500">Loading patient details...</div>
  }

  if (error || !patient) {
    return <div className="p-8 text-red-600">{error || "Patient details not found"}</div>
  }

  const completedAssessments = assmnts.filter((a) => a.status === "Completed")

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Back + header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/doctor-dashboard/patients"
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-extrabold text-gray-800">Patient Profile</h1>
                <p className="text-sm text-gray-500">Patient ID: <span className="font-semibold text-primary">{patient.id}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 h-9 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors shadow-sm">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <Link href="/doctor-dashboard/assessments">
                <button className="flex items-center gap-2 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Assign Assessment
                </button>
              </Link>
            </div>
          </div>

          {/* Profile hero card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Image src={patient.avatar} alt={patient.name} width={80} height={80}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100" />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${patient.status === "Completed" ? "bg-green-500"
                  : patient.status === "In Progress" ? "bg-amber-400" : "bg-gray-300"}`} />
              </div>

              {/* Name + basic info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-800">{patient.name}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{patient.age} years · {patient.gender} · DOB: {patient.dob}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles[patient.status]}`}>
                    {statusIcon[patient.status]} {patient.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Joined {patient.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>Last seen {patient.lastSeen}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{patient.address}</span>
                </div>
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
              {[
                { label: "Total Assessments", value: assmnts.length.toString(),            icon: <ClipboardList className="w-4 h-4 text-primary" /> },
                { label: "Completed",          value: completedAssessments.length.toString(), icon: <CheckCircle2  className="w-4 h-4 text-green-600" /> },
                { label: "Avg. Score",         value: completedAssessments.length
                    ? `${Math.round(completedAssessments.reduce((s, a) => s + (a.score ?? 0), 0) / completedAssessments.length)}%`
                    : "—",                                                                   icon: <BarChart2     className="w-4 h-4 text-amber-500" /> },
                { label: "Primary Concern",    value: patient.primaryConcern,               icon: <AlertCircle   className="w-4 h-4 text-red-400"   /> },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-800">{s.value}</p>
                    <p className="text-[11px] text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 w-fit">
            {(["Overview", "Assessments", "Results", "Notes"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                  ${tab === t ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ─── OVERVIEW ─── */}
          {tab === "Overview" && (
            <div className="grid grid-cols-2 gap-5">
              {/* Personal Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Personal Information
                </h3>
                {[
                  { label: "Full Name",        value: patient.name            },
                  { label: "Date of Birth",    value: patient.dob             },
                  { label: "Gender",           value: patient.gender          },
                  { label: "Phone",            value: patient.phone           },
                  { label: "Email",            value: patient.email           },
                  { label: "Address",          value: patient.address         },
                  { label: "Primary Concern",  value: patient.primaryConcern  },
                  { label: "Referred By",      value: patient.referredBy      },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500 flex-shrink-0 w-32">{item.label}</span>
                    <span className="text-gray-800 font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Medical + Emergency */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" /> Medical Details
                  </h3>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Medical History</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{patient.medHistory}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Medications</p>
                    <p className="text-xs text-gray-700">{patient.medications}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Emergency Contact
                  </h3>
                  {[
                    { label: "Name",         value: patient.emergencyName     },
                    { label: "Phone",        value: patient.emergencyPhone    },
                    { label: "Relationship", value: patient.emergencyRelation },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-gray-800 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── ASSESSMENTS ─── */}
          {tab === "Assessments" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm">Assigned Assessments</h3>
                <Link href="/doctor-dashboard/assessments">
                  <button className="flex items-center gap-1.5 h-8 px-3 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Assign New
                  </button>
                </Link>
              </div>

              {assmnts.length === 0 ? (
                <div className="py-16 text-center">
                  <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No assessments assigned yet.</p>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Assessment Type</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Assigned On</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Due Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Score</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {assmnts.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{a.type}</td>
                        <td className="px-6 py-4 text-gray-400">{a.assignedOn}</td>
                        <td className="px-6 py-4 text-gray-400">{a.dueDate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[a.status]}`}>
                            {statusIcon[a.status]} {a.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {a.score !== undefined ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${a.score}%` }} />
                              </div>
                              <span className="font-semibold text-gray-700">{a.score}%</span>
                            </div>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {a.status === "Completed"
                            ? <button className="text-primary font-semibold hover:underline flex items-center gap-1">View Report <ChevronRight className="w-3 h-3" /></button>
                            : <span className="text-gray-400">Pending</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ─── RESULTS ─── */}
          {tab === "Results" && (
            <div className="space-y-5">
              {completedAssessments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                  <BarChart2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No completed results yet.</p>
                </div>
              ) : (
                completedAssessments.map((a, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{a.type}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Completed on {a.dueDate}</p>
                      </div>
                      <button className="flex items-center gap-1.5 h-8 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download Report
                      </button>
                    </div>

                    {/* Score breakdown */}
                    <div className="grid grid-cols-5 gap-3">
                      {["Openness","Conscientiousness","Extraversion","Agreeableness","Neuroticism"].map((dim, di) => {
                        const val = Math.max(40, Math.min(95, (a.score ?? 70) + (di * 7 - 14)))
                        return (
                          <div key={dim} className="bg-gray-50 rounded-xl p-3 text-center space-y-2">
                            <div className="relative w-12 h-12 mx-auto">
                              <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#0d9488" strokeWidth="3"
                                  strokeDasharray={`${val * 0.88} 88`} strokeLinecap="round" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-800">{val}%</span>
                            </div>
                            <p className="text-[10px] text-gray-600 font-medium leading-tight">{dim}</p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
                      <TrendingUp className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-teal-700 mb-1">Interpretation</p>
                        <p className="text-xs text-teal-700 leading-relaxed">
                          Patient shows strong emotional resilience with high agreeableness scores.
                          Moderate stress indicators suggest targeted coping strategies are recommended.
                          Overall psychometric profile is within healthy ranges.
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ─── NOTES ─── */}
          {tab === "Notes" && (
            <div className="space-y-4">
              {/* Add note */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Add Clinical Note
                </h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a clinical note about this patient..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setNewNote("")}
                    className="flex items-center gap-1.5 h-9 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Save Note
                  </button>
                </div>
              </div>

              {/* Existing notes */}
              {notes.map((n, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-primary">{n.author}</p>
                    <p className="text-[11px] text-gray-400">{n.date}</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{n.note}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
