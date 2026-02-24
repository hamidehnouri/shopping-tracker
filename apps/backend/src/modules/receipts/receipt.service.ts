import pool from "../../config/db";
import type { CreateReceiptRequestDto } from "./receipt.dto";
import { insertReceipt } from "./receipt.repository";
import { insertReceiptItem } from "../receipt_items/receipt_item.repository";

export async function createReceipt(
  dto: CreateReceiptRequestDto,
): Promise<number> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const receiptId = await insertReceipt(client, {
      storeName: dto.storeName ?? null,
      purchasedAt: dto.purchasedAt ? new Date(dto.purchasedAt) : null,
      totalAmount: dto.totalAmount ?? null,
      currency: dto.currency ?? "EUR",
      rawText: dto.rawText ?? null,
    });

    for (const item of dto.items) {
      await insertReceiptItem(client, {
        receiptId,
        itemIndex: item.itemIndex,
        descriptionRaw: item.descriptionRaw,
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice ?? null,
        totalPrice: item.totalPrice,
        vatClass: item.vatClass ?? null,
        rawLineText: item.rawLineText ?? null,
      });
    }

    await client.query("COMMIT");
    return receiptId;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
