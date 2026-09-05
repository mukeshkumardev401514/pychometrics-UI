import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, Globe2 } from "lucide-react"
import SiteNavbar from "@/components/site-navbar"
import SiteFooter from "@/components/site-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNavbar activePage="home" />

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
              <Link href="/about">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-primary hover:text-primary px-7 py-3 text-sm font-semibold rounded-lg">
                  Learn More
                </Button>
              </Link>
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
            <Image
              src="/psychometrics_evaluation_ui_assets/illustrations/hero-brain-medical.png"
              alt="Brain medical illustration"
              width={480}
              height={480}
              className="w-full max-w-sm md:max-w-lg object-contain drop-shadow-xl"
              priority
            />
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
                icon: "/psychometrics_evaluation_ui_assets/icons/in-depth-insights.png",
                title: "In-Depth Insights",
                desc: "Gain deep insights into your personality traits, cognitive abilities and work preferences.",
              },
              {
                icon: "/psychometrics_evaluation_ui_assets/icons/scientifically-designed.png",
                title: "Scientifically Designed",
                desc: "Our assessments are created by experts and based on global psychometric standards.",
              },
              {
                icon: "/psychometrics_evaluation_ui_assets/icons/personalized-reports.png",
                title: "Personalized Reports",
                desc: "Receive detailed reports with actionable recommendations for your growth.",
              },
              {
                icon: "/psychometrics_evaluation_ui_assets/icons/global-recognition.png",
                title: "Global Recognition",
                desc: "Trusted by educational institutions, organizations and professionals worldwide.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-primary/20 transition-all text-center space-y-3"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                  <Image src={item.icon} alt={item.title} width={36} height={36} className="w-9 h-9 object-contain" />
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

      <SiteFooter />
    </div>
  )
}
