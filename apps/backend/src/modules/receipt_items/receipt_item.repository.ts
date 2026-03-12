import { PoolClient } from "pg";

export const createReceiptItemsTable = `
  CREATE TABLE IF NOT EXISTS receipt_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    quantity NUMERIC(10, 3) DEFAULT 1,
    unit_price NUMERIC(10, 2),
    total_price NUMERIC(10, 2) NOT NULL,
    department TEXT,
    category TEXT,
    subcategory TEXT,
    product TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

export async function insertReceiptItem(
  client: PoolClient,
  params: {
    receiptId: number;
    label: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number;
    department: string | null;
    category: string | null;
    subcategory: string | null;
    product: string | null;
  },
): Promise<number> {
  const result = await client.query(
    `
    INSERT INTO receipt_items (
      receipt_id,
      label,
      quantity,
      unit_price,
      total_price,
      department,
      category,
      subcategory,
      product
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id;
    `,
    [
      params.receiptId,
      params.label,
      params.quantity,
      params.unitPrice,
      params.totalPrice,
      params.department,
      params.category,
      params.subcategory,
      params.product,
    ],
  );

  return result.rows[0].id as number;
}

export async function getReceiptItemsByReceiptId(
  client: PoolClient,
  receiptId: number,
) {
  const result = await client.query(
    `
    SELECT
      id,
      receipt_id,
      label,
      quantity,
      unit_price,
      total_price,
      department,
      category,
      subcategory,
      product,
      created_at
    FROM receipt_items
    WHERE receipt_id = $1
    ORDER BY created_at ASC, id ASC
    `,
    [receiptId],
  );

  return result.rows;
}
