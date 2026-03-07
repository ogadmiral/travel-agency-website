"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { t, type TranslationKey } from "@/lib/i18n"

const stats = [
  { number: "200+", labelKey: "journeysCrafted" as TranslationKey },
  { number: "15", labelKey: "yearsExperience" as TranslationKey },
  { number: "98%", labelKey: "guestSatisfaction" as TranslationKey },
  { number: "12", labelKey: "destinationsLabel" as TranslationKey },
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { locale } = useLanguage()
  const [aboutText, setAboutText] = useState(
    "Born from a deep love for Morocco and its people, we create journeys that go beyond tourism. We open doors to private riads, family kitchens, and hidden valleys that most travelers never discover."
  )
  const [aboutImage, setAboutImage] = useState("/images/luxury-riad.jpg")

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content")
      const data = await res.json()
      if (data.aboutText) setAboutText(data.aboutText)
      if (data.aboutImage) setAboutImage(data.aboutImage)
    } catch {
      // fallback to default
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  return (
    <section id="about" ref={ref} className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="px-6 lg:px-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-5"
          >
            <div className="arch-frame-tall w-full max-w-sm mx-auto lg:mx-0 h-[450px] lg:h-[560px] relative">
              <Image src={aboutImage} alt="Luxurious Moroccan riad interior with Moorish arches" fill className="object-cover" unoptimized />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-6 lg:col-start-7"
          >
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-terracotta mb-4">{t(locale, "ourStory")}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground leading-[1.1] mb-6 text-balance" style={{ fontFamily: "var(--font-playfair)" }}>
              {t(locale, "whereTradition")} <span className="italic text-terracotta">{t(locale, "luxury")}</span>
            </h2>
            <div className="space-y-4 mb-10">
              <p className="text-muted-foreground font-sans leading-relaxed">{aboutText}</p>
              <p className="text-muted-foreground font-sans leading-relaxed">
                {t(locale, "aboutSecondParagraph")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.labelKey} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }} className="border-t border-border pt-4">
                  <span className="text-3xl lg:text-4xl text-terracotta tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{stat.number}</span>
                  <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mt-1">{t(locale, stat.labelKey)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
