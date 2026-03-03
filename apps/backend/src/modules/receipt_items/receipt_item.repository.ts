import { PoolClient } from "pg";

export const createReceiptItemsTable = `
  CREATE TABLE IF NOT EXISTS receipt_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    item_index INTEGER NOT NULL,
    description_raw TEXT NOT NULL,
    quantity NUMERIC(10, 3) DEFAULT 1,
    unit_price NUMERIC(10, 2),
    total_price NUMERIC(10, 2) NOT NULL,
    vat_class TEXT,
    raw_line_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

export async function insertReceiptItem(
  client: PoolClient,
  params: {
    receiptId: number;
    itemIndex: number;
    descriptionRaw: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number;
    vatClass: string | null;
    rawLineText: string | null;
  },
): Promise<number> {
  const result = await client.query(
    `
  INSERT INTO receipt_items (
    receipt_id,
    item_index,
    description_raw,
    quantity,
    unit_price,
    total_price,
    vat_class,
    raw_line_text
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING *;
`,
    [
      params.receiptId,
      params.itemIndex,
      params.descriptionRaw,
      params.quantity,
      params.unitPrice,
      params.totalPrice,
      params.vatClass,
      params.rawLineText,
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
    item_index,
    description_raw,
    quantity,
    unit_price,
    total_price,
    vat_class,
    raw_line_text,
    created_at
  FROM receipt_items
  WHERE receipt_id = $1
  ORDER BY item_index ASC
`,
    [receiptId],
  );
  return result.rows;
}
