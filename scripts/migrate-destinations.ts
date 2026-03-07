/**
 * Migration: Add destinations table and new site_content columns.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx scripts/migrate-destinations.ts
 */
import { Pool } from "pg"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL env variable is required")
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function migrate() {
  const client = await pool.connect()
  try {
    // Create destinations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
        tagline TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `)
    console.log("✅  Destinations table created")

    // Add new columns to site_content (safe to run multiple times)
    const newColumns = [
      { name: "about_second_paragraph", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "destinations_heading", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "destinations_tagline", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "featured_heading", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "featured_tagline", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "featured_description", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat1_number", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat1_label", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat2_number", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat2_label", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat3_number", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat3_label", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat4_number", type: "TEXT NOT NULL DEFAULT ''" },
      { name: "stat4_label", type: "TEXT NOT NULL DEFAULT ''" },
    ]

    for (const col of newColumns) {
      try {
        await client.query(`ALTER TABLE site_content ADD COLUMN ${col.name} ${col.type}`)
        console.log(`✅  Added column site_content.${col.name}`)
      } catch (err: unknown) {
        const pgErr = err as { code?: string }
        if (pgErr.code === "42701") {
          // column already exists
          console.log(`⏭️  Column site_content.${col.name} already exists`)
        } else {
          throw err
        }
      }
    }

    // Seed default destinations if table is empty
    const { rows } = await client.query("SELECT COUNT(*) as count FROM destinations")
    if (parseInt(rows[0].count) === 0) {
      const defaults = [
        { name: "Marrakech", tagline: "The Red City", image: "/images/hero-morocco.jpg", sortOrder: 0 },
        { name: "Fes", tagline: "The Spiritual Capital", image: "/images/medina-streets.jpg", sortOrder: 1 },
        { name: "Sahara", tagline: "The Endless Sands", image: "/images/sahara-desert.jpg", sortOrder: 2 },
        { name: "Essaouira", tagline: "Wind City of the Atlantic", image: "/images/essaouira-coast.jpg", sortOrder: 3 },
      ]
      for (const d of defaults) {
        await client.query(
          "INSERT INTO destinations (name, tagline, image, sort_order) VALUES ($1,$2,$3,$4)",
          [d.name, d.tagline, d.image, d.sortOrder]
        )
      }
      console.log("✅  Seeded 4 default destinations")
    } else {
      console.log("⏭️  Destinations already have data, skipping seed")
    }

    console.log("\n🎉  Migration complete!")
  } catch (err) {
    console.error("❌  Migration failed:", err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
