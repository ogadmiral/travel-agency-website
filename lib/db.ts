import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// --- Auto-migration: ensure all expected columns exist ---
let migrated = false

export async function ensureMigrations() {
  if (migrated) return
  try {
    // Use ADD COLUMN IF NOT EXISTS (PostgreSQL 9.6+) in a single statement
    await pool.query(`
      ALTER TABLE site_content
        ADD COLUMN IF NOT EXISTS about_second_paragraph TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS destinations_heading TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS destinations_tagline TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS featured_heading TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS featured_tagline TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS featured_description TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat1_number TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat1_label TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat2_number TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat2_label TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat3_number TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat3_label TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat4_number TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS stat4_label TEXT NOT NULL DEFAULT ''
    `)
    // Only mark as migrated after success
    migrated = true
  } catch (err) {
    console.error("Auto-migration failed:", err)
    // Don't set migrated=true so it retries on next request
  }
}

export default pool
