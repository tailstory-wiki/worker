import { raw } from "hono/html";
import type { FC } from "hono/jsx";
import type { ParsedPath, ResolvedToc } from "../types";
import { AppLayout } from "./app-layout";
import { TocRail } from "./toc-rail";

interface PageProps {
  parsed: Extract<ParsedPath, { kind: "page" }>;
  partial: string;
  toc?: ResolvedToc | null;
  version?: string;
  vendorName?: string;
  productName?: string;
}

function relativeSlug(page: string, tocDir: string): string {
  if (page === "index") return "index";
  if (tocDir === "") return page;
  if (page === tocDir) return "index";
  return page.slice(tocDir.length + 1);
}

export const Page: FC<PageProps> = ({
  parsed,
  partial,
  toc,
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
    <div class="page">
      {toc && (
        <TocRail
          toc={toc.toc}
          tocDir={toc.tocDir}
          vendor={parsed.vendor}
          product={parsed.product}
          currentPageSlug={relativeSlug(parsed.page, toc.tocDir)}
        />
      )}
      <article>{raw(partial)}</article>
    </div>
  </AppLayout>
);
