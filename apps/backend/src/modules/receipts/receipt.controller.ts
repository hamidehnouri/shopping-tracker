import type { Request, Response } from "express";
import type { CreateReceiptRequestDto } from "./receipt.dto";
import {
  createReceipt,
  getReceipts,
  getReceiptById,
  deleteReceiptById,
} from "./receipt.service";

export async function createReceiptController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const dto = req.body as CreateReceiptRequestDto;
    const id = await createReceipt(dto);
    res.status(201).json({ id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Create receipt failed" });
  }
}

export async function getReceiptsController(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const receipts = await getReceipts();
    res.status(200).json(receipts);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Failed to fetch receipts" });
  }
}

export async function getReceiptByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const receiptId = Number(req.params.id);

    if (!Number.isFinite(receiptId) || receiptId <= 0) {
      res.status(400).json({ error: "Invalid receipt id" });
      return;
    }

    const receipt = await getReceiptById(receiptId);
    if (!receipt) {
      res.status(404).json({ error: "Receipt not found" });
      return;
    }
    res.status(200).json(receipt);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Failed to fetch receipt" });
  }
}

export async function deleteReceiptController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const receiptId = Number(req.params.id);

    if (!Number.isFinite(receiptId) || receiptId <= 0) {
      res.status(400).json({ error: "Invalid receipt id" });
      return;
    }

    await deleteReceiptById(receiptId);
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Failed to delete receipt" });
  }
}
