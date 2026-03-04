"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { t, type TranslationKey } from "@/lib/i18n"

const defaultDestinations = [
  { nameKey: "marrakech" as TranslationKey, tagKey: "marrakechTag" as TranslationKey, image: "/images/hero-morocco.jpg" },
  { nameKey: "fes" as TranslationKey, tagKey: "fesTag" as TranslationKey, image: "/images/medina-streets.jpg" },
  { nameKey: "sahara" as TranslationKey, tagKey: "saharaTag" as TranslationKey, image: "/images/sahara-desert.jpg" },
  { nameKey: "essaouira" as TranslationKey, tagKey: "essaouiraTag" as TranslationKey, image: "/images/essaouira-coast.jpg" },
]

// Map destination names to tour destinations for image lookup
const destToTourMap: Record<string, string> = {
  marrakech: "Multi-City",
  fes: "Fes",
  sahara: "Merzouga",
  essaouira: "Essaouira",
}

export function DestinationsGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { locale } = useLanguage()
  const [destinations, setDestinations] = useState(defaultDestinations)

  const fetchTourImages = useCallback(async () => {
    try {
      const res = await fetch("/api/tours")
      const tours = await res.json()
      setDestinations((prev) =>
        prev.map((dest) => {
          const tourDest = destToTourMap[dest.nameKey]
          const matchingTour = tours.find((tour: { destination: string; image: string }) => tour.destination === tourDest)
          return matchingTour?.image ? { ...dest, image: matchingTour.image } : dest
        })
      )
    } catch {
      // fallback to defaults
    }
  }, [])

  useEffect(() => {
    fetchTourImages()
  }, [fetchTourImages])

  return (
    <section id="destinations" ref={ref} className="py-24 lg:py-32 bg-sand">
      <div className="px-6 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="max-w-2xl mb-16">
          <p className="text-xs font-sans uppercase tracking-[0.4em] text-terracotta mb-4">{t(locale, "whereWeJourney")}</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05] text-balance" style={{ fontFamily: "var(--font-playfair)" }}>
            {t(locale, "iconic")} <span className="italic text-terracotta">{t(locale, "destinations")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.7 }} className="col-span-12 lg:col-span-7 relative group cursor-pointer">
            <div className="relative h-[400px] lg:h-[560px] overflow-hidden rounded-lg">
              <Image src={destinations[0].image} alt={t(locale, destinations[0].nameKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 lg:p-10">
                <p className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange mb-2">{t(locale, destinations[0].tagKey)}</p>
                <h3 className="text-3xl lg:text-5xl text-sand tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{t(locale, destinations[0].nameKey)}</h3>
              </div>
            </div>
          </motion.div>

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 lg:gap-6">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.7 }} className="relative group cursor-pointer flex-1">
              <div className="relative h-[250px] lg:h-full overflow-hidden rounded-lg">
                <Image src={destinations[1].image} alt={t(locale, destinations[1].nameKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                  <p className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange mb-1">{t(locale, destinations[1].tagKey)}</p>
                  <h3 className="text-2xl lg:text-3xl text-sand tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{t(locale, destinations[1].nameKey)}</h3>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {destinations.slice(2).map((dest, i) => (
                <motion.div key={dest.nameKey} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }} className="relative group cursor-pointer">
                  <div className="relative h-[200px] lg:h-[240px] overflow-hidden rounded-lg">
                    <Image src={dest.image} alt={t(locale, dest.nameKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 lg:p-5">
                      <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-sunset-orange mb-1">{t(locale, dest.tagKey)}</p>
                      <h3 className="text-lg lg:text-xl text-sand tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{t(locale, dest.nameKey)}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
