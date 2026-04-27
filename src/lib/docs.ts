import type { Product, Registry, ResolvedToc, Toc, Vendor } from "@/lib/types";

interface RegistryRow {
  vendor_slug: string;
  vendor_name: string;
  product_slug: string | null;
  product_name: string | null;
}

export async function fetchRegistry(db: D1Database): Promise<Registry | null> {
  try {
    const result = await db
      .prepare(
        `SELECT v.slug AS vendor_slug, v.name AS vendor_name,
                p.slug AS product_slug, p.name AS product_name
         FROM vendors v
         LEFT JOIN products p ON p.vendor_slug = v.slug
         ORDER BY v.slug, p.slug`,
      )
      .all<RegistryRow>();

    const byVendor = new Map<string, Vendor>();
    for (const row of result.results) {
      let vendor = byVendor.get(row.vendor_slug);
      if (!vendor) {
        vendor = {
          slug: row.vendor_slug,
          name: row.vendor_name,
          products: [],
        };
        byVendor.set(row.vendor_slug, vendor);
      }
      if (row.product_slug && row.product_name) {
        const product: Product = {
          slug: row.product_slug,
          name: row.product_name,
        };
        vendor.products.push(product);
      }
    }
    return { vendors: [...byVendor.values()] };
  } catch {
    return null;
  }
}

export async function fetchPagePartial(
  bucket: R2Bucket,
  vendor: string,
  product: string,
  page: string,
): Promise<string | null> {
  const key =
    page === "index"
      ? `${vendor}/${product}/index.html`
      : `${vendor}/${product}/${page}/index.html`;
  const obj = await bucket.get(key);
  if (!obj) return null;
  return await obj.text();
}

export function tocEntryUrl(
  vendor: string,
  product: string,
  tocDir: string,
  pageSlug: string,
): string {
  const parts = [vendor, product];
  if (tocDir) parts.push(tocDir);
  if (pageSlug !== "index") parts.push(pageSlug);
  return `/${parts.join("/")}`;
}

function parentDir(dir: string): string {
  const idx = dir.lastIndexOf("/");
  return idx === -1 ? "" : dir.slice(0, idx);
}

export async function resolveToc(
  bucket: R2Bucket,
  vendor: string,
  product: string,
  page: string,
): Promise<ResolvedToc | null> {
  // Start at `page` itself (treating it as a potential directory) so that
  // directory landing pages like /v/p/inventory pick up inventory/toc.json
  // when one exists. If nothing matches, walk up to product root.
  let dir = page === "index" ? "" : page;
  while (true) {
    const key = dir
      ? `${vendor}/${product}/${dir}/toc.json`
      : `${vendor}/${product}/toc.json`;
    const obj = await bucket.get(key);
    if (obj) {
      try {
        const toc = await obj.json<Toc>();
        return { toc, tocDir: dir };
      } catch {
        // Malformed JSON at this level: skip and walk up.
      }
    }
    if (!dir) return null;
    dir = parentDir(dir);
  }
}

export function relativeSlug(page: string, tocDir: string): string {
  if (page === "index") return "index";
  if (tocDir === "") return page;
  if (page === tocDir) return "index";
  return page.slice(tocDir.length + 1);
}
