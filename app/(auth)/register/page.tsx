"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { registerPatientJson, buildRegistrationFormData, registerPatient, USER_ROLE } from "@/lib/auth-service"
import { apiFetch } from "@/lib/backend-api"

interface Hospital {
  id: string
  hospital_name: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
      setError("Please fill in all required fields")
      return
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match")
      return
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms of Use and Privacy Policy")
      return
    }

    setLoading(true)
    try {
      const [firstName, ...rest] = formData.full_name.trim().split(" ")
      const lastName = rest.join(" ")
      const response = await registerPatientJson({
        first_name: firstName,
        last_name: lastName,
        username: formData.email,
        role_id: 1,
        gender: "",
        age: 0,
        country_id: 1,
        phone: "",
        email: formData.email.trim(),
        address: "",
        password: formData.password,
        confirm_password: formData.confirm_password,
      })
      if (response.message?.toLowerCase().includes("success")) {
        router.push("/login")
      } else {
        setError(response.message || "Registration failed")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">

      {/* ── Left Illustration Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 flex-col items-center justify-center relative overflow-hidden p-12">
        {/* Logo */}
        <div className="absolute top-8 left-8 bg-white rounded-lg px-3 py-2">
          <Image
            src="/psychometrics_evaluation_ui_assets/logo/psychometrics-evaluation-logo.png"
            alt="Psychometrics Evaluation"
            width={160}
            height={44}
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* Decorative waves */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 500 80" preserveAspectRatio="none" fill="none">
          <path d="M0 40 Q125 0 250 40 Q375 80 500 40 L500 80 L0 80 Z" fill="white" fillOpacity="0.08" />
          <path d="M0 55 Q125 20 250 55 Q375 90 500 55 L500 80 L0 80 Z" fill="white" fillOpacity="0.06" />
        </svg>

        {/* Central illustration */}
        <div className="flex flex-col items-center text-center space-y-6 z-10">
          <Image
            src="/psychometrics_evaluation_ui_assets/illustrations/signup-profile-shield.png"
            alt="Sign up illustration"
            width={280}
            height={280}
            className="w-64 h-64 object-contain drop-shadow-xl"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
            <p className="text-white/70 text-sm max-w-xs leading-relaxed">
              Join thousands of individuals and organizations unlocking their potential.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 px-6 pt-6">
          <Image
            src="/psychometrics_evaluation_ui_assets/logo/psychometrics-evaluation-logo.png"
            alt="Psychometrics Evaluation"
            width={200}
            height={58}
            className="h-14 w-auto object-contain"
          />
        </div>

        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="w-full h-11 pl-10 pr-8 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="w-full h-11 pl-10 pr-8 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 accent-primary"
                />
                <span className="text-xs text-gray-500">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Terms of Use</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-sm"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 h-11 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 h-11 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                Microsoft
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
