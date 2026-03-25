import pool from "../../../config/db";
import { ProductCategoryRow } from "../product.dto";

export const createProductCategoriesTable = `
  CREATE TABLE IF NOT EXISTS product_categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    canonical_name TEXT NOT NULL,
    department TEXT NULL,
    category TEXT NULL,
    subcategory TEXT NULL,
    product TEXT NULL,
    times_confirmed INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`;

export const createProductCategoriesIndexes = `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_product_categories_canonical_name
    ON product_categories (canonical_name);
`;

export const findProductCategoryByCanonicalName = async (
  canonicalName: string,
): Promise<ProductCategoryRow | null> => {
  const result = await pool.query<ProductCategoryRow>(
    `SELECT * FROM product_categories WHERE canonical_name = $1 LIMIT 1`,
    [canonicalName],
  );
  return result.rows[0] ?? null;
};

export const upsertProductCategory = async (params: {
  canonicalName: string;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
}): Promise<ProductCategoryRow | null> => {
  const result = await pool.query<ProductCategoryRow>(
    `INSERT INTO product_categories (
            canonical_name,
            department,
            category,
            subcategory,
            product
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (canonical_name) DO UPDATE SET
            department = EXCLUDED.department,
            category = EXCLUDED.category,
            subcategory = EXCLUDED.subcategory,
            product = EXCLUDED.product,
            times_confirmed = product_categories.times_confirmed + 1,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *;
        `,
    [
      params.canonicalName,
      params.department,
      params.category,
      params.subcategory,
      params.product,
    ],
  );
  return result.rows[0] ?? null;
};
