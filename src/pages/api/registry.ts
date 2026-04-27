import type { APIRoute } from "astro";
import { env } from "@/lib/env";

export const prerender = false;

interface RegisterPayload {
  vendor: { slug: string; name: string };
  product: { slug: string; name: string };
}

const SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;
const MAX_NAME_LEN = 100;

function isValidPayload(body: unknown): body is RegisterPayload {
  if (!body || typeof body !== "object") return false;
  const root = body as Record<string, unknown>;
  const vendor = root.vendor as Record<string, unknown> | undefined;
  const product = root.product as Record<string, unknown> | undefined;
  if (!vendor || !product) return false;
  if (typeof vendor.slug !== "string" || typeof vendor.name !== "string") {
    return false;
  }
  if (typeof product.slug !== "string" || typeof product.name !== "string") {
    return false;
  }
  if (!SLUG.test(vendor.slug) || !SLUG.test(product.slug)) return false;
  if (vendor.name.length === 0 || vendor.name.length > MAX_NAME_LEN) {
    return false;
  }
  if (product.name.length === 0 || product.name.length > MAX_NAME_LEN) {
    return false;
  }
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  const expected = env.REGISTRY_TOKEN;
  if (!expected) {
    return new Response("Registry not configured", { status: 503 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${expected}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!isValidPayload(body)) {
    return new Response("Invalid payload", { status: 400 });
  }

  const { vendor, product } = body;
  await env.REGISTRY.batch([
    env.REGISTRY.prepare(
      "INSERT INTO vendors (slug, name) VALUES (?1, ?2) ON CONFLICT(slug) DO UPDATE SET name = excluded.name",
    ).bind(vendor.slug, vendor.name),
    env.REGISTRY.prepare(
      "INSERT INTO products (vendor_slug, slug, name) VALUES (?1, ?2, ?3) ON CONFLICT(vendor_slug, slug) DO UPDATE SET name = excluded.name",
    ).bind(vendor.slug, product.slug, product.name),
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
