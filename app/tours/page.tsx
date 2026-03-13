"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/i18n"
import { markdownToPlainText } from "@/lib/markdown"

interface Tour {
  id: number
  name: string
  subtitle: string
  image: string
  price: number
  description: string
  destination: string
  duration: string
  status: string
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const { locale } = useLanguage()

  const fetchTours = useCallback(async () => {
    try {
      const res = await fetch("/api/tours")
      const data = await res.json()
      setTours(data.filter((tour: Tour) => tour.status === "Active"))
    } catch {
      // fallback empty
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans">{t(locale, "loading")}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 lg:px-16 py-24 lg:py-32">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-terracotta font-sans text-sm uppercase tracking-wider hover:text-sunset-orange transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(locale, "backToHome")}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-sans uppercase tracking-[0.4em] text-terracotta mb-4">
            {t(locale, "curatedCollection")}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.05] text-balance"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t(locale, "featured")}{" "}
            <span className="italic text-terracotta">{t(locale, "experiences")}</span>
          </h1>
        </motion.div>

        {/* Tours grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, i) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <Link href={`/tour/${tour.id}`} className="block">
                <div className="arch-frame-tall w-full h-[400px] lg:h-[480px] relative overflow-hidden mb-5">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs font-sans uppercase tracking-[0.3em] text-sunset-orange">
                      {t(locale, "from")} ${tour.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <h3
                  className="text-xl lg:text-2xl tracking-tight text-foreground mb-1 group-hover:text-terracotta transition-colors"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {tour.name}
                </h3>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  {tour.subtitle}
                </p>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  {markdownToPlainText(tour.description)}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>

        {tours.length === 0 && !loading && (
          <p className="text-center text-muted-foreground font-sans py-20">
            No tours available at the moment.
          </p>
        )}
      </div>
    </main>
  )
}
