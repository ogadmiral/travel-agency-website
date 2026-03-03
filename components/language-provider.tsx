"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, localeDir } from "@/lib/i18n"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  dir: "ltr",
})

const STORAGE_KEY = "dar-voyages-locale"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  // Load saved locale on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "en" || saved === "fr" || saved === "ar") {
      setLocaleState(saved)
    }
  }, [])

  // Update html dir + lang attributes when locale changes
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = localeDir[locale]
  }, [locale])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir: localeDir[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
