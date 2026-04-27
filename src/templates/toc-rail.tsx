import type { FC } from "hono/jsx";
import { tocEntryUrl } from "../toc";
import type { Toc, TocEntry, TocLeaf, TocSection } from "../types";

interface TocRailProps {
  toc: Toc;
  tocDir: string;
  vendor: string;
  product: string;
  currentPageSlug: string;
}

function isSection(entry: TocEntry): entry is TocSection {
  return "section" in entry;
}

interface LeafProps {
  leaf: TocLeaf;
  tocDir: string;
  vendor: string;
  product: string;
  currentPageSlug: string;
}

const Leaf: FC<LeafProps> = ({
  leaf,
  tocDir,
  vendor,
  product,
  currentPageSlug,
}) => {
  const href = tocEntryUrl(vendor, product, tocDir, leaf.page);
  const isCurrent = leaf.page === currentPageSlug;
  return (
    <li>
      <a href={href} aria-current={isCurrent ? "page" : undefined}>
        {leaf.title}
      </a>
    </li>
  );
};

export const TocRail: FC<TocRailProps> = ({
  toc,
  tocDir,
  vendor,
  product,
  currentPageSlug,
}) => (
  <nav class="toc-rail" aria-label="In this product">
    <ul>
      {toc.entries.map((entry) =>
        isSection(entry) ? (
          <li>
            <span>{entry.section}</span>
            <ul>
              {entry.pages.map((leaf) => (
                <Leaf
                  leaf={leaf}
                  tocDir={tocDir}
                  vendor={vendor}
                  product={product}
                  currentPageSlug={currentPageSlug}
                />
              ))}
            </ul>
          </li>
        ) : (
          <Leaf
            leaf={entry}
            tocDir={tocDir}
            vendor={vendor}
            product={product}
            currentPageSlug={currentPageSlug}
          />
        ),
      )}
    </ul>
  </nav>
);
