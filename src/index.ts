export interface Env {
  DOCS: R2Bucket;
}

interface ParsedPath {
  vendor: string;
  product: string;
  page: string; // "index" if not specified
}

function parsePath(pathname: string): ParsedPath | null {
  // Strip leading/trailing slashes, split into segments
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

  if (segments.length < 2) return null;

  const [vendor, product, ...rest] = segments;
  const page = rest.length === 0 ? "index" : rest.join("/");

  return { vendor, product, page };
}

async function fetchPartial(
  bucket: R2Bucket,
  parsed: ParsedPath,
): Promise<string | null> {
  const key = `${parsed.vendor}/${parsed.product}/${parsed.page}/index.html`;
  const obj = await bucket.get(key);
  if (!obj) return null;
  return await obj.text();
}

function renderPage(parsed: ParsedPath, partial: string): string {
  const title = `${parsed.product} — tailstory wiki`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <header>
    <a href="/">tailstory wiki</a>
    <nav>
      <span>${parsed.vendor}</span> / <span>${parsed.product}</span>
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

function notFound(message: string): Response {
  return new Response(`<!DOCTYPE html><html><body><h1>404</h1><p>${message}</p></body></html>`, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        "<!DOCTYPE html><html><body><h1>tailstory wiki</h1><p>Pick a product.</p></body></html>",
        { headers: { "Content-Type": "text/html; charset=utf-8" } },
      );
    }

    const parsed = parsePath(url.pathname);
    if (!parsed) {
      return notFound("Path must be /{vendor}/{product} or /{vendor}/{product}/{page}.");
    }

    const partial = await fetchPartial(env.DOCS, parsed);
    if (partial === null) {
      return notFound(`No doc found at ${parsed.vendor}/${parsed.product}/${parsed.page}.`);
    }

    const html = renderPage(parsed, partial);
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  },
} satisfies ExportedHandler<Env>;
