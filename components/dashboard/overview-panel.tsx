"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, DollarSign, MapPin, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"

interface Booking {
  id: number
  guest: string
  tour: string
  status: string
  submittedAt: string
}

interface Tour {
  id: number
  price: number
  status: string
}

export function OverviewPanel() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [bookingsRes, toursRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/tours"),
      ])
      const bookingsData = await bookingsRes.json()
      const toursData = await toursRes.json()
      setBookings(bookingsData)
      setTours(toursData)
    } catch (err) {
      console.error("Failed to fetch overview data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
      </div>
    )
  }

  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed")
  const activeTours = tours.filter((t) => t.status === "Active")
  const totalRevenue = confirmedBookings.reduce((sum, b) => {
    const tour = tours.find((t) => t.status === "Active")
    return sum + (tour?.price || 2500)
  }, 0)

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign },
    { label: "Total Bookings", value: String(bookings.length), change: `${bookings.filter((b) => b.status === "Pending").length} pending`, up: true, icon: Users },
    { label: "Active Tours", value: String(activeTours.length), change: `of ${tours.length} total`, up: true, icon: MapPin },
    { label: "Conversion Rate", value: bookings.length > 0 ? `${Math.round((confirmedBookings.length / bookings.length) * 100)}%` : "0%", change: `${confirmedBookings.length} confirmed`, up: confirmedBookings.length > 0, icon: TrendingUp },
  ]

  const recentActivity = bookings
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)
    .map((b) => ({
      name: b.guest,
      action: b.status === "Confirmed" ? `booked ${b.tour}` : b.status === "Pending" ? `inquired about ${b.tour}` : `was declined for ${b.tour}`,
      time: timeAgo(b.submittedAt),
      amount: b.status === "Confirmed" ? `$${(tours.find(() => true)?.price || 2500).toLocaleString()}` : null,
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl tracking-tight text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">Welcome back. Here is your business overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-terracotta" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-sans ${stat.up ? "text-green-600" : "text-red-500"}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-foreground tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-sans mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground font-sans">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground font-sans">No activity yet.</div>
          ) : (
            recentActivity.map((activity, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-xs font-semibold text-terracotta font-sans">
                    {activity.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-sans">
                      <span className="font-medium">{activity.name}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-semibold text-foreground font-sans">{activity.amount}</span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
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
