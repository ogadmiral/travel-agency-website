"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/site-logo"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/admin"
  const [logoData, setLogoData] = useState({ logoImage: "", logoWidth: 160, siteName: "Dar Voyages" })

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(data => {
      setLogoData({ logoImage: data.logoImage || "", logoWidth: data.logoWidth || 160, siteName: data.siteName || "Dar Voyages" })
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full border border-white/5" />
      <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full border border-white/5" />
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full bg-terracotta/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to site link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sand/40 hover:text-sunset-orange transition-colors font-sans text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </Link>

        {/* Login card */}
        <div className="glass rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-terracotta/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-terracotta" />
            </div>
            <div className="mb-2">
              <SiteLogo logoImage={logoData.logoImage} logoWidth={logoData.logoWidth} siteName={logoData.siteName} textClassName="text-3xl" variant="light" />
            </div>
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-sand/40">
              Admin Dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-sans text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-sand font-sans text-sm placeholder:text-sand/30 outline-none focus:border-terracotta transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="text-xs font-sans uppercase tracking-[0.2em] text-sand/50 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-sand font-sans text-sm placeholder:text-sand/30 outline-none focus:border-terracotta transition-colors pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand/30 hover:text-sand/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-primary-foreground py-3 rounded-lg font-sans text-sm uppercase tracking-[0.2em] hover:bg-sunset-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sand/20 font-sans text-xs mt-6">
          Authorized personnel only
        </p>
      </motion.div>
    </div>
  )
}
