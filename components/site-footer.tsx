import Link from "next/link"
import Image from "next/image"
import { Lock, Facebook, Linkedin, Twitter, Instagram } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <div className="inline-block bg-white rounded-lg px-3 py-2">
              <Image
                src="/psychometrics_evaluation_ui_assets/logo/psychometrics-evaluation-logo.png"
                alt="Psychometrics Evaluation"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
              />
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
            {[
              { label: "Home",         href: "/" },
              { label: "About Us",     href: "/about" },
              { label: "Assessments",  href: "#" },
              { label: "How It Works", href: "#" },
              { label: "Resources",    href: "#" },
              { label: "Contact",      href: "/contact" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="block text-xs text-gray-400 hover:text-primary transition-colors">
                {l.label}
              </Link>
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
            {[
              { label: "Help Center",    href: "#" },
              { label: "FAQ",            href: "#" },
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Use",   href: "#" },
              { label: "Contact Us",     href: "/contact" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="block text-xs text-gray-400 hover:text-primary transition-colors">
                {l.label}
              </Link>
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
  )
}
