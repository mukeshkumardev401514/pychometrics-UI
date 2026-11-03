"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Users, ClipboardList, BarChart2, GitCompare,
  Calendar, UserCircle, Settings, HelpCircle,
  ChevronDown, FileText, ListChecks, BookOpen,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/doctor-dashboard"                },
  { icon: Users,           label: "Patients",         href: "/doctor-dashboard/patients"       },
  { icon: ClipboardList,   label: "Assessments",      href: "/doctor-dashboard/assessments", hasChildren: true },
  { icon: BarChart2,       label: "Results & Reports", href: "/doctor-dashboard/results-reports" },
  { icon: GitCompare,      label: "Compare Results",   href: "/doctor-dashboard/compare-results" },
  { icon: Calendar,        label: "Calendar",          href: "/doctor-dashboard/calendar"        },
  { icon: UserCircle,      label: "My Profile",        href: "/doctor-dashboard/my-profile"      },
  { icon: Settings,        label: "Settings",          href: "/doctor-dashboard/settings"        },
  { icon: HelpCircle,      label: "Help & Support",    href: "/doctor-dashboard/help-support"    },
]

const assessmentSubItems = [
  { icon: ListChecks, label: "All Assessments", href: "/doctor-dashboard/assessments"              },
  { icon: FileText,   label: "Assign New",      href: "/doctor-dashboard/assessments/assign"       },
  { icon: ClipboardList, label: "Assigned Assessment", href: "/doctor-dashboard/assessments/assigned" },
  { icon: BookOpen,   label: "Templates",       href: "/doctor-dashboard/assessments/templates"    },
]

export default function DoctorSidebar() {
  const pathname = usePathname()
  const isAssessmentsActive = pathname.startsWith("/doctor-dashboard/assessments")
  const [assessmentsOpen, setAssessmentsOpen] = useState(isAssessmentsActive)

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <Link href="/doctor-dashboard">
          <Image
            src="/psychometrics_doctor_dashboard_assets/logo/psychometrics-evaluation-logo.png"
            alt="Psychometrics Evaluation"
            width={160} height={48}
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.hasChildren
            ? isAssessmentsActive
            : pathname === item.href

          return (
            <div key={item.label}>
              {item.hasChildren ? (
                <button
                  onClick={() => setAssessmentsOpen((o) => !o)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${assessmentsOpen ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              )}

              {/* Assessments sub-menu */}
              {item.hasChildren && assessmentsOpen && (
                <div className="bg-gray-50 border-l-2 border-primary/30 ml-4">
                  {assessmentSubItems.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors
                        ${pathname === sub.href
                          ? "text-primary font-semibold bg-teal-50"
                          : "text-gray-600 hover:bg-teal-50 hover:text-primary"}`}
                    >
                      <sub.icon className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Sidebar illustration */}
      <div className="flex-shrink-0 pl-5 pr-2 pb-3">
        <Image
          src="/psychometrics_doctor_dashboard_assets/illustrations/brain-medical-sidebar.png"
          alt="Better Minds Brighter Tomorrows"
          width={224} height={200}
          className="block h-auto w-full object-contain"
        />
      </div>
    </aside>
  )
}
