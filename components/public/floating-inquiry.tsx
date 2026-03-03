"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

export function FloatingInquiry() {
  const [phone, setPhone] = useState("")

  const fetchPhone = useCallback(async () => {
    try {
      const res = await fetch("/api/content")
      if (res.ok) {
        const data = await res.json()
        setPhone(data.contactPhone || "")
      }
    } catch {
      // silent – button will still render, just won't have a number yet
    }
  }, [])

  useEffect(() => {
    fetchPhone()
  }, [fetchPhone])

  // Strip everything except digits and leading +
  const whatsappNumber = phone.replace(/[^\d+]/g, "").replace(/(?!^\+)\+/g, "")

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(
    "Hello! I'm interested in your tours. Could you share more details?"
  )}`

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-terracotta text-primary-foreground shadow-lg flex items-center justify-center hover:bg-sunset-orange transition-colors"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </motion.a>
    </div>
  )
}
