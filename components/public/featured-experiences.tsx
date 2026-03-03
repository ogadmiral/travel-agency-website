"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/i18n"

interface Experience {
  id: number
  name: string
  subtitle: string
  image: string
  price: number
  description: string
}

export function FeaturedExperiences() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [experiences, setExperiences] = useState<Experience[]>([])
  const { locale } = useLanguage()

  const fetchExperiences = useCallback(async () => {
    try {
      const res = await fetch("/api/tours")
      const data = await res.json()
      // Only show Active tours on the public site
      setExperiences(data.filter((t: Experience & { status: string }) => t.status === "Active"))
    } catch {
      // fallback empty
    }
  }, [])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -420 : 420
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  return (
    <section id="experiences" ref={sectionRef} className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="px-6 lg:px-16 mb-12 lg:mb-16">
        <div className="grid grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-7"
          >
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-terracotta mb-4">{t(locale, "curatedCollection")}</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05] text-balance" style={{ fontFamily: "var(--font-playfair)" }}>
              {t(locale, "featured")} <span className="italic text-terracotta">{t(locale, "experiences")}</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 lg:col-span-4 lg:col-start-9 flex items-end"
          >
            <p className="text-muted-foreground font-sans leading-relaxed text-sm lg:text-base">
              {t(locale, "featuredDescription")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto hide-scrollbar px-6 lg:px-16 pb-4">
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
              className="flex-shrink-0 w-[320px] lg:w-[380px] group cursor-pointer"
            >
              <Link href={`/tour/${exp.id}`} className="block">
              <div className="arch-frame-tall w-full h-[400px] lg:h-[480px] relative overflow-hidden mb-5">
                <Image src={exp.image} alt={exp.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange">{t(locale, "from")} ${exp.price.toLocaleString()}</span>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl tracking-tight text-foreground mb-1 group-hover:text-terracotta transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                {exp.name}
              </h3>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-3">{exp.subtitle}</p>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">{exp.description}</p>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="flex items-center gap-3 px-6 lg:px-16 mt-8">
          <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-terracotta hover:text-primary-foreground hover:border-terracotta transition-colors" aria-label="Scroll left">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-terracotta hover:text-primary-foreground hover:border-terracotta transition-colors" aria-label="Scroll right">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <a href="#contact" className="inline-flex items-center gap-2 text-terracotta font-sans text-sm uppercase tracking-[0.2em] hover:gap-4 transition-all">
            {t(locale, "viewAll")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
