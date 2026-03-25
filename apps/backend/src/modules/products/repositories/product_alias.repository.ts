import pool from "../../../config/db";
import { ProductAliasRow } from "../product.dto";

export const createProductAliasesTable = `
  CREATE TABLE IF NOT EXISTS product_aliases (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_name TEXT NULL DEFAULT '',
    alias_label TEXT NOT NULL,
    canonical_name TEXT NOT NULL,
    times_confirmed INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createProductAliasesIndexes = `
  CREATE INDEX IF NOT EXISTS idx_product_aliases_store_label
  ON product_aliases (store_name, alias_label_normalized);

  CREATE INDEX IF NOT EXISTS idx_product_aliases_label
  ON product_aliases (alias_label_normalized);
`;

export const findProductAlias = async (params: {
  storeName: string | null;
  aliasLabel: string;
}): Promise<ProductAliasRow | null> => {
  if (params.storeName) {
    const result = await pool.query<ProductAliasRow>(
      `SELECT * FROM product_aliases WHERE store_name = $1 AND alias_label = $2 ORDER BY times_confirmed DESC LIMIT 1`,
      [params.storeName, params.aliasLabel],
    );
    if (result.rows[0]) {
      return result.rows[0];
    }
  }
  const globalResult = await pool.query<ProductAliasRow>(
    `SELECT * FROM product_aliases WHERE store_name IS NULL AND alias_label = $1 ORDER BY times_confirmed DESC LIMIT 1`,
    [params.aliasLabel],
  );
  return globalResult.rows[0] ?? null;
};

export const upsertProductAlias = async (params: {
  storeName: string | null;
  aliasLabel: string;
  canonicalName: string;
}): Promise<ProductAliasRow | null> => {
  const result = await pool.query<ProductAliasRow>(
    `INSERT INTO product_aliases (
            store_name,
            alias_label,
            canonical_name
        ) VALUES ($1, $2, $3)
        ON CONFLICT (store_name, alias_label) DO UPDATE SET
            alias_label = EXCLUDED.alias_label,
            canonical_name = EXCLUDED.canonical_name,
            times_confirmed = product_aliases.times_confirmed + 1,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *;
        `,
    [params.storeName, params.aliasLabel, params.canonicalName],
  );
  return result.rows[0] ?? null;
};
