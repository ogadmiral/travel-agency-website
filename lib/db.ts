import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// --- Auto-migration: ensure all expected columns exist ---
let migrated = false

const MIGRATION_COLUMNS = [
  "about_second_paragraph",
  "destinations_heading",
  "destinations_tagline",
  "featured_heading",
  "featured_tagline",
  "featured_description",
  "stat1_number",
  "stat1_label",
  "stat2_number",
  "stat2_label",
  "stat3_number",
  "stat3_label",
  "stat4_number",
  "stat4_label",
]

export async function ensureMigrations() {
  if (migrated) return
  try {
    // Run individual ALTER TABLE statements — maximum compatibility
    for (const col of MIGRATION_COLUMNS) {
      try {
        await pool.query(`ALTER TABLE site_content ADD COLUMN ${col} TEXT NOT NULL DEFAULT ''`)
      } catch (e: unknown) {
        const code = (e as { code?: string }).code
        if (code !== "42701") {
          // 42701 = column already exists, ignore it
          console.error(`Migration column ${col}:`, e)
        }
      }
    }
    migrated = true
  } catch (err) {
    console.error("Auto-migration failed:", err)
  }
}

export default pool
