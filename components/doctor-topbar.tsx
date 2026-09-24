"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell, Search, ChevronDown, UserCircle, Settings, LogOut,
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function DoctorTopBar() {
  const router = useRouter()
  const [search,      setSearch]      = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [doctorName, setDoctorName] = useState("Doctor")
  const [doctorTitle, setDoctorTitle] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const response = await apiClient.get<{
          first_name: string
          last_name: string
          qualification: string
        }>("/api/external/doctors/me")

        const doctor = response.data
        setDoctorName(`${doctor.first_name} ${doctor.last_name}`.trim())
        setDoctorTitle(doctor.qualification)
      } catch {
        // The API interceptor handles expired sessions.
      }
    }

    void loadDoctorProfile()
  }, [])

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Strict"
    document.cookie = "session=;    path=/; max-age=0; SameSite=Strict"
    router.push("/login")
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-6 flex-shrink-0 z-30">
      {/* Search */}
      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name, ID or email..."
          className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Bell */}
        <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">3</span>
        </button>

        {/* Doctor profile + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              DR
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{doctorName}</p>
              <p className="text-xs text-gray-500">{doctorTitle}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-bold text-gray-800 leading-tight">{doctorName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{doctorTitle}</p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/doctor-dashboard/my-profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-gray-400" />
                  My Profile
                </Link>
                <Link
                  href="/doctor-dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
