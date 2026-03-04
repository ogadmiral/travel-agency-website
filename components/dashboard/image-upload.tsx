"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  className?: string
}

export function ImageUpload({ value, onChange, label, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        onChange(data.url)
      } else {
        const err = await res.json()
        alert(err.error || "Upload failed")
      }
    } catch {
      alert("Upload failed")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
      setShowUrlInput(false)
    }
  }

  const handleClear = () => {
    onChange("")
  }

  return (
    <div className={className}>
      <label className="text-xs font-sans uppercase tracking-wider text-muted-foreground block mb-1.5">
        {label}
      </label>

      {value ? (
        <div className="relative group">
          <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Replace image"
            >
              <Upload className="w-4 h-4 text-white" />
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Use URL"
            >
              <LinkIcon className="w-4 h-4 text-white" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border rounded-md hover:border-terracotta/50 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-sans">Upload</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center justify-center gap-2 h-24 px-4 border-2 border-dashed border-border rounded-md hover:border-terracotta/50 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-sans">URL</span>
          </button>
        </div>
      )}

      {showUrlInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            className="flex-1 bg-muted px-3 py-2 rounded-md text-sm font-sans text-foreground outline-none focus:ring-1 focus:ring-terracotta"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-terracotta text-white rounded-md text-sm font-sans hover:bg-sunset-orange transition-colors"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => { setShowUrlInput(false); setUrlInput("") }}
            className="px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm font-sans hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}
