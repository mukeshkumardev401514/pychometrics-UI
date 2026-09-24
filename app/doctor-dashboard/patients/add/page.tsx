"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar,
  ClipboardList, ChevronDown, CheckCircle2, Upload,
} from "lucide-react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorTopBar from "@/components/doctor-topbar"
import { apiClient } from "@/lib/api-client"

type Step = 1 | 2 | 3

const STEPS = [
  { n: 1, label: "Personal Info"     },
  { n: 2, label: "Medical Details"  },
  { n: 3, label: "Assign Assessment" },
]

const assessmentOptions = [
  "Personality & Stress Assessment",
  "Anxiety Assessment",
  "Career Orientation Test",
  "Depression Screening",
  "Workplace Wellbeing",
  "Emotional Intelligence",
]

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done    = s.n < current
        const active  = s.n === current
        return (
          <div key={s.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${done   ? "bg-primary border-primary text-white"
                : active ? "border-primary text-primary bg-white"
                :          "border-gray-200 text-gray-400 bg-white"}`}>
                {done ? <CheckCircle2 className="w-5 h-5" /> : s.n}
              </div>
              <span className={`text-[11px] font-semibold whitespace-nowrap
                ${active ? "text-primary" : done ? "text-primary" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-600 mb-1.5">{children}</label>
}

function Input({ placeholder, type = "text", value, onChange }: {
  placeholder: string; type?: string; value: string; onChange: (v: string) => void
}) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
    />
  )
}

