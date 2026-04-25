import { Home } from "./templates/home";
import { NotFound } from "./templates/not-found";
import { Page } from "./templates/page";
import { VendorPage } from "./templates/vendor";
import type { Env, ParsedPath, Registry } from "./types";

function parsePath(pathname: string): ParsedPath | null {
  const segments = pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  if (segments.length === 0) return null;

  if (segments.length === 1) {
    return { kind: "vendor", vendor: segments[0]! };
  }

  const vendor = segments[0]!;
  const product = segments[1]!;
  const rest = segments.slice(2);
  const page = rest.length === 0 ? "index" : rest.join("/");
  return { kind: "page", vendor, product, page };
}

async function fetchRegistry(bucket: R2Bucket): Promise<Registry | null> {
  const obj = await bucket.get("registry.json");
  if (!obj) return null;
  try {
    return await obj.json<Registry>();
  } catch {
    return null;
  }
}

async function fetchPartial(
  bucket: R2Bucket,
  parsed: Extract<ParsedPath, { kind: "page" }>,
): Promise<string | null> {
  const key =
    parsed.page === "index"
      ? `${parsed.vendor}/${parsed.product}/index.html`
      : `${parsed.vendor}/${parsed.product}/${parsed.page}/index.html`;
  const obj = await bucket.get(key);
  if (!obj) return null;
  return await obj.text();
}

function htmlResponse(node: { toString(): string }, status = 200): Response {
  return new Response(`<!DOCTYPE html>${node.toString()}`, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const version = env.CF_VERSION_METADATA?.id ?? "";

    if (url.pathname === "/" || url.pathname === "") {
      const registry = await fetchRegistry(env.DOCS);
      return htmlResponse(<Home registry={registry} version={version} />);
    }

    const parsed = parsePath(url.pathname);
    if (!parsed) {
      return htmlResponse(
        <NotFound message="Page not found." version={version} />,
        404,
      );
    }

    if (parsed.kind === "vendor") {
      const registry = await fetchRegistry(env.DOCS);
      const vendor = registry?.vendors.find((v) => v.slug === parsed.vendor);
      if (!vendor) {
        return htmlResponse(
          <NotFound
            message={`No vendor named ${parsed.vendor}.`}
            version={version}
          />,
          404,
        );
      }
      return htmlResponse(<VendorPage vendor={vendor} version={version} />);
    }

    const [partial, registry] = await Promise.all([
      fetchPartial(env.DOCS, parsed),
      fetchRegistry(env.DOCS),
    ]);
    if (partial === null) {
      return htmlResponse(
        <NotFound
          message={`No doc found at ${parsed.vendor}/${parsed.product}/${parsed.page}.`}
          version={version}
        />,
        404,
      );
    }

    const vendor = registry?.vendors.find((v) => v.slug === parsed.vendor);
    const product = vendor?.products.find((p) => p.slug === parsed.product);

    return htmlResponse(
      <Page
        parsed={parsed}
        partial={partial}
        version={version}
        vendorName={vendor?.name}
        productName={product?.name}
      />,
    );
  },
} satisfies ExportedHandler<Env>;
