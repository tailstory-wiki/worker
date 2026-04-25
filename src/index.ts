export interface Env {
  DOCS: R2Bucket;
}

interface Product {
  slug: string;
  name: string;
}

interface Vendor {
  slug: string;
  name: string;
  products: Product[];
}

interface Registry {
  vendors: Vendor[];
}

interface ParsedPath {
  vendor: string;
  product: string;
  page: string;
}

function parsePath(pathname: string): ParsedPath | null {
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const [vendor, product, ...rest] = segments;
  const page = rest.length === 0 ? "index" : rest.join("/");
  return { vendor, product, page };
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

async function fetchPartial(bucket: R2Bucket, parsed: ParsedPath): Promise<string | null> {
  const key = `${parsed.vendor}/${parsed.product}/${parsed.page}/index.html`;
  const obj = await bucket.get(key);
  if (!obj) return null;
  return await obj.text();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHome(registry: Registry | null): string {
  const body = registry
    ? registry.vendors
        .map(
          (v) => `
    <section class="vendor">
      <h2>${escapeHtml(v.name)}</h2>
      <ul>
        ${v.products
          .map(
            (p) =>
              `<li><a href="/${escapeHtml(v.slug)}/${escapeHtml(p.slug)}">${escapeHtml(p.name)}</a></li>`,
          )
          .join("")}
      </ul>
    </section>`,
        )
        .join("")
    : `<p>Registry unavailable.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>tailstory wiki</title>
</head>
<body>
  <header>
    <h1>tailstory wiki</h1>
  </header>
  <main>
    ${body}
  </main>
</body>
</html>`;
}

function renderPage(parsed: ParsedPath, partial: string): string {
  const title = `${parsed.product} — tailstory wiki`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <header>
    <a href="/">tailstory wiki</a>
    <nav>
      <span>${escapeHtml(parsed.vendor)}</span> / <span>${escapeHtml(parsed.product)}</span>
    </nav>
  </header>
  <main>
    ${partial}
  </main>
  <footer>
    <p>tailstory wiki</p>
  </footer>
</body>
</html>`;
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}

function notFound(message: string): Response {
  return htmlResponse(
    `<!DOCTYPE html><html><body><h1>404</h1><p>${escapeHtml(message)}</p></body></html>`,
    404,
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      const registry = await fetchRegistry(env.DOCS);
      return htmlResponse(renderHome(registry));
    }

    const parsed = parsePath(url.pathname);
    if (!parsed) {
      return notFound("Path must be /{vendor}/{product} or /{vendor}/{product}/{page}.");
    }

    const partial = await fetchPartial(env.DOCS, parsed);
    if (partial === null) {
      return notFound(`No doc found at ${parsed.vendor}/${parsed.product}/${parsed.page}.`);
    }

    return htmlResponse(renderPage(parsed, partial));
  },
} satisfies ExportedHandler<Env>;
