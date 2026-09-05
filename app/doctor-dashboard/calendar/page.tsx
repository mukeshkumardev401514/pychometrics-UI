"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus, Clock, User } from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const events: Record<string, { time: string; patient: string; type: string; color: string }[]> = {
  "2024-05-06": [{ time: "09:00 AM", patient: "Amit Kumar",   type: "Follow-up Session",   color: "bg-teal-100 text-teal-700 border-teal-200"  }],
  "2024-05-08": [{ time: "11:00 AM", patient: "Priya Singh",  type: "Review Results",       color: "bg-amber-100 text-amber-700 border-amber-200" }],
  "2024-05-10": [{ time: "02:00 PM", patient: "Rahul Mehta",  type: "Initial Assessment",   color: "bg-blue-100 text-blue-700 border-blue-200"    }],
  "2024-05-14": [{ time: "10:00 AM", patient: "Neha Verma",   type: "Assessment Assign",    color: "bg-purple-100 text-purple-700 border-purple-200" }],
  "2024-05-17": [
    { time: "09:30 AM", patient: "Suresh Patel", type: "Progress Review",   color: "bg-teal-100 text-teal-700 border-teal-200"  },
    { time: "03:00 PM", patient: "Sneha Iyer",   type: "Follow-up Session", color: "bg-amber-100 text-amber-700 border-amber-200" },
  ],
  "2024-05-22": [{ time: "01:00 PM", patient: "Amit Kumar",   type: "Debrief Session",     color: "bg-blue-100 text-blue-700 border-blue-200"    }],
}

const upcomingList = [
  { date: "06 May", time: "09:00 AM", patient: "Amit Kumar",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/amit-kumar.png",   type: "Follow-up Session"   },
  { date: "08 May", time: "11:00 AM", patient: "Priya Singh",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/priya-singh.png",  type: "Review Results"       },
  { date: "10 May", time: "02:00 PM", patient: "Rahul Mehta",  avatar: "/psychometrics_doctor_dashboard_assets/avatars/rahul-mehta.png",  type: "Initial Assessment"   },
  { date: "14 May", time: "10:00 AM", patient: "Neha Verma",   avatar: "/psychometrics_doctor_dashboard_assets/avatars/neha-verma.png",   type: "Assessment Assign"    },
  { date: "17 May", time: "09:30 AM", patient: "Suresh Patel", avatar: "/psychometrics_doctor_dashboard_assets/avatars/suresh-patel.png", type: "Progress Review"      },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const [year,  setYear]  = useState(2024)
  const [month, setMonth] = useState(4) // May = 4

  const daysInMonth  = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1) } else setMonth((m) => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1) } else setMonth((m) => m + 1) }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Calendar</h1>
              <p className="text-sm text-gray-500 mt-0.5">Schedule and manage patient appointments.</p>
            </div>
            <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> New Appointment
            </button>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Calendar grid (2/3) */}
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="font-bold text-gray-800">{MONTHS[month]} {year}</h2>
                <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 px-4 pt-3 pb-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 px-4 pb-4 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const dayEvents = events[key] || []
                  const isToday = day === 17 && month === 4 && year === 2024

                  return (
                    <div key={day} className={`min-h-[64px] rounded-xl p-1.5 border transition-colors cursor-pointer
                      ${isToday ? "border-primary bg-teal-50" : "border-transparent hover:border-gray-200 hover:bg-gray-50"}`}>
                      <span className={`text-xs font-semibold block mb-1
                        ${isToday ? "text-primary" : "text-gray-700"}`}>
                        {day}
                      </span>
                      {dayEvents.map((ev, ei) => (
                        <div key={ei} className={`text-[9px] font-medium px-1 py-0.5 rounded border truncate mb-0.5 ${ev.color}`}>
                          {ev.time}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upcoming appointments (1/3) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-bold text-gray-800 text-sm">Upcoming Appointments</h2>
              <div className="space-y-3">
                {upcomingList.map((u, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-teal-50/30 transition-all cursor-pointer">
                    <Image src={u.avatar} alt={u.patient} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{u.patient}</p>
                      <p className="text-[11px] text-primary font-medium">{u.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{u.time}
                        </span>
                        <span className="text-[10px] text-gray-400">· {u.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
