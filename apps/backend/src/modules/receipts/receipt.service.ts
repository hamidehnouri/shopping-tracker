import pool from "../../config/db";
import type {
  CreateReceiptRequestDto,
  GetReceiptResponseDto,
} from "./receipt.dto";
import {
  insertReceipt,
  selectReceipts,
  selectReceiptById,
} from "./receipt.repository";
import {
  insertReceiptItem,
  getReceiptItemsByReceiptId,
} from "../receipt_items/receipt_item.repository";

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

export async function getReceipts(): Promise<GetReceiptResponseDto[]> {
  const client = await pool.connect();
  try {
    const rows = await selectReceipts(client);

    return rows.map((row) => ({
      id: row.id,
      storeName: row.store_name,
      purchasedAt: row.purchased_at,
      totalAmount: row.total_amount,
      currency: row.currency,
      rawText: row.raw_text,
      createdAt: row.created_at,
      items: [],
    }));
  } finally {
    client.release();
  }
}

export async function getReceiptById(
  receiptId: number,
): Promise<GetReceiptResponseDto | null> {
  const client = await pool.connect();
  try {
    const ReceiptRow = await selectReceiptById(client, receiptId);
    if (!ReceiptRow) return null;

    const itemRows = await getReceiptItemsByReceiptId(client, receiptId);

    return {
      id: ReceiptRow.id,
      storeName: ReceiptRow.store_name,
      purchasedAt: ReceiptRow.purchased_at,
      totalAmount:
        ReceiptRow.total_amount === null
          ? null
          : Number(ReceiptRow.total_amount),
      currency: ReceiptRow.currency,
      rawText: ReceiptRow.raw_text,
      createdAt: ReceiptRow.created_at,
      items: itemRows.map((itemRow) => ({
        id: itemRow.id,
        receiptId: itemRow.receipt_id,
        itemIndex: itemRow.item_index,
        descriptionRaw: itemRow.description_raw,
        quantity: itemRow.quantity === null ? 1 : Number(itemRow.quantity),
        unitPrice:
          itemRow.unit_price === null ? null : Number(itemRow.unit_price),
        totalPrice: Number(itemRow.total_price),
        vatClass: itemRow.vat_class,
        rawLineText: itemRow.raw_line_text,
        createdAt: itemRow.created_at,
      })),
    };
  } finally {
    client.release();
  }
}
