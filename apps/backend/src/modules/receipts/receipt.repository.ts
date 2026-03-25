import type { PoolClient } from "pg";

export const createReceiptsTable = `
  CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_name TEXT,
    purchased_at TIMESTAMP,
    total_amount NUMERIC(12, 2),
    currency CHAR(3) DEFAULT 'EUR',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export async function insertReceipt(
  client: PoolClient,
  params: {
    storeName: string | null;
    purchasedAt: Date | null;
    totalAmount: number | null;
    currency: string;
  },
): Promise<number> {
  const result = await client.query(
    `
  INSERT INTO receipts (
    store_name,
    purchased_at,
    total_amount,
    currency
  )
  VALUES ($1, $2, $3, $4)
  RETURNING id
`,
    [params.storeName, params.purchasedAt, params.totalAmount, params.currency],
  );
  return result.rows[0].id as number;
}

export async function selectReceipts(client: PoolClient) {
  const result = await client.query(`
  SELECT 
    id,
    store_name,
    purchased_at,
    total_amount,
    currency,
    created_at
  FROM receipts
  ORDER BY created_at DESC
`);
  return result.rows;
}

export async function selectReceiptById(client: PoolClient, receiptId: number) {
  const result = await client.query(
    `
  SELECT
    id,
    store_name,
    purchased_at,
    total_amount,
    currency,
    created_at
  FROM receipts
  WHERE id = $1
`,
    [receiptId],
  );
  return result.rows[0] ?? null;
}
