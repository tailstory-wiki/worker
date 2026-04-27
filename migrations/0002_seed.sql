-- Seed from the historical registry.json so existing routes keep
-- working before each docs repo's workflow has run. Docs repos
-- overwrite their own rows on first publish via POST /api/registry.
INSERT OR IGNORE INTO vendors (slug, name) VALUES
  ('shopworks', 'ShopWorks'),
  ('ups', 'UPS'),
  ('fedex', 'FedEx');

INSERT OR IGNORE INTO products (vendor_slug, slug, name) VALUES
  ('shopworks', 'onsite', 'OnSite'),
  ('ups', 'worldship', 'WorldShip'),
  ('fedex', 'shipmanager', 'Ship Manager');
