import type { FC } from "hono/jsx";
import { raw } from "hono/html";
import type { Registry } from "../types";
import { Shell } from "./shell";
import { renderMarkdown } from "../markdown";

interface HomeProps {
  registry: Registry | null;
}

export const Home: FC<HomeProps> = ({ registry }) => (
  <Shell title="tailstory wiki">
    <header class="site-header">
      <a href="/" class="site-title">tailstory wiki</a>
    </header>
    <main class="home">
      <section class="hero">
        <h1>tailstory wiki</h1>
        {registry?.intro && (
          <div class="hero-intro">{raw(renderMarkdown(registry.intro))}</div>
        )}
      </section>
      {registry ? (
        <div class="vendor-list">
          {registry.vendors.map((v) => (
            <section class="vendor">
              <h2 class="vendor-name">{v.name}</h2>
              <div class="product-grid">
                {v.products.map((p) => (
                  <a class="product-card" href={`/${v.slug}/${p.slug}`}>
                    <span class="product-name">{p.name}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p>Registry unavailable.</p>
      )}
    </main>
    <footer class="site-footer">
      <p>tailstory wiki</p>
    </footer>
  </Shell>
);
