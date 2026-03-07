"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, MapPin, Compass, Phone, Calendar, Home } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { t, type TranslationKey } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SiteLogo } from "@/components/site-logo"

const navItems = [
  { labelKey: "home" as TranslationKey, href: "#hero", icon: Home },
  { labelKey: "experiences" as TranslationKey, href: "#experiences", icon: Compass },
  { labelKey: "about" as TranslationKey, href: "#about", icon: Calendar },
  { labelKey: "contact" as TranslationKey, href: "#contact", icon: Phone },
]

export function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { locale } = useLanguage()
  const [logoData, setLogoData] = useState({ logoImage: "", logoWidth: 160, siteName: "" })

  const fetchLogo = useCallback(async () => {
    try {
      const res = await fetch("/api/content")
      const data = await res.json()
      setLogoData({ logoImage: data.logoImage || "", logoWidth: data.logoWidth || 160, siteName: data.siteName || "" })
    } catch {}
  }, [])

  useEffect(() => { fetchLogo() }, [fetchLogo])

  return (
    <>
      {/* Docked side trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 bg-midnight text-primary-foreground px-3 py-4 rounded-r-lg hover:px-5 transition-all duration-300 group"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
        <span className="text-xs font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {t(locale, "menu")}
        </span>
      </button>

      {/* Mega menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-midnight/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-md z-50 bg-midnight text-primary-foreground flex flex-col"
            >
              <div className="flex items-center justify-between p-8">
                <SiteLogo logoImage={logoData.logoImage} logoWidth={logoData.logoWidth} siteName={logoData.siteName} textClassName="text-2xl" variant="accent" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-8">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.labelKey}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="group flex items-center gap-6 py-5 border-b border-white/10 last:border-0"
                  >
                    <item.icon className="w-5 h-5 text-sunset-orange opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span
                      className="text-3xl lg:text-4xl font-serif tracking-tight group-hover:text-sunset-orange transition-colors"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {t(locale, item.labelKey)}
                    </span>
                  </motion.a>
                ))}
              </div>

              <div className="p-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-white/40 font-sans uppercase tracking-widest">{t(locale, "followUs")}</p>
                  <LanguageSwitcher variant="dark" />
                </div>
                <div className="flex gap-6 text-sm text-white/60">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-sunset-orange transition-colors cursor-pointer">Facebook</a>
                  <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-sunset-orange transition-colors cursor-pointer">Pinterest</a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-sunset-orange transition-colors cursor-pointer">LinkedIn</a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
