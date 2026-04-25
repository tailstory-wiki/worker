import type { FC } from "hono/jsx";
import { raw } from "hono/html";
import type { ParsedPath } from "../types";
import { Shell } from "./shell";

interface PageProps {
  parsed: ParsedPath;
  partial: string;
}

export const Page: FC<PageProps> = ({ parsed, partial }) => (
  <Shell title={`${parsed.product} — tailstory wiki`}>
    <header>
      <a href="/">tailstory wiki</a>
      <nav>
        <span>{parsed.vendor}</span> / <span>{parsed.product}</span>
      </nav>
    </header>
    <main>{raw(partial)}</main>
    <footer>
      <p>tailstory wiki</p>
    </footer>
  </Shell>
);
