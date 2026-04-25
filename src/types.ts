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
  vendors: Vendor[];
}

export interface ParsedPath {
  vendor: string;
  product: string;
  page: string;
}
