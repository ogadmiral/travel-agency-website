"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Pencil, Check, X, Plus, Trash2, Loader2 } from "lucide-react"

interface Tour {
  id: number
  name: string
  destination: string
  price: number
  duration: string
  nextDate: string
  status: "Active" | "Draft" | "Sold Out"
  subtitle: string
  image: string
  description: string
}

export function TourManager() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Tour>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTour, setNewTour] = useState<Partial<Tour>>({
    name: "",
    destination: "",
    price: 0,
    duration: "",
    nextDate: "",
    status: "Draft",
    subtitle: "",
    image: "/images/hero-morocco.jpg",
    description: "",
  })

  const fetchTours = useCallback(async () => {
    try {
      const res = await fetch("/api/tours")
      const data = await res.json()
      setTours(data)
    } catch (err) {
      console.error("Failed to fetch tours:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  const startEdit = (tour: Tour) => {
    setEditingId(tour.id)
    setEditData({ price: tour.price, nextDate: tour.nextDate, status: tour.status })
  }

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })
      if (res.ok) {
        const updated = await res.json()
        setTours((prev) => prev.map((t) => (t.id === id ? updated : t)))
      }
    } catch (err) {
      console.error("Failed to update tour:", err)
    }
    setEditingId(null)
    setEditData({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/tours/${id}`, { method: "DELETE" })
      if (res.ok) {
        setTours((prev) => prev.filter((t) => t.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete tour:", err)
    }
  }

  const handleAddTour = async () => {
    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTour),
      })
      if (res.ok) {
        const created = await res.json()
        setTours((prev) => [...prev, created])
        setShowAddForm(false)
        setNewTour({
          name: "", destination: "", price: 0, duration: "", nextDate: "",
          status: "Draft", subtitle: "", image: "/images/hero-morocco.jpg", description: "",
        })
      }
    } catch (err) {
      console.error("Failed to create tour:", err)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700"
      case "Draft": return "bg-amber-100 text-amber-700"
      case "Sold Out": return "bg-red-100 text-red-600"
      default: return "bg-muted text-muted-foreground"
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl tracking-tight text-foreground" style={{ fontFamily: "var(--font-playfair)" }}>
            Tour Manager
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">Manage tours, edit pricing, and update dates.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-2 bg-terracotta text-primary-foreground px-4 py-2.5 rounded-lg font-sans text-sm hover:bg-sunset-orange transition-colors">
          <Plus className="w-4 h-4" />
          Add Tour
        </button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground font-sans">New Tour</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Tour Name" value={newTour.name} onChange={(e) => setNewTour({ ...newTour, name: e.target.value })} className="bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            <input type="text" placeholder="Destination" value={newTour.destination} onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })} className="bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            <input type="number" placeholder="Price" value={newTour.price || ""} onChange={(e) => setNewTour({ ...newTour, price: Number(e.target.value) })} className="bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            <input type="text" placeholder="Duration (e.g., 3 Nights)" value={newTour.duration} onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })} className="bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            <input type="date" value={newTour.nextDate} onChange={(e) => setNewTour({ ...newTour, nextDate: e.target.value })} className="bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
            <input type="text" placeholder="Subtitle" value={newTour.subtitle} onChange={(e) => setNewTour({ ...newTour, subtitle: e.target.value })} className="bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
          </div>
          <textarea placeholder="Description" value={newTour.description} onChange={(e) => setNewTour({ ...newTour, description: e.target.value })} rows={2} className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta resize-none" />
          <div className="flex gap-2">
            <button onClick={handleAddTour} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-sans text-sm hover:bg-green-700 transition-colors"><Check className="w-4 h-4" />Create</button>
            <button onClick={() => setShowAddForm(false)} className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-sans text-sm hover:bg-muted/80 transition-colors"><X className="w-4 h-4" />Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Tour</th>
                <th className="text-left px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Destination</th>
                <th className="text-left px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Price</th>
                <th className="text-left px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Next Date</th>
                <th className="text-left px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-right px-5 py-3 text-xs font-sans uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tours.map((tour, i) => {
                const isEditing = editingId === tour.id
                return (
                  <motion.tr key={tour.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-sans text-sm font-medium text-foreground">{tour.name}</td>
                    <td className="px-5 py-4 font-sans text-sm text-muted-foreground">{tour.destination}</td>
                    <td className="px-5 py-4 font-sans text-sm">
                      {isEditing ? (
                        <input type="number" value={editData.price || ""} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} className="w-24 bg-muted px-2 py-1 rounded text-sm text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
                      ) : (
                        <span className="text-foreground">${tour.price.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-sans text-sm text-muted-foreground">{tour.duration}</td>
                    <td className="px-5 py-4 font-sans text-sm">
                      {isEditing ? (
                        <input type="date" value={editData.nextDate || ""} onChange={(e) => setEditData({ ...editData, nextDate: e.target.value })} className="bg-muted px-2 py-1 rounded text-sm text-foreground outline-none focus:ring-1 focus:ring-terracotta" />
                      ) : (
                        <span className="text-muted-foreground">{new Date(tour.nextDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <select value={editData.status || ""} onChange={(e) => setEditData({ ...editData, status: e.target.value as Tour["status"] })} className="bg-muted px-2 py-1 rounded text-sm text-foreground outline-none focus:ring-1 focus:ring-terracotta">
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Sold Out">Sold Out</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-sans font-medium ${statusColor(tour.status)}`}>{tour.status}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(tour.id)} className="p-1.5 rounded hover:bg-green-100 text-green-600 transition-colors" aria-label="Save changes"><Check className="w-4 h-4" /></button>
                            <button onClick={cancelEdit} className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors" aria-label="Cancel editing"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(tour)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label={`Edit ${tour.name}`}><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(tour.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" aria-label={`Delete ${tour.name}`}><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
