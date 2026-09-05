"use client"

import { useState } from "react"
import {
  Search, ChevronDown, ChevronRight, MessageCircle,
  BookOpen, Mail, Phone, ExternalLink, CheckCircle2,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"

const faqs = [
  {
    q: "How do I assign an assessment to a patient?",
    a: "Navigate to Assessments → Assign New. Select the patient, choose the assessment type, set a due date, and click Assign Assessment.",
  },
  {
    q: "Can I compare multiple patients' results?",
    a: "Yes. Go to Compare Results in the sidebar. Select up to 4 patients to view side-by-side score comparisons across all psychometric dimensions.",
  },
  {
    q: "How do I download a patient's report?",
    a: "Open Results & Reports, find the relevant result row, and click the download icon. Reports are exported as PDF.",
  },
  {
    q: "How is the risk level calculated?",
    a: "Risk levels (Low / Moderate / High) are automatically calculated based on the patient's raw scores relative to clinical thresholds defined for each assessment type.",
  },
  {
    q: "Can patients retake an assessment?",
    a: "Yes. From the Patients page, open the patient record and select Re-assign Assessment. Previous results are preserved in the history.",
  },
  {
    q: "How do I add a new patient?",
    a: "Click Add New Patient on the Patients page, fill in their details and contact information, and optionally assign an assessment immediately.",
  },
  {
    q: "Is my data secure?",
    a: "All patient data is encrypted at rest and in transit. We comply with HIPAA guidelines and conduct regular security audits.",
  },
]

const guides = [
  { title: "Getting Started Guide",           icon: BookOpen, desc: "Learn the basics of the Doctor Portal in 5 minutes."    },
  { title: "Assigning Assessments",           icon: BookOpen, desc: "Step-by-step guide to assigning and tracking tests."    },
  { title: "Understanding Reports",           icon: BookOpen, desc: "How to interpret psychometric scores and risk levels."  },
  { title: "Comparing Patient Results",       icon: BookOpen, desc: "Use the compare tool to spot patterns across patients." },
]

export default function HelpSupportPage() {
  const [search, setSearch]   = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Header */}
          <div>
            <h1 className="text-xl font-extrabold text-gray-800">Help & Support</h1>
            <p className="text-sm text-gray-500 mt-0.5">Find answers, guides and contact our support team.</p>
          </div>

          {/* Search banner */}
          <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-500 px-8 py-8 flex flex-col items-center text-center space-y-3">
            <h2 className="text-xl font-extrabold text-white">How can we help you?</h2>
            <p className="text-teal-100 text-sm">Search our knowledge base or browse the guides below.</p>
            <div className="relative w-full max-w-lg mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs and guides..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* FAQs (2/3) */}
            <div className="col-span-2 space-y-5">
              {/* FAQ accordion */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">Frequently Asked Questions</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {filtered.map((faq, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaq === i && (
                        <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="px-6 py-8 text-center text-sm text-gray-400">
                      No results found for &ldquo;{search}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Guides */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 text-sm mb-4">User Guides</h3>
                <div className="grid grid-cols-2 gap-3">
                  {guides.map((g, i) => (
                    <button key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-teal-50/30 transition-all text-left">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                        <g.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{g.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{g.desc}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 ml-auto flex-shrink-0 mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact (1/3) */}
            <div className="space-y-5">
              {/* Contact options */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">Contact Support</h3>
                {[
                  { icon: MessageCircle, label: "Live Chat",      desc: "Chat with us now",              action: "Start Chat",     color: "text-teal-600 bg-teal-50"  },
                  { icon: Mail,          label: "Email Support",   desc: "support@psychometrics.in",      action: "Send Email",     color: "text-blue-600 bg-blue-50"  },
                  { icon: Phone,         label: "Phone Support",   desc: "+91 1800-PSYCHO (Mon–Fri 9–6)", action: "Call Now",       color: "text-amber-600 bg-amber-50" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-gray-50 transition-all">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.color}`}>
                      <c.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{c.label}</p>
                      <p className="text-[11px] text-gray-500 truncate">{c.desc}</p>
                    </div>
                    <button className="text-primary text-xs font-semibold hover:underline flex-shrink-0 flex items-center gap-0.5">
                      {c.action} <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Status card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm">System Status</h3>
                {[
                  { name: "Portal",           status: "Operational" },
                  { name: "Assessments API",  status: "Operational" },
                  { name: "Report Generator", status: "Operational" },
                  { name: "Notifications",    status: "Operational" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{s.name}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                      <CheckCircle2 className="w-3 h-3" /> {s.status}
                    </span>
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
