"use client"

import { useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { OverviewPanel } from "./overview-panel"
import { TourManager } from "./tour-manager"
import { BookingsFeed } from "./bookings-feed"
import { ContentEditor } from "./content-editor"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

type View = "overview" | "tours" | "bookings" | "content"

export function DashboardShell() {
  const [activeView, setActiveView] = useState<View>("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <OverviewPanel />
      case "tours":
        return <TourManager />
      case "bookings":
        return <BookingsFeed />
      case "content":
        return <ContentEditor />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span
          className="text-lg tracking-tight text-foreground"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Dar Voyages
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-midnight/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-64 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardSidebar
                activeView={activeView}
                onViewChange={(view) => {
                  setActiveView(view)
                  setMobileMenuOpen(false)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-6xl">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
