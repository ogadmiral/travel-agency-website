"use client"

import { useState, useRef, useEffect } from "react"
import { Globe } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { locales, localeNames, type Locale } from "@/lib/i18n"

interface LanguageSwitcherProps {
  variant?: "light" | "dark"
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isDark = variant === "dark"

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans transition-colors ${
          isDark
            ? "text-white/60 hover:text-white hover:bg-white/8"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-xs tracking-wider">{locale}</span>
      </button>

      {open && (
        <div
          className={`absolute bottom-full mb-1 rounded-lg shadow-xl border overflow-hidden z-[100] min-w-[140px] ${
            isDark
              ? "bg-midnight border-white/10"
              : "bg-card border-border"
          }`}
          style={{ [document.documentElement.dir === "rtl" ? "right" : "left"]: 0 }}
        >
          {locales.map((l: Locale) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false) }}
              className={`w-full text-start px-4 py-2.5 text-sm font-sans transition-colors flex items-center justify-between ${
                locale === l
                  ? isDark
                    ? "bg-white/10 text-white"
                    : "bg-terracotta/10 text-terracotta"
                  : isDark
                    ? "text-white/60 hover:bg-white/5 hover:text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{localeNames[l]}</span>
              {locale === l && <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
