import { normalizeLabel } from "./label_normalizer";
import { findProductAlias } from "./repositories/product_alias.repository";
import { findProductCategoryByCanonicalName } from "./repositories/product_category.repository";

type ReceiptItemInput = {
  label: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
};

type CategorizedReceiptItem = ReceiptItemInput & {
  canonicalName: string | null;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
  source: "dictionary" | "unknown";
};

export async function categorizeReceiptItems(input: {
  storeName: string | null;
  items: ReceiptItemInput[];
}): Promise<CategorizedReceiptItem[]> {
  const result: CategorizedReceiptItem[] = [];

  for (const item of input.items) {
    const normalizedLabel = normalizeLabel(item.label);

    const alias = await findProductAlias({
      storeName: input.storeName,
      aliasLabel: normalizedLabel,
    });

    if (!alias) {
      result.push({
        ...item,
        canonicalName: null,
        department: null,
        category: null,
        subcategory: null,
        product: null,
        source: "unknown",
      });
      continue;
    }

    const productCategory = await findProductCategoryByCanonicalName(
      alias.canonical_name,
    );

    result.push({
      ...item,
      canonicalName: alias.canonical_name,
      department: productCategory?.department ?? null,
      category: productCategory?.category ?? null,
      subcategory: productCategory?.subcategory ?? null,
      product: productCategory?.product ?? null,
      source: "dictionary",
    });
  }

  return result;
}