function Select({ options, value, onChange, placeholder }: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div className="relative">
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 pr-8 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none transition-colors"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default function AddPatientPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)

  /* ── Step 1 state ── */
  const [firstName,   setFirstName]   = useState("")
  const [lastName,    setLastName]    = useState("")
  const [dob,         setDob]         = useState("")
  const [gender,      setGender]      = useState("")
  const [phone,       setPhone]       = useState("")
  const [email,       setEmail]       = useState("")
  const [patientCode, setPatientCode] = useState("")
  const [password,    setPassword]    = useState("")
  const [address,     setAddress]     = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [country,     setCountry]     = useState("India")
  const [city,        setCity]        = useState("")
  const [state,       setState]       = useState("")
  const [pincode,     setPincode]     = useState("")

  /* ── Step 2 state ── */
  const [primaryConcern,   setPrimaryConcern]   = useState("")
  const [referredBy,       setReferredBy]       = useState("")
  const [medHistory,       setMedHistory]       = useState("")
  const [medications,      setMedications]      = useState("")
  const [emergencyName,    setEmergencyName]    = useState("")
  const [emergencyPhone,   setEmergencyPhone]   = useState("")
  const [emergencyRelation,setEmergencyRelation]= useState("")
  const [notes,            setNotes]            = useState("")

  /* ── Step 3 state ── */
  const [selectedAssessment, setSelectedAssessment] = useState("")
  const [dueDate,            setDueDate]            = useState("")
  const [priority,           setPriority]           = useState("")
  const [assignNotes,        setAssignNotes]        = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setSaving(true)
    setError("")

    try {
      await apiClient.post("/api/external/patients", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        mobile: phone,
        patient_code: patientCode,
        date_of_birth: dob,
        gender: gender.toUpperCase(),
        address_line1: address,
        address_line2: addressLine2,
        city,
        state,
        postal_code: pincode,
        country,
        emergency_contact_name: emergencyName,
        emergency_contact_mobile: emergencyPhone,
        emergency_contact_relation: emergencyRelation,
        notes: notes || assignNotes,
      })

      router.push("/doctor-dashboard/patients")
    } catch (submissionError: unknown) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to create patient",
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBar />
        <main className="flex-1 overflow-y-auto p-6">

          {/* Back + title */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/doctor-dashboard/patients"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Add New Patient</h1>
              <p className="text-sm text-gray-500">Fill in the details below to register a new patient.</p>
            </div>
          </div>

          {/* Card */}
          <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <StepIndicator current={step} />

            {error && (
              <p className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-gray-800">Personal Information</h2>
                </div>

                {/* Avatar upload */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-[10px] text-gray-400 mt-1">Photo</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p className="font-medium text-gray-700">Upload patient photo</p>
                    <p>JPG, PNG up to 5MB</p>
                    <button className="text-primary font-semibold hover:underline">Browse file</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Patient Code *</FieldLabel>
                    <Input placeholder="e.g. PAT-001100" value={patientCode} onChange={setPatientCode} />
                  </div>
                  <div>
                    <FieldLabel>Login Password *</FieldLabel>
                    <Input placeholder="Patient login password" type="password" value={password} onChange={setPassword} />
                  </div>
                  <div>
                    <FieldLabel>First Name *</FieldLabel>
                    <Input placeholder="e.g. Amit" value={firstName} onChange={setFirstName} />
                  </div>
                  <div>
                    <FieldLabel>Last Name *</FieldLabel>
                    <Input placeholder="e.g. Kumar" value={lastName} onChange={setLastName} />
                  </div>
                  <div>
                    <FieldLabel>Date of Birth *</FieldLabel>
                    <Input placeholder="DD/MM/YYYY" type="date" value={dob} onChange={setDob} />
                  </div>
                  <div>
                    <FieldLabel>Gender *</FieldLabel>
                    <Select options={["Male","Female","Non-binary","Prefer not to say"]} value={gender} onChange={setGender} placeholder="Select gender" />
                  </div>
                  <div>
                    <FieldLabel>Phone Number *</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Email Address</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@email.com"
                        className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                  </div>
                </div>

                <div>
                  <FieldLabel>Address Line 1</FieldLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, apartment, building..."
                      rows={2}
                      className="w-full pl-9 pr-3 pt-2.5 pb-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Address Line 2</FieldLabel>
                  <Input placeholder="Street, area, landmark..." value={addressLine2} onChange={setAddressLine2} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <Input placeholder="e.g. Mumbai" value={city} onChange={setCity} />
                  </div>
                  <div>
                    <FieldLabel>State</FieldLabel>
                    <Select options={["Maharashtra","Delhi","Karnataka","Tamil Nadu","Gujarat","Rajasthan","Uttar Pradesh","West Bengal"]}
                      value={state} onChange={setState} placeholder="Select state" />
                  </div>
                  <div>
                    <FieldLabel>PIN Code</FieldLabel>
                    <Input placeholder="400001" value={pincode} onChange={setPincode} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Country</FieldLabel>
                  <Input placeholder="e.g. India" value={country} onChange={setCountry} />
                </div>
              </div>
            )}

            {/* ── STEP 2: Medical Details ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-gray-800">Medical Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Primary Concern *</FieldLabel>
                    <Select
                      options={["Anxiety","Depression","Stress","Career Guidance","Relationship Issues","Workplace Issues","Other"]}
                      value={primaryConcern} onChange={setPrimaryConcern} placeholder="Select concern"
                    />
                  </div>
                  <div>
                    <FieldLabel>Referred By</FieldLabel>
                    <Select
                      options={["Self-referred","GP / Family Doctor","Psychiatrist","HR / Employer","School / College","Other"]}
                      value={referredBy} onChange={setReferredBy} placeholder="Select referral source"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Medical History</FieldLabel>
                  <textarea value={medHistory} onChange={(e) => setMedHistory(e.target.value)}
                    placeholder="Any relevant medical conditions, diagnoses, hospitalizations..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                  />
                </div>

                <div>
                  <FieldLabel>Current Medications</FieldLabel>
                  <textarea value={medications} onChange={(e) => setMedications(e.target.value)}
                    placeholder="List any medications the patient is currently taking..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 mb-3">Emergency Contact</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <FieldLabel>Contact Name</FieldLabel>
                      <Input placeholder="Full name" value={emergencyName} onChange={setEmergencyName} />
                    </div>
                    <div>
                      <FieldLabel>Phone Number</FieldLabel>
                      <Input placeholder="+91 XXXXX XXXXX" value={emergencyPhone} onChange={setEmergencyPhone} />
                    </div>
                    <div>
                      <FieldLabel>Relationship</FieldLabel>
                      <Select
                        options={["Spouse","Parent","Sibling","Child","Friend","Other"]}
                        value={emergencyRelation} onChange={setEmergencyRelation} placeholder="Select"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <FieldLabel>Additional Notes</FieldLabel>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes for this patient..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: Assign Assessment ── */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-bold text-gray-800">Assign Assessment <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
                </div>

                {/* Assessment cards */}
                <div className="grid grid-cols-2 gap-3">
                  {assessmentOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedAssessment(opt === selectedAssessment ? "" : opt)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                        ${selectedAssessment === opt
                          ? "border-primary bg-teal-50"
                          : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${selectedAssessment === opt ? "border-primary" : "border-gray-300"}`}>
                        {selectedAssessment === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className={`text-sm font-medium ${selectedAssessment === opt ? "text-primary" : "text-gray-700"}`}>
                        {opt}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedAssessment && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <FieldLabel>Due Date</FieldLabel>
                      <Input placeholder="" type="date" value={dueDate} onChange={setDueDate} />
                    </div>
                    <div>
                      <FieldLabel>Priority</FieldLabel>
                      <Select options={["Low","Normal","High","Urgent"]} value={priority} onChange={setPriority} placeholder="Select priority" />
                    </div>
                    <div className="col-span-2">
                      <FieldLabel>Notes to Patient</FieldLabel>
                      <textarea value={assignNotes} onChange={(e) => setAssignNotes(e.target.value)}
                        placeholder="Instructions or context for the patient..."
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Summary preview */}
                <div className="bg-teal-50 rounded-xl border border-teal-100 p-4 space-y-2">
                  <p className="text-xs font-bold text-teal-700">Patient Summary</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold text-gray-800">{firstName} {lastName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Gender</span><span className="font-semibold text-gray-800">{gender || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-semibold text-gray-800">{phone || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Concern</span><span className="font-semibold text-gray-800">{primaryConcern || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Assessment</span><span className="font-semibold text-gray-800">{selectedAssessment || "None"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Due Date</span><span className="font-semibold text-gray-800">{dueDate || "—"}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : router.push("/doctor-dashboard/patients")}
                className="flex items-center gap-2 h-10 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {step === 1 ? "Cancel" : "Back"}
              </button>

              <div className="flex items-center gap-2">
                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    className="flex items-center gap-2 h-10 px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 h-10 px-6 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Patient"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
