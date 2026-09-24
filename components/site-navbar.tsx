import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface SiteNavbarProps {
  activePage?: "home" | "about" | "contact" | "doctor-dashboard"
}

export default function SiteNavbar({ activePage }: SiteNavbarProps) {
  const links = [
    { label: "Home",         href: "/" },
    { label: "About Us",     href: "/about" },
    { label: "Assessments",  href: "#" },
    { label: "How It Works", href: "#" },
    { label: "Resources",    href: "#" },
    { label: "Contact",      href: "/contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/psychometrics_evaluation_ui_assets/logo/psychometrics-evaluation-logo.png"
            alt="Psychometrics Evaluation"
            width={320}
            height={90}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {links.map((l) => {
            const isActive =
              (activePage === "home"              && l.href === "/") ||
              (activePage === "about"             && l.href === "/about") ||
              (activePage === "contact"           && l.href === "/contact") ||
              (activePage === "doctor-dashboard"  && l.href === "/doctor-dashboard")
            return (
              <Link
                key={l.label}
                href={l.href}
                className={isActive
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "hover:text-primary transition-colors"}
              >
                {l.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-5">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
