import { raw } from "hono/html";
import type { FC } from "hono/jsx";
import type { ParsedPath } from "../types";
import { AppLayout } from "./app-layout";

interface PageProps {
  parsed: Extract<ParsedPath, { kind: "page" }>;
  partial: string;
}

export const Page: FC<PageProps> = ({ parsed, partial }) => (
  <AppLayout
    title={`${parsed.product} — Tailstory wiki`}
    nav={
      <>
        <span>{parsed.vendor}</span> / <span>{parsed.product}</span>
      </>
    }
  >
    {raw(partial)}
  </AppLayout>
);
