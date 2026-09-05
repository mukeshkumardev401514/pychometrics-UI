"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search, Filter, Plus, MoreVertical, ArrowLeft, ArrowRight,
  Phone, Mail,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const allPatients = [
  { id: "PT-1001", name: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   age: 28, gender: "Male",   phone: "+91 98765 43210", email: "amit@email.com",   assessment: "Personality & Stress",  status: "Completed",   lastSeen: "10 May 2024" },
  { id: "PT-1002", name: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  age: 34, gender: "Female", phone: "+91 91234 56789", email: "priya@email.com",  assessment: "Anxiety Assessment",    status: "In Progress", lastSeen: "08 May 2024" },
  { id: "PT-1003", name: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  age: 22, gender: "Male",   phone: "+91 99887 76655", email: "rahul@email.com",  assessment: "Career Orientation",    status: "Completed",   lastSeen: "05 May 2024" },
  { id: "PT-1004", name: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",   age: 29, gender: "Female", phone: "+91 88123 45678", email: "neha@email.com",   assessment: "Depression Screening",  status: "Not Started", lastSeen: "01 May 2024" },
  { id: "PT-1005", name: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", age: 41, gender: "Male",   phone: "+91 77654 32109", email: "suresh@email.com", assessment: "Workplace Wellbeing",   status: "In Progress", lastSeen: "03 May 2024" },
  { id: "PT-1006", name: "Sneha Iyer",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   age: 26, gender: "Female", phone: "+91 90011 22334", email: "sneha@email.com",  assessment: "Emotional Intelligence", status: "Completed",   lastSeen: "29 Apr 2024" },
]

const statusStyles: Record<string, string> = {
  "Completed":   "bg-green-100 text-green-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-red-100 text-red-600",
}

type Tab = "All" | "Active" | "In Progress" | "Completed"

export default function PatientsPage() {
  const [tab, setTab] = useState<Tab>("All")
  const [search, setSearch] = useState("")

  const filtered = allPatients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search)
    const matchTab =
      tab === "All" ||
      (tab === "In Progress" && p.status === "In Progress") ||
      (tab === "Completed"   && p.status === "Completed") ||
      (tab === "Active"      && p.status !== "Not Started")
    return matchSearch && matchTab
  })

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Patients</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage and view all your assigned patients.</p>
            </div>
            <Link href="/doctor-dashboard/patients/add">
              <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Add New Patient
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Patients", value: "128", color: "text-gray-800" },
              { label: "Active",         value: "96",  color: "text-green-600" },
              { label: "In Progress",    value: "12",  color: "text-amber-600" },
              { label: "Not Started",    value: "20",  color: "text-red-500"   },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex gap-6">
                {(["All", "Active", "In Progress", "Completed"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`py-1 text-sm font-semibold border-b-2 transition-colors
                      ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-primary"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
                  />
                </div>
                <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
              </div>
            </div>

            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded accent-primary" /></th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Age / Gender</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Last Assessment</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Last Seen</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
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
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-gray-500"><Phone className="w-3 h-3" />{p.phone}</div>
                        <div className="flex items-center gap-1 text-gray-500"><Mail className="w-3 h-3" />{p.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.assessment}</td>
                    <td className="px-4 py-3 text-gray-400">{p.lastSeen}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/doctor-dashboard/patients/${p.id}`}
                          className="text-primary font-semibold hover:underline">View</Link>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {allPatients.length} patients</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                {[1, 2, 3].map((n) => (
                  <button key={n} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                    ${n === 1 ? "bg-primary text-white" : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"}`}>
                    {n}
                  </button>
                ))}
                <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
