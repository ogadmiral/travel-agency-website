/**
 * Seed script — run once to create tables and populate initial data.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx scripts/seed.ts
 */
import { Pool } from "pg"
import fs from "fs"
import path from "path"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL env variable is required")
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function seed() {
  const client = await pool.connect()
  try {
    // --- Create tables ---
    const schema = fs.readFileSync(path.join(__dirname, "../lib/schema.sql"), "utf-8")
    await client.query(schema)
    console.log("✅  Tables created")

    // --- Seed tours ---
    const tours = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/tours.json"), "utf-8")
    )
    for (const t of tours) {
      await client.query(
        `INSERT INTO tours (id, name, destination, price, duration, next_date, status, subtitle, image, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.name, t.destination, t.price, t.duration, t.nextDate, t.status, t.subtitle, t.image, t.description]
      )
    }
    // Reset sequence to max id
    await client.query(`SELECT setval('tours_id_seq', (SELECT COALESCE(MAX(id),0) FROM tours))`)
    console.log(`✅  Seeded ${tours.length} tours`)

    // --- Seed bookings ---
    const bookings = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/bookings.json"), "utf-8")
    )
    for (const b of bookings) {
      await client.query(
        `INSERT INTO bookings (id, guest, email, tour, date, guests, status, message, submitted_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [b.id, b.guest, b.email, b.tour, b.date, b.guests, b.status, b.message, b.submittedAt]
      )
    }
    await client.query(`SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id),0) FROM bookings))`)
    console.log(`✅  Seeded ${bookings.length} bookings`)

    // --- Seed content ---
    const content = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/content.json"), "utf-8")
    )
    await client.query(
      `INSERT INTO site_content (id, hero_heading, hero_subheading, hero_tagline, about_text, contact_phone, contact_email, contact_address, newsletter_text)
       VALUES (1,$1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET
         hero_heading = $1, hero_subheading = $2, hero_tagline = $3,
         about_text = $4, contact_phone = $5, contact_email = $6,
         contact_address = $7, newsletter_text = $8`,
      [
        content.heroHeading, content.heroSubheading, content.heroTagline,
        content.aboutText, content.contactPhone, content.contactEmail,
        content.contactAddress, content.newsletterText,
      ]
    )
    console.log("✅  Seeded site content")

    // --- Seed inquiries ---
    const inquiries = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/inquiries.json"), "utf-8")
    )
    for (const i of inquiries) {
      await client.query(
        `INSERT INTO inquiries (id, name, email, message, tour, first_name, last_name, submitted_at, source)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO NOTHING`,
        [i.id, i.name || "", i.email, i.message, i.tour || null, i.firstName || null, i.lastName || null, i.submittedAt, i.source]
      )
    }
    await client.query(`SELECT setval('inquiries_id_seq', (SELECT COALESCE(MAX(id),0) FROM inquiries))`)
    console.log(`✅  Seeded ${inquiries.length} inquiries`)

    // --- Seed destinations ---
    const destinations = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/destinations.json"), "utf-8")
    )
    for (const d of destinations) {
      await client.query(
        `INSERT INTO destinations (name, tagline, image, sort_order)
         VALUES ($1,$2,$3,$4)`,
        [d.name, d.tagline, d.image, d.sortOrder]
      )
    }
    console.log(`✅  Seeded ${destinations.length} destinations`)

    console.log("\n🎉  Database seeded successfully!")
  } catch (err) {
    console.error("❌  Seed failed:", err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
