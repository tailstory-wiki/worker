# worker

Astro 6 site running on Cloudflare Workers. The Worker SSRs pages whose
content (per-product TOCs and pre-rendered HTML partials) is served from
an R2 bucket, with vendor/product display names sourced from a D1
database that each docs repo updates from its publish workflow.

## Scripts

- `npm run dev` – Astro dev server.
- `npm run build` – produce the Cloudflare Worker bundle in `dist/`.

## Project layout

- `src/pages/` – file-based routes (`/`, `/[vendor]`, `/[vendor]/[product]/[...page]`, `/api/registry`, `404`).
- `src/layouts/Layout.astro` – shared chrome (head, header, theme switcher, footer).
- `src/components/` – `ThemeSwitcher`, `TocRail`, `NotFound`, etc.
- `src/lib/` – shared helpers (`docs`, `markdown`, `env`, `types`).
- `migrations/` – D1 schema migrations.
- `public/` – static assets served at the site root.

## Registry (D1)

The vendor/product registry lives in a D1 database bound as `REGISTRY`.
First-time setup:

```sh
npx wrangler d1 create tailstory-wiki-registry
# paste the returned database_id into wrangler.jsonc
npx wrangler d1 migrations apply tailstory-wiki-registry --remote
```

Docs repos register themselves by POSTing to `/api/registry` with a
bearer token. Set the token as a Worker secret:

```sh
npx wrangler secret put REGISTRY_TOKEN
```

The same value goes into the org-level GitHub Actions secret
`WIKI_REGISTRY_TOKEN`, which the builder reusable workflow forwards to
its `register` job.

### Payload

```json
{
  "vendor":  { "slug": "shopworks", "name": "ShopWorks" },
  "product": { "slug": "onsite",    "name": "OnSite"    }
}
```

Slugs must match `^[a-z0-9][a-z0-9-]{0,62}$`; names are 1–100 chars.
