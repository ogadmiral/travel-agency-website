import pool from "./db"

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

function rowToTour(row: Record<string, unknown>): Tour {
  return {
    id: row.id as number,
    name: row.name as string,
    destination: row.destination as string,
    price: row.price as number,
    duration: row.duration as string,
    nextDate: row.next_date as string,
    status: row.status as Tour["status"],
    subtitle: row.subtitle as string,
    image: row.image as string,
    description: row.description as string,
  }
}

export async function getTours(): Promise<Tour[]> {
  const { rows } = await pool.query("SELECT * FROM tours ORDER BY id")
  return rows.map(rowToTour)
}

export async function getTourById(id: number): Promise<Tour | undefined> {
  const { rows } = await pool.query("SELECT * FROM tours WHERE id = $1", [id])
  return rows[0] ? rowToTour(rows[0]) : undefined
}

export async function createTour(tour: Omit<Tour, "id">): Promise<Tour> {
  const { rows } = await pool.query(
    `INSERT INTO tours (name, destination, price, duration, next_date, status, subtitle, image, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [tour.name, tour.destination, tour.price, tour.duration, tour.nextDate, tour.status, tour.subtitle, tour.image, tour.description]
  )
  return rowToTour(rows[0])
}

export async function updateTour(id: number, updates: Partial<Tour>): Promise<Tour | null> {
  const existing = await getTourById(id)
  if (!existing) return null
  const merged = { ...existing, ...updates, id }
  const { rows } = await pool.query(
    `UPDATE tours SET name=$1, destination=$2, price=$3, duration=$4, next_date=$5, status=$6, subtitle=$7, image=$8, description=$9
     WHERE id=$10 RETURNING *`,
    [merged.name, merged.destination, merged.price, merged.duration, merged.nextDate, merged.status, merged.subtitle, merged.image, merged.description, id]
  )
  return rows[0] ? rowToTour(rows[0]) : null
}

export async function deleteTour(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM tours WHERE id = $1", [id])
  return (rowCount ?? 0) > 0
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

function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as number,
    guest: row.guest as string,
    email: row.email as string,
    tour: row.tour as string,
    date: row.date as string,
    guests: row.guests as number,
    status: row.status as Booking["status"],
    message: row.message as string,
    submittedAt: row.submitted_at as string,
  }
}

export async function getBookings(): Promise<Booking[]> {
  const { rows } = await pool.query("SELECT * FROM bookings ORDER BY id DESC")
  return rows.map(rowToBooking)
}

export async function createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
  const { rows } = await pool.query(
    `INSERT INTO bookings (guest, email, tour, date, guests, status, message, submitted_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [booking.guest, booking.email, booking.tour, booking.date, booking.guests, booking.status, booking.message, booking.submittedAt]
  )
  return rowToBooking(rows[0])
}

export async function updateBookingStatus(id: number, status: Booking["status"]): Promise<Booking | null> {
  const { rows } = await pool.query(
    "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  )
  return rows[0] ? rowToBooking(rows[0]) : null
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

function rowToContent(row: Record<string, unknown>): SiteContent {
  return {
    heroHeading: row.hero_heading as string,
    heroSubheading: row.hero_subheading as string,
    heroTagline: row.hero_tagline as string,
    aboutText: row.about_text as string,
    contactPhone: row.contact_phone as string,
    contactEmail: row.contact_email as string,
    contactAddress: row.contact_address as string,
    newsletterText: row.newsletter_text as string,
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const { rows } = await pool.query("SELECT * FROM site_content WHERE id = 1")
  if (rows[0]) return rowToContent(rows[0])
  // Return defaults if no row exists
  return {
    heroHeading: "",
    heroSubheading: "",
    heroTagline: "",
    aboutText: "",
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    newsletterText: "",
  }
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  const { rows } = await pool.query(
    `INSERT INTO site_content (id, hero_heading, hero_subheading, hero_tagline, about_text, contact_phone, contact_email, contact_address, newsletter_text)
     VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id) DO UPDATE SET
       hero_heading=$1, hero_subheading=$2, hero_tagline=$3, about_text=$4,
       contact_phone=$5, contact_email=$6, contact_address=$7, newsletter_text=$8
     RETURNING *`,
    [content.heroHeading, content.heroSubheading, content.heroTagline, content.aboutText, content.contactPhone, content.contactEmail, content.contactAddress, content.newsletterText]
  )
  return rowToContent(rows[0])
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

function rowToInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    message: row.message as string,
    tour: (row.tour as string) || undefined,
    firstName: (row.first_name as string) || undefined,
    lastName: (row.last_name as string) || undefined,
    submittedAt: row.submitted_at as string,
    source: row.source as Inquiry["source"],
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  const { rows } = await pool.query("SELECT * FROM inquiries ORDER BY id DESC")
  return rows.map(rowToInquiry)
}

export async function createInquiry(inquiry: Omit<Inquiry, "id">): Promise<Inquiry> {
  const { rows } = await pool.query(
    `INSERT INTO inquiries (name, email, message, tour, first_name, last_name, submitted_at, source)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [inquiry.name, inquiry.email, inquiry.message, inquiry.tour || null, inquiry.firstName || null, inquiry.lastName || null, inquiry.submittedAt, inquiry.source]
  )
  return rowToInquiry(rows[0])
}
