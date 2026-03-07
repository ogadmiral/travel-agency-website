import pool, { ensureMigrations } from "./db"

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
  heroImage: string
  aboutImage: string
  logoImage: string
  logoWidth: number
  siteName: string
  metaTitle: string
  metaDescription: string
  footerDescription: string
  copyrightText: string
  marqueeItems: string
  aboutSecondParagraph: string
  destinationsHeading: string
  destinationsTagline: string
  featuredHeading: string
  featuredTagline: string
  featuredDescription: string
  stat1Number: string
  stat1Label: string
  stat2Number: string
  stat2Label: string
  stat3Number: string
  stat3Label: string
  stat4Number: string
  stat4Label: string
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
    heroImage: (row.hero_image as string) || "",
    aboutImage: (row.about_image as string) || "",
    logoImage: (row.logo_image as string) || "",
    logoWidth: (row.logo_width as number) || 160,
    siteName: (row.site_name as string) || "",
    metaTitle: (row.meta_title as string) || "",
    metaDescription: (row.meta_description as string) || "",
    footerDescription: (row.footer_description as string) || "",
    copyrightText: (row.copyright_text as string) || "",
    marqueeItems: (row.marquee_items as string) || "",
    aboutSecondParagraph: (row.about_second_paragraph as string) || "",
    destinationsHeading: (row.destinations_heading as string) || "",
    destinationsTagline: (row.destinations_tagline as string) || "",
    featuredHeading: (row.featured_heading as string) || "",
    featuredTagline: (row.featured_tagline as string) || "",
    featuredDescription: (row.featured_description as string) || "",
    stat1Number: (row.stat1_number as string) || "",
    stat1Label: (row.stat1_label as string) || "",
    stat2Number: (row.stat2_number as string) || "",
    stat2Label: (row.stat2_label as string) || "",
    stat3Number: (row.stat3_number as string) || "",
    stat3Label: (row.stat3_label as string) || "",
    stat4Number: (row.stat4_number as string) || "",
    stat4Label: (row.stat4_label as string) || "",
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  await ensureMigrations()
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
    heroImage: "",
    aboutImage: "",
    logoImage: "",
    logoWidth: 160,
    siteName: "",
    metaTitle: "",
    metaDescription: "",
    footerDescription: "",
    copyrightText: "",
    marqueeItems: "",
    aboutSecondParagraph: "",
    destinationsHeading: "",
    destinationsTagline: "",
    featuredHeading: "",
    featuredTagline: "",
    featuredDescription: "",
    stat1Number: "",
    stat1Label: "",
    stat2Number: "",
    stat2Label: "",
    stat3Number: "",
    stat3Label: "",
    stat4Number: "",
    stat4Label: "",
  }
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  await ensureMigrations()
  const { rows } = await pool.query(
    `INSERT INTO site_content (id, hero_heading, hero_subheading, hero_tagline, about_text, contact_phone, contact_email, contact_address, newsletter_text, hero_image, about_image, logo_image, logo_width, site_name, meta_title, meta_description, footer_description, copyright_text, marquee_items, about_second_paragraph, destinations_heading, destinations_tagline, featured_heading, featured_tagline, featured_description, stat1_number, stat1_label, stat2_number, stat2_label, stat3_number, stat3_label, stat4_number, stat4_label)
     VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32)
     ON CONFLICT (id) DO UPDATE SET
       hero_heading=$1, hero_subheading=$2, hero_tagline=$3, about_text=$4,
       contact_phone=$5, contact_email=$6, contact_address=$7, newsletter_text=$8,
       hero_image=$9, about_image=$10,
       logo_image=$11, logo_width=$12, site_name=$13,
       meta_title=$14, meta_description=$15, footer_description=$16, copyright_text=$17, marquee_items=$18,
       about_second_paragraph=$19, destinations_heading=$20, destinations_tagline=$21,
       featured_heading=$22, featured_tagline=$23, featured_description=$24,
       stat1_number=$25, stat1_label=$26, stat2_number=$27, stat2_label=$28,
       stat3_number=$29, stat3_label=$30, stat4_number=$31, stat4_label=$32
     RETURNING *`,
    [content.heroHeading, content.heroSubheading, content.heroTagline, content.aboutText, content.contactPhone, content.contactEmail, content.contactAddress, content.newsletterText, content.heroImage || "", content.aboutImage || "", content.logoImage || "", content.logoWidth || 160, content.siteName || "", content.metaTitle || "", content.metaDescription || "", content.footerDescription || "", content.copyrightText || "", content.marqueeItems || "", content.aboutSecondParagraph || "", content.destinationsHeading || "", content.destinationsTagline || "", content.featuredHeading || "", content.featuredTagline || "", content.featuredDescription || "", content.stat1Number || "", content.stat1Label || "", content.stat2Number || "", content.stat2Label || "", content.stat3Number || "", content.stat3Label || "", content.stat4Number || "", content.stat4Label || ""]
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

// --- Destination types ---
export interface Destination {
  id: number
  name: string
  tagline: string
  image: string
  sortOrder: number
}

function rowToDestination(row: Record<string, unknown>): Destination {
  return {
    id: row.id as number,
    name: row.name as string,
    tagline: row.tagline as string,
    image: row.image as string,
    sortOrder: row.sort_order as number,
  }
}

export async function getDestinations(): Promise<Destination[]> {
  const { rows } = await pool.query("SELECT * FROM destinations ORDER BY sort_order, id")
  return rows.map(rowToDestination)
}

export async function getDestinationById(id: number): Promise<Destination | undefined> {
  const { rows } = await pool.query("SELECT * FROM destinations WHERE id = $1", [id])
  return rows[0] ? rowToDestination(rows[0]) : undefined
}

export async function createDestination(dest: Omit<Destination, "id">): Promise<Destination> {
  const { rows } = await pool.query(
    `INSERT INTO destinations (name, tagline, image, sort_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [dest.name, dest.tagline, dest.image, dest.sortOrder]
  )
  return rowToDestination(rows[0])
}

export async function updateDestination(id: number, updates: Partial<Destination>): Promise<Destination | null> {
  const existing = await getDestinationById(id)
  if (!existing) return null
  const merged = { ...existing, ...updates, id }
  const { rows } = await pool.query(
    `UPDATE destinations SET name=$1, tagline=$2, image=$3, sort_order=$4
     WHERE id=$5 RETURNING *`,
    [merged.name, merged.tagline, merged.image, merged.sortOrder, id]
  )
  return rows[0] ? rowToDestination(rows[0]) : null
}

export async function deleteDestination(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM destinations WHERE id = $1", [id])
  return (rowCount ?? 0) > 0
}
