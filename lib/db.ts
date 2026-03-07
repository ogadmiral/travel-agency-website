import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// --- Auto-migration: ensure all expected columns exist ---
let migrated = false

const EXPECTED_COLUMNS: { table: string; name: string; type: string }[] = [
  { table: "site_content", name: "about_second_paragraph", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "destinations_heading", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "destinations_tagline", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "featured_heading", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "featured_tagline", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "featured_description", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat1_number", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat1_label", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat2_number", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat2_label", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat3_number", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat3_label", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat4_number", type: "TEXT NOT NULL DEFAULT ''" },
  { table: "site_content", name: "stat4_label", type: "TEXT NOT NULL DEFAULT ''" },
]

export async function ensureMigrations() {
  if (migrated) return
  migrated = true
  try {
    for (const col of EXPECTED_COLUMNS) {
      try {
        await pool.query(`ALTER TABLE ${col.table} ADD COLUMN ${col.name} ${col.type}`)
      } catch (err: unknown) {
        const pgErr = err as { code?: string }
        // 42701 = column already exists, 42P01 = table doesn't exist — both are fine
        if (pgErr.code !== "42701" && pgErr.code !== "42P01") {
          console.error(`Migration warning for ${col.table}.${col.name}:`, err)
        }
      }
    }
  } catch {
    // Non-fatal: if migrations fail, queries will surface the real error
  }
}

export default pool
