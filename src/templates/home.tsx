import { raw } from "hono/html";
import type { FC } from "hono/jsx";
import { renderMarkdown } from "../markdown";
import type { Registry } from "../types";
import { AppLayout } from "./app-layout";

interface HomeProps {
  registry: Registry | null;
  version?: string;
}

export const Home: FC<HomeProps> = ({ registry, version }) => (
  <AppLayout title="Tailstory wiki" version={version}>
    <section class="hero">
      <h1 class="sr-only">Documentation index</h1>
      {registry?.intro && (
        <div class="hero-intro">{raw(renderMarkdown(registry.intro))}</div>
      )}
    </section>
    {registry ? (
      <section>
        <h2 class="section-title">Vendors</h2>
        <ul class="link-list">
          {[...registry.vendors]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((v) => (
              <li key={v.slug}>
                <a href={`/${v.slug}`}>{v.name}</a>
              </li>
            ))}
        </ul>
      </section>
    ) : (
      <p>Registry unavailable.</p>
    )}
  </AppLayout>
);
