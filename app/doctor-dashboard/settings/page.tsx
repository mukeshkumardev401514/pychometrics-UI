"use client"

import { useState } from "react"
import {
  Bell, Lock, Globe, Moon, Shield, Smartphone,
  ChevronRight, Check, ToggleLeft, ToggleRight,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

type Section = "Notifications" | "Privacy & Security" | "Appearance" | "Account"

const sections: { key: Section; icon: React.ElementType; label: string }[] = [
  { key: "Notifications",      icon: Bell,    label: "Notifications"       },
  { key: "Privacy & Security", icon: Lock,    label: "Privacy & Security"  },
  { key: "Appearance",         icon: Moon,    label: "Appearance"          },
  { key: "Account",            icon: Shield,  label: "Account"             },
]

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex-shrink-0">
      {on
        ? <ToggleRight className="w-8 h-8 text-primary" />
        : <ToggleLeft  className="w-8 h-8 text-gray-300" />}
    </button>
  )
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("Notifications")

  const [notifs, setNotifs] = useState({
    emailAlerts:      true,
    smsAlerts:        false,
    newPatient:       true,
    assessmentDone:   true,
    taskReminders:    true,
    weeklyReport:     false,
  })

  const [privacy, setPrivacy] = useState({
    twoFactor:        false,
    sessionTimeout:   true,
    activityLog:      true,
  })

  const [appearance, setAppearance] = useState({
    darkMode:         false,
    compactView:      false,
  })

  const toggle = <T extends Record<string, boolean>>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          <div>
            <h1 className="text-xl font-extrabold text-gray-800">Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences and configurations.</p>
          </div>

          <div className="flex gap-5">
            {/* Sidebar nav */}
            <div className="w-52 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1 self-start">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${active === s.key ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50 hover:text-primary"}`}
                >
                  <s.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{s.label}</span>
                  {active !== s.key && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
                </button>
              ))}
            </div>

            {/* Content panel */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

              {active === "Notifications" && (
                <>
                  <h2 className="font-bold text-gray-800">Notification Preferences</h2>
                  <div className="space-y-4">
                    {([
                      { key: "emailAlerts",    label: "Email Alerts",       desc: "Receive notifications via email"              },
                      { key: "smsAlerts",      label: "SMS Alerts",         desc: "Receive notifications via SMS"                },
                      { key: "newPatient",     label: "New Patient Added",  desc: "Alert when a new patient is assigned to you"  },
                      { key: "assessmentDone", label: "Assessment Completed", desc: "Alert when a patient completes assessment"  },
                      { key: "taskReminders",  label: "Task Reminders",     desc: "Daily reminders for pending tasks"            },
                      { key: "weeklyReport",   label: "Weekly Summary",     desc: "Receive weekly performance report"            },
                    ] as { key: keyof typeof notifs; label: string; desc: string }[]).map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle on={notifs[item.key]} onToggle={() => toggle(setNotifs, item.key)} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {active === "Privacy & Security" && (
                <>
                  <h2 className="font-bold text-gray-800">Privacy & Security</h2>
                  <div className="space-y-4">
                    {([
                      { key: "twoFactor",      label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account" },
                      { key: "sessionTimeout", label: "Auto Session Timeout",       desc: "Automatically log out after 30 minutes of inactivity" },
                      { key: "activityLog",    label: "Activity Log",               desc: "Keep a log of all account activity"             },
                    ] as { key: keyof typeof privacy; label: string; desc: string }[]).map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle on={privacy[item.key]} onToggle={() => toggle(setPrivacy, item.key)} />
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 space-y-3">
                    <h3 className="font-semibold text-gray-700 text-sm">Change Password</h3>
                    {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                      <div key={label} className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">{label}</label>
                        <input type="password" placeholder="••••••••"
                          className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    ))}
                    <button className="h-9 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                      Update Password
                    </button>
                  </div>
                </>
              )}

              {active === "Appearance" && (
                <>
                  <h2 className="font-bold text-gray-800">Appearance</h2>
                  <div className="space-y-4">
                    {([
                      { key: "darkMode",    label: "Dark Mode",    desc: "Switch to a dark color scheme"   },
                      { key: "compactView", label: "Compact View", desc: "Reduce spacing for denser layout" },
                    ] as { key: keyof typeof appearance; label: string; desc: string }[]).map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle on={appearance[item.key]} onToggle={() => toggle(setAppearance, item.key)} />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-sm">Language</h3>
                    <div className="flex items-center gap-3">
                      {["English", "Hindi", "Marathi"].map((lang) => (
                        <button key={lang} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors">
                          {lang === "English" && <Check className="w-3 h-3 text-primary" />}
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {active === "Account" && (
                <>
                  <h2 className="font-bold text-gray-800">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Account Type",   value: "Doctor / Clinician"  },
                        { label: "Member Since",   value: "January 2020"         },
                        { label: "Subscription",   value: "Professional Plan"    },
                        { label: "Renewal Date",   value: "31 December 2024"     },
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-100 space-y-3">
                      <button className="flex items-center gap-2 text-sm font-semibold text-amber-600 hover:underline">
                        <Smartphone className="w-4 h-4" /> Manage Connected Devices
                      </button>
                      <button className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:underline">
                        <Shield className="w-4 h-4" /> Delete Account
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-gray-100">
                <button className="h-9 px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
