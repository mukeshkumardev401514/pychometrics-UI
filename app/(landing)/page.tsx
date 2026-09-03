import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Shield, FileText, Globe, CheckCircle, Lock, Globe2, Facebook, Linkedin, Twitter, Instagram } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-primary tracking-widest uppercase">Psychometrics</p>
              <p className="text-xs font-bold text-primary tracking-widest uppercase">+ Evaluation</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="text-primary border-b-2 border-primary pb-0.5">Home</a>
            <a href="#" className="hover:text-primary transition-colors">About Us</a>
            <a href="#" className="hover:text-primary transition-colors">Assessments</a>
            <a href="#" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#" className="hover:text-primary transition-colors">Resources</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-5">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white px-5">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-white via-teal-50/40 to-cyan-50/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left Text */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Understand Yourself.<br />
              Unlock Your{" "}
              <span className="text-primary">Potential.</span>
            </h1>
            <p className="text-gray-500 text-base max-w-md leading-relaxed">
              A scientifically designed psychometric evaluation platform that helps you discover your strengths,
              understand your personality and make better decisions for your future.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white px-7 py-3 text-sm font-semibold rounded-lg">
                  Start Assessment →
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-primary hover:text-primary px-7 py-3 text-sm font-semibold rounded-lg">
                Learn More
              </Button>
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-2 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> Scientifically Validated</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> Secure &amp; Confidential</span>
              <span className="flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-primary" /> Trusted Worldwide</span>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-80 h-80">
              {/* Decorative wave background */}
              <svg viewBox="0 0 320 320" className="absolute inset-0 w-full h-full" fill="none">
                <ellipse cx="160" cy="280" rx="160" ry="40" fill="#e0f7f7" opacity="0.7" />
                <ellipse cx="160" cy="300" rx="130" ry="30" fill="#b2ebf2" opacity="0.5" />
              </svg>
              {/* Brain silhouette */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-gradient-to-br from-teal-700 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Brain className="w-24 h-24 text-white opacity-90" />
                </div>
              </div>
              {/* Floating icons */}
              <div className="absolute top-8 right-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-teal-100">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute top-20 left-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-teal-100">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute bottom-24 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-teal-100">
                <Globe className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Section ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800">Why Choose Psychometrics Evaluation?</h2>
            <div className="w-12 h-1 bg-primary mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "In-Depth Insights",
                desc: "Gain deep insights into your personality traits, cognitive abilities and work preferences.",
              },
              {
                icon: Shield,
                title: "Scientifically Designed",
                desc: "Our assessments are created by experts and based on global psychometric standards.",
              },
              {
                icon: FileText,
                title: "Personalized Reports",
                desc: "Receive detailed reports with actionable recommendations for your growth.",
              },
              {
                icon: Globe,
                title: "Global Recognition",
                desc: "Trusted by educational institutions, organizations and professionals worldwide.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-primary/20 transition-all text-center space-y-3"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "500K+", label: "Assessments Completed" },
              { value: "200+", label: "Organizations Trust Us" },
              { value: "50+",  label: "Countries Reached" },
              { value: "98%",  label: "User Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-primary tracking-widest uppercase">Psychometrics</p>
                  <p className="text-xs font-bold text-primary tracking-widest uppercase">+ Evaluation</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Empowering individuals and organizations through scientifically designed assessments.
              </p>
              <div className="flex gap-3">
                {[Facebook, Linkedin, Twitter, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Quick Links</h4>
              {["Home", "About Us", "Assessments", "How It Works", "Resources", "Contact"].map((l) => (
                <a key={l} href="#" className="block text-xs text-gray-400 hover:text-primary transition-colors">{l}</a>
              ))}
            </div>

            {/* Assessments */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Assessments</h4>
              {["Personality Assessment", "Cognitive Ability", "Situational Judgment", "Work Preferences", "Leadership Assessment"].map((l) => (
                <a key={l} href="#" className="block text-xs text-gray-400 hover:text-primary transition-colors">{l}</a>
              ))}
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Support</h4>
              {["Help Center", "FAQ", "Privacy Policy", "Terms of Use", "Contact Us"].map((l) => (
                <a key={l} href="#" className="block text-xs text-gray-400 hover:text-primary transition-colors">{l}</a>
              ))}
            </div>

            {/* Secure & Compliant */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Secure &amp; Compliant</h4>
              <div className="w-20 h-20 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-center border border-gray-700 p-2">
                <p className="text-primary font-bold text-xs">ISO</p>
                <p className="text-primary font-bold text-lg leading-none">27001</p>
                <p className="text-gray-400 text-xs mt-1">Certified</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Your data is safe and encrypted</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © 2024 Psychometrics Evaluation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
