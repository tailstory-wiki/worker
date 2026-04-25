export interface Env {
  DOCS: R2Bucket;
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
