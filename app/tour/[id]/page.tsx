"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, MapPin, Calendar, DollarSign } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/i18n"

interface Tour {
  id: number
  name: string
  subtitle: string
  image: string
  price: number
  description: string
  destination: string
  duration: string
  nextDate: string
  status: string
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [tourId, setTourId] = useState<string | null>(null)
  const { locale } = useLanguage()

  useEffect(() => {
    params.then((p) => setTourId(p.id))
  }, [params])

  const fetchTour = useCallback(async () => {
    if (!tourId) return
    try {
      const res = await fetch(`/api/tours/${tourId}`)
      if (res.ok) {
        const data = await res.json()
        setTour(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [tourId])

  useEffect(() => {
    if (tourId) fetchTour()
  }, [tourId, fetchTour])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans">{t(locale, "loading")}</p>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
          {t(locale, "tourNotFound")}
        </h1>
        <p className="text-muted-foreground font-sans">{t(locale, "tourNotFoundDesc")}</p>
        <Link href="/" className="text-terracotta font-sans text-sm uppercase tracking-wider hover:text-sunset-orange transition-colors">
          {t(locale, "backToHome")}
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero image */}
      <div className="relative h-[50vh] lg:h-[65vh] overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/30 to-midnight/20" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 z-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-sand px-4 py-2.5 rounded-lg font-sans text-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(locale, "backToHome")}
          </Link>
        </motion.div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange mb-3">
              {tour.subtitle}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-7xl text-sand tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {tour.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 lg:px-16 py-12 lg:py-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <div className="border border-border rounded-lg p-5">
            <Clock className="w-5 h-5 text-terracotta mb-2" />
            <p className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-1">{t(locale, "duration")}</p>
            <p className="text-lg text-foreground font-sans">{tour.duration}</p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <MapPin className="w-5 h-5 text-terracotta mb-2" />
            <p className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-1">{t(locale, "destination")}</p>
            <p className="text-lg text-foreground font-sans">{tour.destination}</p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <Calendar className="w-5 h-5 text-terracotta mb-2" />
            <p className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-1">{t(locale, "nextDeparture")}</p>
            <p className="text-lg text-foreground font-sans">
              {new Date(tour.nextDate).toLocaleDateString(locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="border border-border rounded-lg p-5">
            <DollarSign className="w-5 h-5 text-terracotta mb-2" />
            <p className="text-xs font-sans uppercase tracking-wider text-muted-foreground mb-1">{t(locale, "pricePerPerson")}</p>
            <p className="text-lg text-foreground font-sans">${tour.price.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <p className="text-muted-foreground font-sans leading-relaxed text-base lg:text-lg">
            {tour.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = "/#contact"
            }}
            className="inline-flex items-center gap-3 bg-terracotta text-primary-foreground px-8 py-4 font-sans text-sm uppercase tracking-[0.2em] hover:bg-sunset-orange transition-colors rounded-sm"
          >
            {t(locale, "bookThisTour")}
          </a>
        </motion.div>
      </div>
    </main>
  )
}
