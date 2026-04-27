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
