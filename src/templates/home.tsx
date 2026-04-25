import type { FC } from "hono/jsx";
import type { Registry } from "../types";
import { Shell } from "./shell";

interface HomeProps {
  registry: Registry | null;
}

export const Home: FC<HomeProps> = ({ registry }) => (
  <Shell title="tailstory wiki">
    <header>
      <h1>tailstory wiki</h1>
    </header>
    <main>
      {registry ? (
        registry.vendors.map((v) => (
          <section class="vendor">
            <h2>{v.name}</h2>
            <ul>
              {v.products.map((p) => (
                <li>
                  <a href={`/${v.slug}/${p.slug}`}>{p.name}</a>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <p>Registry unavailable.</p>
      )}
    </main>
  </Shell>
);
