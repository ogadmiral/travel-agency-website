"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"


export function FloatingInquiry() {
  const [email, setEmail] = useState("")

  const fetchEmail = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setEmail(data.contactEmail || "")
      }
    } catch {
      // silent – button will still render
    }
  }, [])

  useEffect(() => {
    fetchEmail()
  }, [fetchEmail])

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Tour Inquiry")}&body=${encodeURIComponent(
    "Hello! I'm interested in your tours. Could you share more details?"
  )}`

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.a
        href={mailtoUrl}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-terracotta text-primary-foreground shadow-lg flex items-center justify-center hover:bg-sunset-orange transition-colors"
        aria-label="Send us an email"
      >
        <Mail className="w-6 h-6" />
      </motion.a>
    </div>
  )
}
