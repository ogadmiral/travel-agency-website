-- Migration: Add new customizable content fields to site_content table
-- Run this against your PostgreSQL database to add the new columns

ALTER TABLE site_content ADD COLUMN IF NOT EXISTS meta_title TEXT NOT NULL DEFAULT '';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS meta_description TEXT NOT NULL DEFAULT '';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS footer_description TEXT NOT NULL DEFAULT '';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS copyright_text TEXT NOT NULL DEFAULT '';
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS marquee_items TEXT NOT NULL DEFAULT '';
