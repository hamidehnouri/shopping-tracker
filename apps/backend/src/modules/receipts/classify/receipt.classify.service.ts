import pool from "../../../config/db";
import { getReceiptItemsByReceiptId } from "../../receipt_items/receipt_item.repository";

type ReceiptItemClassification = {
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
};

export async function categorizeReceiptItems(
  receiptId: number,
  items: ReceiptItemClassification[],
): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingItems = await getReceiptItemsByReceiptId(client, receiptId);

    if (existingItems.length !== items.length) {
      throw new Error("Classification item count mismatch");
    }

    for (let i = 0; i < existingItems.length; i++) {
      const existingItem = existingItems[i];
      const classifiedItem = items[i];

      await client.query(
        `
        UPDATE receipt_items
        SET
          department = $1,
          category = $2,
          subcategory = $3,
          product = $4
        WHERE id = $5
        `,
        [
          classifiedItem.department,
          classifiedItem.category,
          classifiedItem.subcategory,
          classifiedItem.product,
          existingItem.id,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
