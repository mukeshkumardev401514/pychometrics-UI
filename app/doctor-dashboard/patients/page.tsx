"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search, Filter, Plus, MoreVertical, ArrowLeft, ArrowRight,
  Phone, Mail,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import { apiClient } from "@/lib/api-client"

interface PatientApiResponse {
  id: string
  user_id: string
  patient_code?: string
  first_name?: string
  last_name?: string
  mobile?: string
  email?: string
  date_of_birth?: string
  gender?: string
  status?: string
  updated_at?: string
}

interface PatientsResponse {
  counts?: {
    total_patients: number
    active: number
    in_progress: number
    not_started: number
  }
  pagination?: {
    limit: number
    offset: number
    total: number
    total_pages: number
  }
  items?: PatientApiResponse[]
  data?: PatientApiResponse[]
  patients?: PatientApiResponse[]
}

type Patient = {
  backendId: string
  id: string
  name: string
  avatar: string
  age: string
  gender: string
  phone: string
  email: string
  assessment: string
  status: string
  lastSeen: string
}

const statusStyles: Record<string, string> = {
  "Active":      "bg-green-100 text-green-700",
  "Completed":   "bg-green-100 text-green-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Not Started": "bg-red-100 text-red-600",
}

type Tab = "All" | "Active" | "In Progress" | "Completed"

export default function PatientsPage() {
  const [tab, setTab] = useState<Tab>("All")
  const [search, setSearch] = useState("")
  const [allPatients, setAllPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPatients, setTotalPatients] = useState(0)
  const [patientCounts, setPatientCounts] = useState({
    active: 0,
    inProgress: 0,
    notStarted: 0,
  })

  const PAGE_SIZE = 10

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await apiClient.get<PatientApiResponse[] | PatientsResponse>(
          `/api/external/data/patients?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`,
        )
        const payload = response.data
        const patients = Array.isArray(payload)
          ? payload
          : payload.items ?? payload.data ?? payload.patients ?? []

        if (!Array.isArray(payload)) {
          setHasNextPage(
            payload.pagination
              ? page < payload.pagination.total_pages
              : patients.length === PAGE_SIZE,
          )
          setTotalPatients(payload.pagination?.total ?? 0)
          setTotalPages(
            payload.pagination?.total_pages ??
            Math.ceil((payload.pagination?.total ?? 0) / PAGE_SIZE),
          )
          setPatientCounts({
            active: payload.counts?.active ?? 0,
            inProgress: payload.counts?.in_progress ?? 0,
            notStarted: payload.counts?.not_started ?? 0,
          })
        } else {
          setHasNextPage(patients.length === PAGE_SIZE)
          setTotalPatients(patients.length)
          setTotalPages(Math.max(1, Math.ceil(patients.length / PAGE_SIZE)))
        }

        setAllPatients(patients.map((patient) => ({
          backendId: patient.id,
          id: patient.patient_code ?? patient.id,
          name: patient.first_name
            ? `${patient.first_name} ${patient.last_name ?? ""}`.trim()
            : `Patient ${patient.patient_code ?? patient.id}`,
          avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",
          age: patient.date_of_birth
            ? String(new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear())
            : "—",
          gender: patient.gender ?? "—",
          phone: patient.mobile ?? "—",
          email: patient.email ?? "—",
          assessment: "—",
          status: patient.status === "ACTIVE" ? "Active" : patient.status ?? "Active",
          lastSeen: patient.updated_at
            ? new Date(patient.updated_at).toLocaleDateString()
            : "—",
        })))
      } catch (loadError: unknown) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load patients")
      } finally {
        setLoading(false)
      }
    }

    void loadPatients()
  }, [page])

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
              { label: "Total Patients", value: totalPatients, color: "text-gray-800" },
              { label: "Active", value: patientCounts.active, color: "text-green-600" },
              { label: "In Progress", value: patientCounts.inProgress, color: "text-amber-600" },
              { label: "Not Started", value: patientCounts.notStarted, color: "text-red-500" },
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
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading patients...</td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-red-600">{error}</td>
                  </tr>
                )}
                {!loading && !error && filtered.map((p) => (
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
                        <Link href={`/doctor-dashboard/patients/${p.backendId}`}
                          className="text-primary font-semibold hover:underline">View</Link>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {totalPatients} patients</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  disabled={page === 1 || loading}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    disabled={loading}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      pageNumber === page
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={!hasNextPage || loading}
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
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
