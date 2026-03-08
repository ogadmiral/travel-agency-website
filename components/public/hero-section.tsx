"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { SiteLogo } from "@/components/site-logo"
import { t } from "@/lib/i18n"

interface SiteContent {
  heroHeading: string
  heroSubheading: string
  heroTagline: string
  heroImage: string
  logoImage: string
  logoWidth: number
  siteName: string
}

export function HeroSection() {
  const { locale } = useLanguage()
  const [content, setContent] = useState<SiteContent>({
    heroHeading: "Discover the Soul of Morocco",
    heroSubheading: "Curated journeys through ancient medinas, vast Saharan dunes, and the Atlas Mountains. Every detail crafted for the discerning traveler.",
    heroTagline: "Luxury Moroccan Journeys",
    heroImage: "/images/hero-morocco.jpg",
    logoImage: "",
    logoWidth: 160,
    siteName: "",
  })

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" })
      const data = await res.json()
      setContent(data)
    } catch {
      // fallback to defaults
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Split heading into lines for the hero layout
  const headingWords = content.heroHeading.split(" ")
  const midpoint = Math.ceil(headingWords.length / 2)

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-midnight">
      <div className="absolute inset-0">
        <Image
          src={content.heroImage || "/images/hero-morocco.jpg"}
          alt="Luxurious Moroccan riad courtyard at golden hour"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/40 to-midnight/90" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-16 lg:pb-24 px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 lg:p-10"
        >
          <SiteLogo logoImage={content.logoImage} logoWidth={content.logoWidth} siteName={content.siteName} textClassName="text-2xl lg:text-3xl" variant="light" />
        </motion.div>

        <div className="grid grid-cols-12 gap-4 items-end">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="col-span-12"
          >
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-sunset-orange mb-4 lg:mb-6">
              {t(locale, "heroTagline")}
            </p>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-sand leading-[0.9] tracking-tight text-balance"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {headingWords.slice(0, midpoint).join(" ")}
              <br />
              <span className="italic text-sunset-orange">{headingWords[midpoint]}</span>{" "}
              {headingWords.slice(midpoint + 1).join(" ")}
            </h1>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 lg:mt-12 grid grid-cols-12 gap-4"
        >
          <div className="col-span-12 lg:col-start-2 lg:col-span-5">
            <p className="text-sand/70 text-base lg:text-lg leading-relaxed font-sans">
              {content.heroSubheading}
            </p>
          </div>
          <div className="col-span-12 lg:col-start-8 lg:col-span-4 flex items-end">
            <a href="#experiences" className="inline-flex items-center gap-3 text-sunset-orange font-sans text-sm uppercase tracking-[0.2em] hover:gap-5 transition-all group">
              {t(locale, "heroExplore")}
              <span className="w-12 h-px bg-sunset-orange group-hover:w-20 transition-all" />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-px h-12 bg-gradient-to-b from-transparent to-sunset-orange/60" />
      </motion.div>
    </section>
  )
}
