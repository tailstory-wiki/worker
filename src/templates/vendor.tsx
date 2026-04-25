import type { FC } from "hono/jsx";
import type { Vendor } from "../types";
import { AppLayout } from "./app-layout";

interface VendorProps {
  vendor: Vendor;
}

export const VendorPage: FC<VendorProps> = ({ vendor }) => (
  <AppLayout title={`${vendor.name} — Tailstory wiki`}>
    <section class="hero">
      <h1>{vendor.name}</h1>
    </section>
    <section>
      <h2 class="section-title">Products</h2>
      <ul class="link-list">
        {[...vendor.products]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p) => (
            <li>
              <a href={`/${vendor.slug}/${p.slug}`}>{p.name}</a>
            </li>
          ))}
      </ul>
    </section>
  </AppLayout>
);
