"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Check, X, Clock, User, Calendar, MapPin, Loader2 } from "lucide-react"

interface Booking {
  id: number
  guest: string
  email: string
  tour: string
  date: string
  guests: number
  status: "Pending" | "Confirmed" | "Declined"
  message: string
  submittedAt: string
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins} minutes ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

export function BookingsFeed() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"All" | "Pending" | "Confirmed" | "Declined">("All")

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings")
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.error("Failed to fetch bookings:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const updateStatus = async (id: number, status: Booking["status"]) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
      }
    } catch (err) {
      console.error("Failed to update booking:", err)
    }
  }

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter)

  const statusBadge = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-700"
      case "Confirmed": return "bg-green-100 text-green-700"
      case "Declined": return "bg-red-100 text-red-600"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    Declined: bookings.filter((b) => b.status === "Declined").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl tracking-tight text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
          Booking Requests
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">Review and manage incoming booking inquiries.</p>
      </div>

      <div className="flex gap-2">
        {(["All", "Pending", "Confirmed", "Declined"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-sans text-sm transition-colors ${
              filter === tab ? "bg-terracotta text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab}
            <span className="ml-1.5 text-xs opacity-70">{counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center text-xs font-semibold text-terracotta font-sans">
                    {booking.guest.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">{booking.guest}</p>
                    <p className="font-sans text-xs text-muted-foreground">{booking.email}</p>
                  </div>
                  <span className={`ml-auto lg:ml-4 inline-flex px-2.5 py-1 rounded-full text-xs font-sans font-medium ${statusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-sans text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{booking.tour}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{timeAgo(booking.submittedAt)}</span>
                </div>

                <p className="text-sm text-muted-foreground font-sans leading-relaxed bg-muted/50 rounded-md p-3 italic">
                  {`"${booking.message}"`}
                </p>
              </div>

              {booking.status === "Pending" && (
                <div className="flex lg:flex-col gap-2 flex-shrink-0">
                  <button onClick={() => updateStatus(booking.id, "Confirmed")} className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg font-sans text-xs hover:bg-green-700 transition-colors">
                    <Check className="w-3.5 h-3.5" />Confirm
                  </button>
                  <button onClick={() => updateStatus(booking.id, "Declined")} className="inline-flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-lg font-sans text-xs hover:bg-red-100 hover:text-red-600 transition-colors">
                    <X className="w-3.5 h-3.5" />Decline
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
