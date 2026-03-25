export type ProductCategoryRow = {
  id: number;
  canonical_name: string;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
  times_confirmed: number;
  created_at: string;
  updated_at: string;
};

export type ProductAliasRow = {
  id: number;
  store_name: string | null;
  alias_label: string;
  canonical_name: string;
  times_confirmed: number;
  created_at: string;
  updated_at: string;
};
