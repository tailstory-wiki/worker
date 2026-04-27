// Centralised, typed accessor for the Cloudflare Workers runtime bindings.
// Astro 6 removed `Astro.locals.runtime.env`; the supported pattern is to
// import bindings directly from the `cloudflare:workers` virtual module.
// `Cloudflare.Env` is augmented in `src/env.d.ts` to describe our bindings.
export { env } from "cloudflare:workers";
