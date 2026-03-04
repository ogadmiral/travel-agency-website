-- Tours table
CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration TEXT NOT NULL,
  next_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  subtitle TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT ''
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  guest TEXT NOT NULL,
  email TEXT NOT NULL,
  tour TEXT NOT NULL,
  date TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Pending',
  message TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL
);

-- Site content table (single row)
CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_heading TEXT NOT NULL DEFAULT '',
  hero_subheading TEXT NOT NULL DEFAULT '',
  hero_tagline TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  contact_phone TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  contact_address TEXT NOT NULL DEFAULT '',
  newsletter_text TEXT NOT NULL DEFAULT ''
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  tour TEXT,
  first_name TEXT,
  last_name TEXT,
  submitted_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'floating'
);
