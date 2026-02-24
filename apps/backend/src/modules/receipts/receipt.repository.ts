import type { PoolClient } from "pg";

export const createReceiptsTable = `
  CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_name TEXT,
    purchased_at TIMESTAMP,
    total_amount NUMERIC(12, 2),
    currency CHAR(3) DEFAULT 'EUR',
    raw_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

export const insertReceiptQuery = `
  INSERT INTO receipts (
    store_name,
    purchased_at,
    total_amount,
    currency,
    raw_text
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id
`;

export async function insertReceipt(
  client: PoolClient,
  params: {
    storeName: string | null;
    purchasedAt: Date | null;
    totalAmount: number | null;
    currency: string;
    rawText: string | null;
  },
): Promise<number> {
  const result = await client.query(insertReceiptQuery, [
    params.storeName,
    params.purchasedAt,
    params.totalAmount,
    params.currency,
    params.rawText,
  ]);
  return result.rows[0].id as number;
}
