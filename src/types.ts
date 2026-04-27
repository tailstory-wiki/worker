export interface Env {
  DOCS: R2Bucket;
  CF_VERSION_METADATA: {
    id: string;
    tag: string;
    timestamp: string;
  };
}

export interface Product {
  slug: string;
  name: string;
}

export interface Vendor {
  slug: string;
  name: string;
  products: Product[];
}

export interface Registry {
  intro?: string;
  vendors: Vendor[];
}

export type ParsedPath =
  | { kind: "vendor"; vendor: string }
  | { kind: "page"; vendor: string; product: string; page: string };

export interface TocLeaf {
  title: string;
  page: string;
}

export interface TocSection {
  section: string;
  pages: TocLeaf[];
}

export type TocEntry = TocLeaf | TocSection;

export interface Toc {
  entries: TocEntry[];
}

export interface ResolvedToc {
  toc: Toc;
  tocDir: string;
}
