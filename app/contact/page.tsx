"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import SiteNavbar from "@/components/site-navbar"
import SiteFooter from "@/components/site-footer"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@psychometricseval.com", "enterprise@psychometricseval.com"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+1 (800) 123-4567", "Mon – Fri, 9 AM – 6 PM EST"],
  },
  {
    icon: MapPin,
    title: "Our Office",
    lines: ["123 Assessment Avenue", "San Francisco, CA 94105, USA"],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Monday – Friday: 9 AM – 6 PM EST", "Saturday: 10 AM – 2 PM EST"],
  },
]

const subjects = [
  "General Inquiry",
  "Enterprise / Bulk Assessments",
  "Technical Support",
  "Billing & Payments",
  "Partnership Opportunity",
  "Media / Press",
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNavbar activePage="contact" />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-white via-teal-50/40 to-cyan-50/60 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-5">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            We&apos;d Love to <span className="text-primary">Hear From You</span>
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Have a question, need enterprise support, or want to partner with us?
            Our team is here to help — reach out and we&apos;ll get back to you within one business day.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all space-y-3 text-center">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                {item.lines.map((line, j) => (
                  <p key={j} className="text-gray-500 text-xs leading-relaxed">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                <p className="text-gray-500 text-sm mt-1">Fill out the form and we&apos;ll respond within 24 hours.</p>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Message Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Thank you for reaching out. Our team will get back to you within one business day.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-400">*</span></label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-400">*</span></label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Subject <span className="text-red-400">*</span></label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all text-gray-700"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Message <span className="text-red-400">*</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Right side — FAQ + extra info */}
            <div className="space-y-6">
              {/* Quick FAQs */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
                <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
                {[
                  {
                    q: "How long does an assessment take?",
                    a: "Most assessments take between 20 – 45 minutes depending on the type selected. You can pause and resume at any time.",
                  },
                  {
                    q: "Is my data kept private?",
                    a: "Absolutely. We are ISO 27001 certified. Your data is encrypted at rest and in transit and is never sold to third parties.",
                  },
                  {
                    q: "Do you offer enterprise / bulk pricing?",
                    a: "Yes. We have tailored plans for organizations of all sizes. Contact us via the form and our enterprise team will reach out within 24 hours.",
                  },
                  {
                    q: "Can I retake an assessment?",
                    a: "Yes. We recommend waiting at least 6 months between retakes to allow meaningful personal development to occur.",
                  },
                  {
                    q: "What languages are supported?",
                    a: "Our platform currently supports 18 languages including English, Spanish, French, German, Arabic, Hindi, and Mandarin.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{faq.q}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Enterprise CTA */}
              <div className="bg-primary rounded-2xl p-8 space-y-4 text-white">
                <h3 className="text-lg font-bold">Need Enterprise Support?</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  We offer dedicated account managers, custom assessment design, and volume pricing for teams of 10 or more.
                </p>
                <ul className="space-y-2 text-sm text-white/90">
                  {[
                    "Custom branding & white-labelling",
                    "Dedicated account manager",
                    "API integration support",
                    "Volume discounts from 10+ seats",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
