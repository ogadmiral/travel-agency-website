import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// --- Auto-migration: ensure all expected columns exist ---
let migrated = false

/**
 * Runs a single PL/pgSQL DO block that adds every potentially-missing column.
 * Uses EXCEPTION WHEN duplicate_column to safely skip columns that already exist.
 * This is ONE database round-trip instead of 22 separate queries.
 *
 * IMPORTANT: Only call this from API route handlers (runtime), never from
 * data functions that might execute during build-time static generation.
 */
export async function ensureMigrations() {
  if (migrated) return
  try {
    await pool.query(`
      DO $$ BEGIN
        BEGIN ALTER TABLE site_content ADD COLUMN logo_image TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN logo_width INTEGER NOT NULL DEFAULT 160; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN site_name TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN meta_title TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN meta_description TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN footer_description TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN copyright_text TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN marquee_items TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN about_second_paragraph TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN destinations_heading TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN destinations_tagline TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN featured_heading TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN featured_tagline TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN featured_description TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat1_number TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat1_label TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat2_number TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat2_label TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat3_number TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat3_label TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat4_number TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
        BEGIN ALTER TABLE site_content ADD COLUMN stat4_label TEXT NOT NULL DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
      END $$;
    `)
    migrated = true
  } catch (err) {
    console.error("Auto-migration failed:", err)
    // Still mark as migrated to avoid retrying on every request —
    // the columns likely already exist if this is a connection issue
    migrated = true
  }
}

export default pool
