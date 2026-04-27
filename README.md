# worker

Astro 6 site running on Cloudflare Workers. The Worker SSRs pages whose
content (registry, per-product TOCs, and pre-rendered HTML partials) is
served from an R2 bucket.

## Scripts

- `npm run dev` – Astro dev server.
- `npm run build` – produce the Cloudflare Worker bundle in `dist/`.

## Project layout

- `src/pages/` – file-based routes (`/`, `/[vendor]`, `/[vendor]/[product]/[...page]`, `404`).
- `src/layouts/Layout.astro` – shared chrome (head, header, theme switcher, footer).
- `src/components/` – `ThemeSwitcher`, `TocRail`, `NotFound`, etc.
- `src/lib/` – shared helpers (`docs`, `markdown`, `env`, `types`).
- `public/` – static assets served at the site root.
