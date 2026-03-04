"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Save, RotateCcw, Eye, Loader2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface SiteContent {
  heroHeading: string
  heroSubheading: string
  heroTagline: string
  aboutText: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
  newsletterText: string
  heroImage: string
  aboutImage: string
  logoImage: string
  logoWidth: number
  siteName: string
}

export function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [originalContent, setOriginalContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content")
      const data = await res.json()
      setContent(data)
      setOriginalContent(data)
    } catch (err) {
      console.error("Failed to fetch content:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        const data = await res.json()
        setOriginalContent(data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (err) {
      console.error("Failed to save content:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (originalContent) setContent(originalContent)
  }

  const updateField = (field: keyof SiteContent, value: string | number) => {
    setContent((prev) => prev ? { ...prev, [field]: value } : prev)
    setSaved(false)
  }

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl tracking-tight text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
            Content Editor
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">Update the public-facing site content. Changes go live after saving.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-lg font-sans text-sm hover:bg-muted/80 transition-colors">
            <RotateCcw className="w-4 h-4" />Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans text-sm transition-colors ${
              saved ? "bg-green-600 text-white" : "bg-terracotta text-primary-foreground hover:bg-sunset-orange"
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Logo / Branding */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 xl:col-span-2">
          <h3 className="text-sm font-semibold text-foreground font-sans mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-terracotta" />Logo & Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Site Name (fallback if no logo)</label>
              <input type="text" value={content.siteName} onChange={(e) => updateField("siteName", e.target.value)} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" placeholder="Dar Voyages" />
            </div>
            <ImageUpload value={content.logoImage} onChange={(url) => updateField("logoImage", url)} label="Logo Image" />
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Logo Width (px)</label>
              <input type="range" min="60" max="300" value={content.logoWidth} onChange={(e) => updateField("logoWidth", Number(e.target.value))} className="w-full accent-terracotta mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground font-sans mt-1">
                <span>60px</span>
                <span className="text-foreground font-medium">{content.logoWidth}px</span>
                <span>300px</span>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="mt-4 p-4 rounded-lg bg-midnight flex items-center gap-4">
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-sand/40">Preview:</p>
            {content.logoImage ? (
              <img src={content.logoImage} alt="Logo preview" style={{ width: content.logoWidth, height: 'auto' }} className="object-contain" />
            ) : (
              <span className="text-2xl tracking-tight text-sand" style={{ fontFamily: 'var(--font-playfair)' }}>{content.siteName || 'Dar Voyages'}</span>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground font-sans mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-terracotta" />Hero Section
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Tagline</label>
              <input type="text" value={content.heroTagline} onChange={(e) => updateField("heroTagline", e.target.value)} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            </div>
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Heading</label>
              <textarea value={content.heroHeading} onChange={(e) => updateField("heroHeading", e.target.value)} rows={2} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta resize-none" />
            </div>
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Subheading</label>
              <textarea value={content.heroSubheading} onChange={(e) => updateField("heroSubheading", e.target.value)} rows={3} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta resize-none" />
            </div>
            <div>
              <ImageUpload value={content.heroImage} onChange={(url) => updateField("heroImage", url)} label="Hero Background" />
            </div>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-midnight text-sand">
            <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-sunset-orange mb-2">{content.heroTagline}</p>
            <p className="text-xl tracking-tight leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{content.heroHeading}</p>
            <p className="text-xs text-sand/50 leading-relaxed font-sans">{content.heroSubheading}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground font-sans mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-terracotta" />Contact Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Phone Number</label>
              <input type="text" value={content.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            </div>
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Email Address</label>
              <input type="email" value={content.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            </div>
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Address</label>
              <textarea value={content.contactAddress} onChange={(e) => updateField("contactAddress", e.target.value)} rows={2} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta resize-none" />
            </div>
          </div>

          <div className="border-t border-border mt-6 pt-6">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-terracotta" />About Section
            </h3>
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">About Text</label>
              <textarea value={content.aboutText} onChange={(e) => updateField("aboutText", e.target.value)} rows={4} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta resize-none" />
            </div>
            <ImageUpload value={content.aboutImage} onChange={(url) => updateField("aboutImage", url)} label="About Section Photo" />
          </div>

          <div className="border-t border-border mt-6 pt-6">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-terracotta" />Newsletter
            </h3>
            <div>
              <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">Newsletter Description</label>
              <input type="text" value={content.newsletterText} onChange={(e) => updateField("newsletterText", e.target.value)} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
