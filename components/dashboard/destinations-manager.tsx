"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, GripVertical, Save, Loader2, MapPin } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface Destination {
  id: number
  name: string
  tagline: string
  image: string
  sortOrder: number
}

export function DestinationsManager() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Destination>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [newDest, setNewDest] = useState({ name: "", tagline: "", image: "", sortOrder: 0 })

  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch("/api/destinations")
      const data = await res.json()
      setDestinations(data)
    } catch (err) {
      console.error("Failed to fetch destinations:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDestinations()
  }, [fetchDestinations])

  const handleAdd = async () => {
    if (!newDest.name.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDest, sortOrder: destinations.length }),
      })
      if (res.ok) {
        const created = await res.json()
        setDestinations((prev) => [...prev, created])
        setNewDest({ name: "", tagline: "", image: "", sortOrder: 0 })
        setShowAdd(false)
      }
    } catch (err) {
      console.error("Failed to create destination:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (dest: Destination) => {
    setEditingId(dest.id)
    setEditForm({ ...dest })
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.name?.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/destinations/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        const updated = await res.json()
        setDestinations((prev) => prev.map((d) => (d.id === editingId ? updated : d)))
        setEditingId(null)
        setEditForm({})
      }
    } catch (err) {
      console.error("Failed to update destination:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this destination?")) return
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" })
      if (res.ok) {
        setDestinations((prev) => prev.filter((d) => d.id !== id))
        if (editingId === id) {
          setEditingId(null)
          setEditForm({})
        }
      }
    } catch (err) {
      console.error("Failed to delete destination:", err)
    }
  }

  const moveDestination = async (id: number, direction: "up" | "down") => {
    const idx = destinations.findIndex((d) => d.id === id)
    if (idx === -1) return
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === destinations.length - 1) return

    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const newList = [...destinations]
    const temp = newList[idx]
    newList[idx] = newList[swapIdx]
    newList[swapIdx] = temp

    // Update sort orders
    const updated = newList.map((d, i) => ({ ...d, sortOrder: i }))
    setDestinations(updated)

    // Save both changed items
    try {
      await Promise.all([
        fetch(`/api/destinations/${updated[idx].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: updated[idx].sortOrder }),
        }),
        fetch(`/api/destinations/${updated[swapIdx].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: updated[swapIdx].sortOrder }),
        }),
      ])
    } catch (err) {
      console.error("Failed to reorder:", err)
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl lg:text-3xl tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Destinations
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Manage the destinations displayed in the &quot;Where We Journey&quot; section.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta text-primary-foreground rounded-lg font-sans text-sm hover:bg-sunset-orange transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground font-sans flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta" />
                New Destination
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newDest.name}
                    onChange={(e) => setNewDest((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta"
                    placeholder="e.g. Marrakech"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={newDest.tagline}
                    onChange={(e) => setNewDest((prev) => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta"
                    placeholder="e.g. The Red City"
                  />
                </div>
              </div>
              <ImageUpload
                value={newDest.image}
                onChange={(url) => setNewDest((prev) => ({ ...prev, image: url }))}
                label="Destination Image"
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAdd}
                  disabled={saving || !newDest.name.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta text-primary-foreground rounded-lg font-sans text-sm hover:bg-sunset-orange transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Add Destination"}
                </button>
                <button
                  onClick={() => {
                    setShowAdd(false)
                    setNewDest({ name: "", tagline: "", image: "", sortOrder: 0 })
                  }}
                  className="px-4 py-2.5 bg-muted text-muted-foreground rounded-lg font-sans text-sm hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destinations list */}
      <div className="space-y-3">
        {destinations.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-sans text-sm">
              No destinations yet. Add your first destination above.
            </p>
          </div>
        ) : (
          destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {editingId === dest.id ? (
                /* Edit mode */
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={editForm.tagline || ""}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, tagline: e.target.value }))}
                        className="w-full bg-muted px-3 py-2.5 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta"
                      />
                    </div>
                  </div>
                  <ImageUpload
                    value={editForm.image || ""}
                    onChange={(url) => setEditForm((prev) => ({ ...prev, image: url }))}
                    label="Destination Image"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta text-primary-foreground rounded-lg font-sans text-sm hover:bg-sunset-orange transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditForm({})
                      }}
                      className="px-4 py-2.5 bg-muted text-muted-foreground rounded-lg font-sans text-sm hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-center gap-4 p-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveDestination(dest.id, "up")}
                      disabled={idx === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      title="Move up"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>
                  {dest.image && (
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted relative">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground font-sans truncate">
                      {dest.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans truncate">
                      {dest.tagline}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(dest)}
                      className="px-3 py-1.5 text-xs font-sans bg-muted rounded-md hover:bg-muted/80 text-foreground transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
