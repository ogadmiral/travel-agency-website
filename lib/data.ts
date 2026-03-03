import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export function readJsonFile<T>(filename: string): T {
  ensureDataDir()
  const filePath = path.join(dataDir, filename)
  if (!fs.existsSync(filePath)) {
    return (filename.endsWith(".json") && !filename.includes("content") ? [] : {}) as T
  }
  const data = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(data) as T
}

export function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir()
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// --- Tour types ---
export interface Tour {
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

export function getTours(): Tour[] {
  return readJsonFile<Tour[]>("tours.json")
}

export function getTourById(id: number): Tour | undefined {
  return getTours().find((t) => t.id === id)
}

export function createTour(tour: Omit<Tour, "id">): Tour {
  const tours = getTours()
  const newId = tours.length > 0 ? Math.max(...tours.map((t) => t.id)) + 1 : 1
  const newTour = { ...tour, id: newId }
  tours.push(newTour)
  writeJsonFile("tours.json", tours)
  return newTour
}

export function updateTour(id: number, updates: Partial<Tour>): Tour | null {
  const tours = getTours()
  const idx = tours.findIndex((t) => t.id === id)
  if (idx === -1) return null
  tours[idx] = { ...tours[idx], ...updates, id }
  writeJsonFile("tours.json", tours)
  return tours[idx]
}

export function deleteTour(id: number): boolean {
  const tours = getTours()
  const filtered = tours.filter((t) => t.id !== id)
  if (filtered.length === tours.length) return false
  writeJsonFile("tours.json", filtered)
  return true
}

// --- Booking types ---
export interface Booking {
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

export function getBookings(): Booking[] {
  return readJsonFile<Booking[]>("bookings.json")
}

export function createBooking(booking: Omit<Booking, "id">): Booking {
  const bookings = getBookings()
  const newId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1
  const newBooking = { ...booking, id: newId }
  bookings.push(newBooking)
  writeJsonFile("bookings.json", bookings)
  return newBooking
}

export function updateBookingStatus(id: number, status: Booking["status"]): Booking | null {
  const bookings = getBookings()
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return null
  bookings[idx].status = status
  writeJsonFile("bookings.json", bookings)
  return bookings[idx]
}

// --- Site Content types ---
export interface SiteContent {
  heroHeading: string
  heroSubheading: string
  heroTagline: string
  aboutText: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
  newsletterText: string
}

export function getSiteContent(): SiteContent {
  return readJsonFile<SiteContent>("content.json")
}

export function updateSiteContent(content: SiteContent): SiteContent {
  writeJsonFile("content.json", content)
  return content
}

// --- Inquiry types ---
export interface Inquiry {
  id: number
  name: string
  email: string
  message: string
  tour?: string
  firstName?: string
  lastName?: string
  submittedAt: string
  source: "floating" | "contact"
}

export function getInquiries(): Inquiry[] {
  return readJsonFile<Inquiry[]>("inquiries.json")
}

export function createInquiry(inquiry: Omit<Inquiry, "id">): Inquiry {
  const inquiries = getInquiries()
  const newId = inquiries.length > 0 ? Math.max(...inquiries.map((i) => i.id)) + 1 : 1
  const newInquiry = { ...inquiry, id: newId }
  inquiries.push(newInquiry)
  writeJsonFile("inquiries.json", inquiries)
  return newInquiry
}
