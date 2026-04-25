import type { FC } from "hono/jsx";
import type { Vendor } from "../types";
import { AppLayout } from "./app-layout";

interface VendorProps {
  vendor: Vendor;
  version?: string;
}

export const VendorPage: FC<VendorProps> = ({ vendor, version }) => (
  <AppLayout title={`${vendor.name} — Tailstory wiki`} version={version}>
    <section class="hero">
      <h1>{vendor.name}</h1>
    </section>
    <section>
      <h2 class="section-title">Products</h2>
      <ul class="link-list">
        {[...vendor.products]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p) => (
            <li key={p.slug}>
              <a href={`/${vendor.slug}/${p.slug}`}>{p.name}</a>
            </li>
          ))}
      </ul>
    </section>
  </AppLayout>
);
