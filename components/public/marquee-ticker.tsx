"use client"

import { motion } from "framer-motion"

const items = [
  "Marrakech",
  "Fes",
  "Sahara Desert",
  "Essaouira",
  "Chefchaouen",
  "Atlas Mountains",
  "Casablanca",
  "Tangier",
  "Ouarzazate",
  "Merzouga",
]

export function MarqueeTicker() {
  const repeated = [...items, ...items, ...items]

  return (
    <div className="bg-terracotta py-3 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-8 whitespace-nowrap"
      >
        {repeated.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="text-xs font-sans uppercase tracking-[0.3em] text-primary-foreground/90">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/40" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
