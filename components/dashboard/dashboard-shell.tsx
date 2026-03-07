"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { OverviewPanel } from "./overview-panel"
import { TourManager } from "./tour-manager"
import { BookingsFeed } from "./bookings-feed"
import { ContentEditor } from "./content-editor"
import { DestinationsManager } from "./destinations-manager"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { SiteLogo } from "@/components/site-logo"

type View = "overview" | "tours" | "bookings" | "content" | "destinations"

export function DashboardShell() {
  const [activeView, setActiveView] = useState<View>("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoData, setLogoData] = useState({ logoImage: "", logoWidth: 120, siteName: "" })

  const fetchLogo = useCallback(async () => {
    try {
      const res = await fetch("/api/content")
      const data = await res.json()
      setLogoData({ logoImage: data.logoImage || "", logoWidth: Math.min(data.logoWidth || 120, 120), siteName: data.siteName || "" })
    } catch {}
  }, [])

  useEffect(() => { fetchLogo() }, [fetchLogo])

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
      case "destinations":
        return <DestinationsManager />
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
        <SiteLogo logoImage={logoData.logoImage} logoWidth={logoData.logoWidth} siteName={logoData.siteName} textClassName="text-lg" variant="dark" />
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
