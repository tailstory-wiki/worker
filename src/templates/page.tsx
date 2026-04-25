import type { FC } from "hono/jsx";
import { raw } from "hono/html";
import type { ParsedPath } from "../types";
import { Shell } from "./shell";

interface PageProps {
  parsed: ParsedPath;
  partial: string;
}

export const Page: FC<PageProps> = ({ parsed, partial }) => (
  <Shell title={`${parsed.product} — Tailstory wiki`}>
    <header>
      <a href="/">Tailstory wiki</a>
      <nav>
        <span>{parsed.vendor}</span> / <span>{parsed.product}</span>
      </nav>
    </header>
    <main>{raw(partial)}</main>
    <footer>
      <p>Tailstory wiki</p>
    </footer>
  </Shell>
);
