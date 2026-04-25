import { raw } from "hono/html";
import type { FC } from "hono/jsx";
import type { ParsedPath } from "../types";
import { AppLayout } from "./app-layout";

interface PageProps {
  parsed: Extract<ParsedPath, { kind: "page" }>;
  partial: string;
  version?: string;
  vendorName?: string;
  productName?: string;
}

export const Page: FC<PageProps> = ({
  parsed,
  partial,
  version,
  vendorName,
  productName,
}) => (
  <AppLayout
    title={`${productName ?? parsed.product} — Tailstory wiki`}
    nav={
      <>
        <span>{vendorName ?? parsed.vendor}</span> /{" "}
        <span>{productName ?? parsed.product}</span>
      </>
    }
    version={version}
  >
    {raw(partial)}
  </AppLayout>
);
