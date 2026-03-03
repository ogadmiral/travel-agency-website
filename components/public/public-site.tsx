"use client"

import { SideNavigation } from "./side-navigation"
import { HeroSection } from "./hero-section"
import { MarqueeTicker } from "./marquee-ticker"
import { FeaturedExperiences } from "./featured-experiences"
import { DestinationsGrid } from "./destinations-grid"
import { AboutSection } from "./about-section"
import { ContactSection } from "./contact-section"
import { FloatingInquiry } from "./floating-inquiry"
import { Footer } from "./footer"

export function PublicSite() {
  return (
    <main className="relative">
      {/* Grain overlay for editorial feel */}
      <div className="grain-overlay" />

      <SideNavigation />

      <HeroSection />
      <MarqueeTicker />
      <FeaturedExperiences />
      <DestinationsGrid />
      <AboutSection />
      <ContactSection />
      <Footer />

      <FloatingInquiry />
    </main>
  )
}
