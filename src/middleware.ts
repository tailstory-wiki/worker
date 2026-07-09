import { defineMiddleware } from "astro:middleware";
import { fetchPageMarkdown } from "@/lib/docs";
import { env } from "@/lib/env";

// Serve a page's raw Markdown source at its `.md` URL (e.g. `/acme/onsite.md`,
// `/acme/onsite/guides/intro.md`), reading the object the builder publishes to
// R2 alongside the rendered partial. Handling this in middleware keeps it
// deterministic: the `[vendor]/[product]/[...page].astro` catch-all would
// otherwise also match `.md` paths.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (context.request.method !== "GET" || !pathname.endsWith(".md")) {
    return next();
  }

  const segments = pathname.slice(0, -".md".length).split("/").filter(Boolean);
  if (segments.length < 2) return next();

  const [vendor, product, ...pageParts] = segments;
  const page = pageParts.length > 0 ? pageParts.join("/") : "index";

  const markdown = await fetchPageMarkdown(env.DOCS, vendor, product, page);
  if (markdown === null) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(markdown, {
    status: 200,
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
});
