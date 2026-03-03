"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  FileEdit,
  ArrowLeft,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { t, type TranslationKey } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

type View = "overview" | "tours" | "bookings" | "content"

interface DashboardSidebarProps {
  activeView: View
  onViewChange: (view: View) => void
}

const navItems: { labelKey: TranslationKey; icon: typeof LayoutDashboard; view: View }[] = [
  { labelKey: "overview", icon: LayoutDashboard, view: "overview" },
  { labelKey: "tourManager", icon: Map, view: "tours" },
  { labelKey: "bookings", icon: CalendarCheck, view: "bookings" },
  { labelKey: "contentEditor", icon: FileEdit, view: "content" },
]

export function DashboardSidebar({ activeView, onViewChange }: DashboardSidebarProps) {
  const router = useRouter()
  const { locale } = useLanguage()

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch {
      console.error("Logout failed")
    }
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 gradient-sunset z-40 flex flex-col">
      {/* Glass overlay */}
      <div className="absolute inset-0 glass pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 pb-2">
          <span
            className="text-xl tracking-tight text-white/90"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Dar Voyages
          </span>
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-white/40 mt-1">
            {t(locale, "adminDashboard")}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeView === item.view
              return (
                <li key={item.view}>
                  <button
                    onClick={() => onViewChange(item.view)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm transition-all ${
                      isActive
                        ? "bg-white/15 text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {t(locale, item.labelKey)}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(locale, "viewPublicSite")}
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all font-sans text-sm">
            <Settings className="w-4 h-4" />
            {t(locale, "settings")}
          </button>
          <LanguageSwitcher variant="dark" />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/8 transition-all font-sans text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t(locale, "signOut")}
          </button>
        </div>
      </div>
    </aside>
  )
}
