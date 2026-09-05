"use client"

import { useState } from "react"
import { Camera, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const initialProfile = {
  name:           "Dr. Rajesh Sharma",
  title:          "Clinical Psychologist",
  email:          "rajesh.sharma@psychometrics.in",
  phone:          "+91 98765 43210",
  location:       "Mumbai, Maharashtra",
  license:        "MH-PSY-2019-04521",
  experience:     "8 Years",
  specialization: "Cognitive Behavioral Therapy, Psychometric Assessment",
  languages:      "English, Hindi, Marathi",
  bio:            "Dr. Rajesh Sharma is a licensed clinical psychologist with over 8 years of experience in psychometric evaluation and cognitive behavioral therapy. He specializes in identifying mental health patterns and helping patients achieve better outcomes through data-driven insights.",
}

const stats = [
  { label: "Total Patients",      value: "128" },
  { label: "Assessments Done",    value: "352" },
  { label: "Avg. Rating",         value: "4.9★" },
  { label: "Years Experience",    value: "8"   },
]

const recentActivity = [
  { action: "Reviewed results for Priya Singh",        time: "Today, 11:00 AM" },
  { action: "Assigned Anxiety Assessment to Neha Verma", time: "Today, 09:30 AM" },
  { action: "Completed follow-up with Amit Kumar",     time: "Yesterday, 03:00 PM" },
  { action: "Added new patient: Deepa Nair",            time: "Yesterday, 10:00 AM" },
  { action: "Generated report for Suresh Patel",       time: "12 May, 02:00 PM" },
]

export default function MyProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(initialProfile)

  const save = () => { setProfile(draft); setEditing(false) }
  const cancel = () => { setDraft(profile); setEditing(false) }

  const field = (key: keyof typeof initialProfile, label: string, multiline = false) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {editing ? (
        multiline ? (
          <textarea
            value={draft[key]}
            onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        ) : (
          <input
            value={draft[key]}
            onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
            className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        )
      ) : (
        <p className="text-sm text-gray-800">{profile[key]}</p>
      )}
    </div>
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
              <h1 className="text-xl font-extrabold text-gray-800">My Profile</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage your professional information and preferences.</p>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={cancel} className="flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={save} className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* LEFT: Avatar + stats */}
            <div className="space-y-5">
              {/* Avatar card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-600 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold">
                    DR
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary/90">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{profile.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{profile.title}</p>
                  <p className="text-[11px] text-primary font-medium mt-1">Lic. {profile.license}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> {profile.location}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="w-3 h-3" /> {profile.email}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" /> {profile.phone}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-teal-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-extrabold text-primary">{s.value}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Profile form + activity */}
            <div className="col-span-2 space-y-5">
              {/* Profile details */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-bold text-gray-800 text-sm">Professional Information</h3>
                <div className="grid grid-cols-2 gap-5">
                  {field("name",           "Full Name")}
                  {field("title",          "Title / Role")}
                  {field("email",          "Email Address")}
                  {field("phone",          "Phone Number")}
                  {field("location",       "Location")}
                  {field("license",        "License Number")}
                  {field("experience",     "Years of Experience")}
                  {field("languages",      "Languages")}
                </div>
                <div className="grid grid-cols-1 gap-5">
                  {field("specialization", "Specialization")}
                  {field("bio",            "Professional Bio", true)}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-700">{a.action}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
