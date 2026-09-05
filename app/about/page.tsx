import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Award, Globe2, Target, Eye, Heart } from "lucide-react"
import SiteNavbar from "@/components/site-navbar"
import SiteFooter from "@/components/site-footer"

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Chief Psychologist & Co-Founder",
    bio: "PhD in Clinical Psychology from Stanford. 15+ years designing evidence-based psychometric assessments for Fortune 500 companies.",
  },
  {
    name: "James Patel",
    role: "CEO & Co-Founder",
    bio: "Former McKinsey consultant with deep expertise in organizational psychology and talent development across 30+ countries.",
  },
  {
    name: "Dr. Anika Verma",
    role: "Head of Assessment Science",
    bio: "Specializes in cognitive ability testing and personality frameworks. Published researcher with 40+ peer-reviewed papers.",
  },
  {
    name: "Marcus Chen",
    role: "Chief Technology Officer",
    bio: "Built large-scale assessment platforms serving millions of users. Previously led engineering at two successful HR-tech startups.",
  },
  {
    name: "Dr. Fatima Al-Hassan",
    role: "Director of Research",
    bio: "Cross-cultural psychometrics expert ensuring our assessments are valid and unbiased across diverse global populations.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Client Success",
    bio: "10+ years helping organizations implement psychometric programs that drive measurable improvements in hiring and development.",
  },
]

const milestones = [
  { year: "2015", event: "Founded in San Francisco with a mission to democratize psychometric science." },
  { year: "2017", event: "Launched first AI-powered adaptive assessment engine, serving 50+ enterprise clients." },
  { year: "2019", event: "Reached 1 million assessments completed. Expanded to 25 countries." },
  { year: "2021", event: "Achieved ISO 27001 certification. Launched multi-language platform in 18 languages." },
  { year: "2023", event: "500K+ assessments per year. Trusted by 200+ organizations across 50+ countries." },
  { year: "2024", event: "Launched next-generation personalized report engine with actionable AI-driven insights." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNavbar activePage="about" />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-white via-teal-50/40 to-cyan-50/60 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-primary font-semibold text-sm uppercase tracking-widest">About Us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Science Meets <span className="text-primary">Self-Discovery</span>
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            We are a team of psychologists, researchers, and technologists on a shared mission —
            to make rigorous psychometric science accessible to every individual and organization worldwide.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold rounded-lg">
                Start Your Assessment
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 font-semibold rounded-lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "500K+", label: "Assessments Completed" },
              { value: "200+",  label: "Organizations Trust Us" },
              { value: "50+",   label: "Countries Reached" },
              { value: "98%",   label: "User Satisfaction" },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-sm text-white/80 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                color: "bg-teal-50",
                text: "To empower individuals and organizations with scientifically validated psychometric tools that reveal true potential, improve decision-making, and drive personal and professional growth.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                color: "bg-cyan-50",
                text: "A world where every person has access to objective, science-backed self-knowledge — enabling better career choices, stronger teams, and more fulfilling lives.",
              },
              {
                icon: Heart,
                title: "Our Values",
                color: "bg-teal-50",
                text: "Scientific rigor, radical inclusivity, user privacy, and a relentless commitment to delivering real, measurable impact in every assessment we create.",
              },
            ].map((item, i) => (
              <div key={i} className={`${item.color} rounded-2xl p-8 space-y-4`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story / Timeline ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
            <div className="w-12 h-1 bg-primary mx-auto mt-3 rounded-full" />
            <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">
              From a small research lab to a globally trusted assessment platform — here&apos;s how we got here.
            </p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md z-10">
                    <span className="text-white text-xs font-bold">{m.year}</span>
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-primary mb-1">{m.year}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why We Are Different ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why We Are Different</h2>
            <div className="w-12 h-1 bg-primary mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle, title: "Evidence-Based",         desc: "Every assessment is built on peer-reviewed research and validated against real-world outcomes — not trends." },
              { icon: Users,       title: "Human-Centered Design",  desc: "We design for people first. Our interfaces are intuitive, respectful, and free from unnecessary complexity." },
              { icon: Globe2,      title: "Globally Validated",     desc: "Our tools are tested across cultures, languages, and geographies to ensure fairness and accuracy worldwide." },
              { icon: Award,       title: "Expert Team",            desc: "Our assessments are crafted by certified psychologists with decades of combined research and applied experience." },
              { icon: CheckCircle, title: "Privacy First",          desc: "ISO 27001 certified. Your data is encrypted, never sold, and always under your control." },
              { icon: Target,      title: "Actionable Insights",    desc: "We go beyond scores — every report includes clear, personalised recommendations you can act on immediately." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all space-y-3">
                <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
            <div className="w-12 h-1 bg-primary mx-auto mt-3 rounded-full" />
            <p className="text-gray-500 text-sm mt-4 max-w-xl mx-auto">
              A diverse group of scientists, engineers, and practitioners united by a passion for human potential.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all space-y-3">
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-cyan-400 flex items-center justify-center text-white text-xl font-bold">
                  {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{member.name}</h3>
                  <p className="text-primary text-xs font-medium mt-0.5">{member.role}</p>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
          <h2 className="text-3xl font-bold text-white">Ready to Unlock Your Potential?</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Join 500,000+ individuals and 200+ organizations already discovering their strengths with Psychometrics Evaluation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/register">
              <Button className="bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg">
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3 rounded-lg">
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
