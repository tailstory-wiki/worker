CREATE TABLE IF NOT EXISTS vendors (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  vendor_slug TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (vendor_slug, slug),
  FOREIGN KEY (vendor_slug) REFERENCES vendors(slug) ON DELETE CASCADE
);
