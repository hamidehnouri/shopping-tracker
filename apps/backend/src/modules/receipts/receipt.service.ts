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
  getReceiptItemsByReceiptId,
  insertReceiptItem,
} from "../receipt_items/receipt_item.repository";

export async function createReceipt(
  dto: CreateReceiptRequestDto,
): Promise<number> {
  const client = await pool.connect();

  let receiptId!: number;
  const labels: string[] = [];

  try {
    await client.query("BEGIN");

    receiptId = await insertReceipt(client, {
      storeName: dto.storeName ?? null,
      purchasedAt: dto.purchasedAt ? new Date(dto.purchasedAt) : null,
      totalAmount: dto.totalAmount ?? null,
      currency: dto.currency ?? "EUR",
    });

    for (const item of dto.items) {
      labels.push(item.label);

      await insertReceiptItem(client, {
        receiptId,
        label: item.label,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? null,
        totalPrice: item.totalPrice,
        department: null,
        category: null,
        subcategory: null,
        product: null,
      });
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  return receiptId;
}

export async function getReceipts(): Promise<GetReceiptResponseDto[]> {
  const client = await pool.connect();

  try {
    const rows = await selectReceipts(client);

    return rows.map((row) => ({
      id: row.id,
      storeName: row.store_name,
      purchasedAt: row.purchased_at,
      totalAmount: row.total_amount === null ? null : Number(row.total_amount),
      currency: row.currency,
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
    const receiptRow = await selectReceiptById(client, receiptId);
    if (!receiptRow) return null;

    const itemRows = await getReceiptItemsByReceiptId(client, receiptId);

    return {
      id: receiptRow.id,
      storeName: receiptRow.store_name,
      purchasedAt: receiptRow.purchased_at,
      totalAmount:
        receiptRow.total_amount === null
          ? null
          : Number(receiptRow.total_amount),
      currency: receiptRow.currency,
      createdAt: receiptRow.created_at,
      items: itemRows.map((itemRow) => ({
        id: itemRow.id,
        receiptId: itemRow.receipt_id,
        label: itemRow.label,
        quantity: itemRow.quantity === null ? 1 : Number(itemRow.quantity),
        unitPrice:
          itemRow.unit_price === null ? null : Number(itemRow.unit_price),
        totalPrice: Number(itemRow.total_price),
        department: itemRow.department,
        category: itemRow.category,
        subcategory: itemRow.subcategory,
        product: itemRow.product,
        createdAt: itemRow.created_at,
      })),
    };
  } finally {
    client.release();
  }
}

export async function deleteReceiptById(id: number) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM receipts WHERE id = $1", [id]);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
