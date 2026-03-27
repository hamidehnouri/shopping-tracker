import { normalizeLabel } from "./label_normalizer";
import { findProductAlias } from "./repositories/product_alias.repository";
import { findProductCategoryByCanonicalName } from "./repositories/product_category.repository";
import { categorizeProductWithAi } from "./product_ai_categorize.service";

type ProductInput = {
  label: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
};

type CategorizedProduct = ProductInput & {
  canonicalName: string | null;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
  source: "dictionary" | "ai" | "unknown";
};

export async function categorizeProducts(input: {
  storeName: string | null;
  items: ProductInput[];
}): Promise<CategorizedProduct[]> {
  const result: CategorizedProduct[] = [];

  for (const item of input.items) {
    const normalizedLabel = normalizeLabel(item.label);

    const alias = await findProductAlias({
      storeName: input.storeName,
      aliasLabel: normalizedLabel,
    });

    if (alias) {
      const productCategory = await findProductCategoryByCanonicalName(
        alias.canonical_name,
      );

      if (productCategory) {
        result.push({
          ...item,
          canonicalName: alias.canonical_name,
          department: productCategory.department,
          category: productCategory.category,
          subcategory: productCategory.subcategory,
          product: productCategory.product,
          source: "dictionary",
        });
        continue;
      }
    }

    const aiSuggestion = await categorizeProductWithAi(item.label);

    result.push({
      ...item,
      canonicalName: aiSuggestion?.canonicalName ?? null,
      department: aiSuggestion?.department ?? null,
      category: aiSuggestion?.category ?? null,
      subcategory: aiSuggestion?.subcategory ?? null,
      product: aiSuggestion?.product ?? null,
      source: aiSuggestion ? "ai" : "unknown",
    });
  }

  return result;
}
