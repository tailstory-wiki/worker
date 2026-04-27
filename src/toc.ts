import type { ResolvedToc, Toc } from "./types";

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
