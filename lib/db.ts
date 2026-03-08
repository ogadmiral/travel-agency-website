import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// --- Auto-migration: ensure all expected columns exist ---
let migrated = false

// Every column that might be missing from an older version of the table.
// The migration uses ADD COLUMN ... so it's safe to list columns that may already
// exist — we catch the "42701 column already exists" error.
const MIGRATION_COLUMNS: { name: string; type: string }[] = [
  // Columns that were added after the very first schema
  { name: "logo_image", type: "TEXT NOT NULL DEFAULT ''" },
  { name: "logo_width", type: "INTEGER NOT NULL DEFAULT 160" },
  { name: "site_name", type: "TEXT NOT NULL DEFAULT ''" },
  { name: "meta_title", type: "TEXT NOT NULL DEFAULT ''" },
  { name: "meta_description", type: "TEXT NOT NULL DEFAULT ''" },
  { name: "footer_description", type: "TEXT NOT NULL DEFAULT ''" },
  { name: "copyright_text", type: "TEXT NOT NULL DEFAULT ''" },
  { name: "marquee_items", type: "TEXT NOT NULL DEFAULT ''" },
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

export async function ensureMigrations() {
  if (migrated) return
  try {
    // Run individual ALTER TABLE statements — maximum compatibility
    for (const col of MIGRATION_COLUMNS) {
      try {
        await pool.query(`ALTER TABLE site_content ADD COLUMN ${col.name} ${col.type}`)
      } catch (e: unknown) {
        const code = (e as { code?: string }).code
        if (code !== "42701") {
          // 42701 = column already exists, ignore it
          console.error(`Migration column ${col.name}:`, e)
        }
      }
    }
    migrated = true
  } catch (err) {
    console.error("Auto-migration failed:", err)
  }
}

export default pool
