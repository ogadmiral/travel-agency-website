"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { Send, MapPin, Phone, Mail } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { t } from "@/lib/i18n"

interface SiteContent {
  contactPhone: string
  contactEmail: string
  contactAddress: string
}

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { locale } = useLanguage()
  const [contactInfo, setContactInfo] = useState<SiteContent>({
    contactPhone: "+212 524 123 456",
    contactEmail: "",
    contactAddress: "42 Avenue Mohammed V, Marrakech, Morocco 40000",
  })
  const [tours, setTours] = useState<{ name: string }[]>([])

  const fetchData = useCallback(async () => {
    try {
      const [contentRes, toursRes] = await Promise.all([
        fetch("/api/content"),
        fetch("/api/tours"),
      ])
      const contentData = await contentRes.json()
      const toursData = await toursRes.json()
      setContactInfo(contentData)
      setTours(toursData.filter((t: { status: string }) => t.status === "Active"))
    } catch {
      // fallback to defaults
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: `${firstName} ${lastName}`,
          email: formData.get("email"),
          tour: formData.get("tour") || "General Inquiry",
          date: new Date().toISOString().split("T")[0],
          guests: 1,
          message: formData.get("message") || "",
        }),
      })
      setSubmitted(true)
    } catch {
      alert("Failed to send. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const addressLines = contactInfo.contactAddress.split(",").map((l) => l.trim())

  return (
    <section id="contact" ref={ref} className="py-24 lg:py-32 bg-midnight text-sand relative overflow-hidden">
      <div className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full border border-white/5" />
      <div className="absolute -left-20 -bottom-20 w-[300px] h-[300px] rounded-full border border-white/5" />

      <div className="relative z-10 px-6 lg:px-16">
        <div className="grid grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-5"
          >
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-sunset-orange mb-4">{t(locale, "getInTouch")}</p>
            <h2 className="text-4xl md:text-5xl tracking-tight leading-[1.1] mb-8 text-balance" style={{ fontFamily: "var(--font-playfair)" }}>
              {t(locale, "startPlanning")} <span className="italic text-sunset-orange">{t(locale, "journey")}</span>
            </h2>
            <p className="text-sand/60 font-sans leading-relaxed mb-10">
              {t(locale, "contactDescription")}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-sunset-orange mt-0.5 flex-shrink-0" />
                <div>
                  {addressLines.map((line, i) => (
                    <p key={i} className={`font-sans text-sm ${i === 0 ? "text-sand/80" : "text-sand/50"}`}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-sunset-orange flex-shrink-0" />
                <p className="font-sans text-sm text-sand/80">{contactInfo.contactPhone}</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-sunset-orange flex-shrink-0" />
                <p className="font-sans text-sm text-sand/80">{contactInfo.contactEmail}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 lg:col-span-6 lg:col-start-7"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-sunset-orange/20 flex items-center justify-center mb-6">
                  <Send className="w-6 h-6 text-sunset-orange" />
                </motion.div>
                <h3 className="text-2xl mb-2 text-sand" style={{ fontFamily: "var(--font-playfair)" }}>{t(locale, "messageSent")}</h3>
                <p className="text-sand/60 font-sans text-sm">{t(locale, "messageSentDesc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">{t(locale, "firstName")}</label>
                    <input name="firstName" type="text" required className="w-full bg-transparent border-b border-white/20 pb-3 text-sand font-sans text-sm focus:border-sunset-orange outline-none transition-colors placeholder:text-sand/30" placeholder={t(locale, "yourFirstName")} />
                  </div>
                  <div>
                    <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">{t(locale, "lastName")}</label>
                    <input name="lastName" type="text" required className="w-full bg-transparent border-b border-white/20 pb-3 text-sand font-sans text-sm focus:border-sunset-orange outline-none transition-colors placeholder:text-sand/30" placeholder={t(locale, "yourLastName")} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">{t(locale, "email")}</label>
                  <input name="email" type="email" required className="w-full bg-transparent border-b border-white/20 pb-3 text-sand font-sans text-sm focus:border-sunset-orange outline-none transition-colors placeholder:text-sand/30" placeholder={t(locale, "yourEmail")} />
                </div>
                <div>
                  <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">{t(locale, "interestedIn")}</label>
                  <select name="tour" className="w-full bg-transparent border-b border-white/20 pb-3 text-sand font-sans text-sm focus:border-sunset-orange outline-none transition-colors appearance-none cursor-pointer">
                    <option value="" className="bg-midnight">{t(locale, "selectExperience")}</option>
                    {tours.map((tt) => (
                      <option key={tt.name} value={tt.name} className="bg-midnight">{tt.name}</option>
                    ))}
                    <option value="custom" className="bg-midnight">{t(locale, "customJourney")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">{t(locale, "message")}</label>
                  <textarea name="message" rows={4} className="w-full bg-transparent border-b border-white/20 pb-3 text-sand font-sans text-sm focus:border-sunset-orange outline-none transition-colors resize-none placeholder:text-sand/30" placeholder={t(locale, "tellUsAbout")} />
                </div>
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-3 bg-terracotta text-primary-foreground px-8 py-4 font-sans text-sm uppercase tracking-[0.2em] hover:bg-sunset-orange transition-colors rounded-sm disabled:opacity-50">
                  {submitting ? t(locale, "sending") : t(locale, "sendInquiry")}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
