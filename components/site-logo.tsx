"use client"

import Image from "next/image"

interface SiteLogoProps {
  logoImage?: string
  logoWidth?: number
  siteName?: string
  className?: string
  textClassName?: string
  variant?: "light" | "dark" | "accent"
}

export function SiteLogo({
  logoImage,
  logoWidth = 160,
  siteName = "Dar Voyages",
  className = "",
  textClassName = "",
  variant = "light",
}: SiteLogoProps) {
  const colorMap = {
    light: "text-sand",
    dark: "text-foreground",
    accent: "text-sunset-orange",
  }

  if (logoImage) {
    return (
      <div className={className} style={{ width: logoWidth, position: "relative" }}>
        <Image
          src={logoImage}
          alt={siteName}
          width={logoWidth}
          height={Math.round(logoWidth * 0.4)}
          className="object-contain h-auto w-full"
          unoptimized
        />
      </div>
    )
  }

  return (
    <span
      className={`tracking-tight ${colorMap[variant]} ${textClassName}`}
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      {siteName}
    </span>
  )
}
