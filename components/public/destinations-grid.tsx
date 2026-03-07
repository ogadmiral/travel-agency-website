"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/i18n"

interface Destination {
  id: number
  name: string
  tagline: string
  image: string
  sortOrder: number
}

interface SectionContent {
  destinationsHeading: string
  destinationsTagline: string
}

const fallbackDestinations = [
  { id: 0, name: "Marrakech", tagline: "The Red City", image: "/images/hero-morocco.jpg", sortOrder: 0 },
  { id: 1, name: "Fes", tagline: "The Spiritual Capital", image: "/images/medina-streets.jpg", sortOrder: 1 },
  { id: 2, name: "Sahara", tagline: "The Endless Sands", image: "/images/sahara-desert.jpg", sortOrder: 2 },
  { id: 3, name: "Essaouira", tagline: "Wind City of the Atlantic", image: "/images/essaouira-coast.jpg", sortOrder: 3 },
]

export function DestinationsGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { locale } = useLanguage()
  const [destinations, setDestinations] = useState<Destination[]>(fallbackDestinations)
  const [sectionContent, setSectionContent] = useState<SectionContent>({
    destinationsHeading: "",
    destinationsTagline: "",
  })

  const fetchData = useCallback(async () => {
    try {
      const [destRes, contentRes] = await Promise.all([
        fetch("/api/destinations"),
        fetch("/api/content"),
      ])
      const destData = await destRes.json()
      const contentData = await contentRes.json()

      if (Array.isArray(destData) && destData.length > 0) {
        setDestinations(destData)
      }
      setSectionContent({
        destinationsHeading: contentData.destinationsHeading || "",
        destinationsTagline: contentData.destinationsTagline || "",
      })
    } catch {
      // fallback to defaults
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const headingText = sectionContent.destinationsHeading || t(locale, "iconic")
  const taglineText = sectionContent.destinationsTagline || t(locale, "whereWeJourney")

  return (
    <section id="destinations" ref={ref} className="py-24 lg:py-32 bg-sand">
      <div className="px-6 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="max-w-2xl mb-16">
          <p className="text-xs font-sans uppercase tracking-[0.4em] text-terracotta mb-4">{taglineText}</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05] text-balance" style={{ fontFamily: "var(--font-playfair)" }}>
            {headingText} <span className="italic text-terracotta">{t(locale, "destinations")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {destinations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }} className="col-span-12 lg:col-span-7 relative group cursor-pointer">
              <div className="relative h-[400px] lg:h-[560px] overflow-hidden rounded-lg">
                <Image src={destinations[0].image || "/images/hero-morocco.jpg"} alt={destinations[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 lg:p-10">
                  <p className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange mb-2">{destinations[0].tagline}</p>
                  <h3 className="text-3xl lg:text-5xl text-sand tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{destinations[0].name}</h3>
                </div>
              </div>
            </motion.div>
          )}

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 lg:gap-6">
            {destinations.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.7 }} className="relative group cursor-pointer flex-1">
                <div className="relative h-[250px] lg:h-full overflow-hidden rounded-lg">
                  <Image src={destinations[1].image || "/images/medina-streets.jpg"} alt={destinations[1].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                    <p className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange mb-1">{destinations[1].tagline}</p>
                    <h3 className="text-2xl lg:text-3xl text-sand tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{destinations[1].name}</h3>
                  </div>
                </div>
              </motion.div>
            )}

            {destinations.length > 2 && (
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                {destinations.slice(2).map((dest, i) => (
                  <motion.div key={dest.id} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }} className="relative group cursor-pointer">
                    <div className="relative h-[200px] lg:h-[240px] overflow-hidden rounded-lg">
                      <Image src={dest.image || "/images/sahara-desert.jpg"} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 lg:p-5">
                        <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-sunset-orange mb-1">{dest.tagline}</p>
                        <h3 className="text-lg lg:text-xl text-sand tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{dest.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
