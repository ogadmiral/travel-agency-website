"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/i18n"
import { SiteLogo } from "@/components/site-logo"

interface SiteContent {
  contactEmail: string
  newsletterText: string
  logoImage: string
  logoWidth: number
  siteName: string
  footerDescription: string
  copyrightText: string
}

export function Footer() {
  const { locale } = useLanguage()
  const [content, setContent] = useState<SiteContent>({
    contactEmail: "",
    newsletterText: "Receive curated travel stories and exclusive offers.",
    logoImage: "",
    logoWidth: 160,
    siteName: "",
    footerDescription: "",
    copyrightText: "",
  })
  const [subscribed, setSubscribed] = useState(false)

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content")
      const data = await res.json()
      setContent({ contactEmail: data.contactEmail, newsletterText: data.newsletterText, logoImage: data.logoImage || "", logoWidth: data.logoWidth || 160, siteName: data.siteName || "", footerDescription: data.footerDescription || "", copyrightText: data.copyrightText || "" })
    } catch {
      // fallback to defaults
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: formData.get("email"),
          message: "Newsletter subscription",
          source: "floating",
        }),
      })
      setSubscribed(true)
    } catch {
      // silent fail
    }
  }

  return (
    <footer className="bg-foreground text-sand py-16 lg:py-20">
      <div className="px-6 lg:px-16">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="col-span-12 lg:col-span-4">
            <SiteLogo logoImage={content.logoImage} logoWidth={content.logoWidth} siteName={content.siteName} textClassName="text-3xl block mb-4" variant="accent" />
            <p className="text-sand/50 font-sans text-sm leading-relaxed max-w-sm">
              {content.footerDescription || t(locale, "footerDescription")}
            </p>
          </div>

          <div className="col-span-6 lg:col-span-2 lg:col-start-6">
            <h5 className="text-xs font-sans uppercase tracking-[0.3em] text-sand/40 mb-4">{t(locale, "explore")}</h5>
            <ul className="space-y-3">
              {[{ label: t(locale, "experiences"), href: "#experiences" }, { label: t(locale, "about"), href: "#about" }, { label: t(locale, "contact"), href: "#contact" }].map((item) => (
                <li key={item.label}><a href={item.href} className="text-sm font-sans text-sand/60 hover:text-sunset-orange transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-2">
            <h5 className="text-xs font-sans uppercase tracking-[0.3em] text-sand/40 mb-4">{t(locale, "company")}</h5>
            <ul className="space-y-3">
              {[t(locale, "ourTeam"), t(locale, "partnerships"), t(locale, "careers"), t(locale, "press")].map((item) => (
                <li key={item}><a href="#" className="text-sm font-sans text-sand/60 hover:text-sunset-orange transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3">
            <h5 className="text-xs font-sans uppercase tracking-[0.3em] text-sand/40 mb-4">{t(locale, "newsletter")}</h5>
            <p className="text-sm font-sans text-sand/50 mb-4">{content.newsletterText}</p>
            {subscribed ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-sans text-sunset-orange">{t(locale, "thankYouSubscribing")}</motion.p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex">
                <input name="email" type="email" placeholder={t(locale, "enterEmail")} required className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-sans text-sand placeholder:text-sand/30 outline-none focus:border-sunset-orange transition-colors rounded-l-sm" />
                <button type="submit" className="bg-terracotta text-primary-foreground px-5 py-2.5 text-xs font-sans uppercase tracking-wider hover:bg-sunset-orange transition-colors rounded-r-sm">{t(locale, "joinBtn")}</button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-sand/30">{content.copyrightText || t(locale, "copyright")}</p>
          <div className="flex gap-6">
            {[
              { label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}` },
              { label: "Pinterest", url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}` },
              { label: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}` },
            ].map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="text-xs font-sans text-sand/30 hover:text-sunset-orange transition-colors">{social.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
