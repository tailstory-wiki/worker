/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

interface Env {
  DOCS: R2Bucket;
  REGISTRY: D1Database;
  REGISTRY_TOKEN: string;
  ASSETS: Fetcher;
  CF_VERSION_METADATA: {
    id: string;
    tag: string;
    timestamp: string;
  };
}

// Make the typed bindings available on the `cloudflare:workers` `env` import
// (see `src/lib/env.ts`).
declare namespace Cloudflare {
  interface Env {
    DOCS: R2Bucket;
    REGISTRY: D1Database;
    REGISTRY_TOKEN: string;
    ASSETS: Fetcher;
    CF_VERSION_METADATA: {
      id: string;
      tag: string;
      timestamp: string;
    };
  }
}
