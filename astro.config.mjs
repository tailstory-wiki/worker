// @ts-check

import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  // Vendor `markdown-it` so it's bundled into the Worker rather than treated
  // as a Node built-in or external dependency.
  vite: {
    ssr: {
      noExternal: ["markdown-it"],
    },
  },
});
