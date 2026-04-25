import type { FC } from "hono/jsx";
import type { Vendor } from "../types";
import { Shell } from "./shell";

interface VendorProps {
  vendor: Vendor;
}

export const VendorPage: FC<VendorProps> = ({ vendor }) => (
  <Shell title={`${vendor.name} — Tailstory wiki`}>
    <header class="site-header">
      <a href="/" class="site-title">Tailstory wiki</a>
    </header>
    <main class="home">
      <section class="hero">
        <h1>{vendor.name}</h1>
      </section>
      <section class="vendor-index">
        <h2>Products</h2>
        <ul class="vendor-list">
          {[...vendor.products]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <li>
                <a href={`/${vendor.slug}/${p.slug}`}>{p.name}</a>
              </li>
            ))}
        </ul>
      </section>
    </main>
    <footer class="site-footer">
      <p>
        <a href="https://github.com/tailstory-wiki">Source on GitHub</a>
      </p>
    </footer>
  </Shell>
);
