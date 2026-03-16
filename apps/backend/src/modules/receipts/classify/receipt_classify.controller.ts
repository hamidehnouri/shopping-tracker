import type { Request, Response } from "express";
import { getReceiptById } from "../receipt.service";
import { categorizeReceiptItems } from "./receipt.classify.service";
import { classifyReceiptLabels } from "./receipt.classify_ai.service";

export async function categorizeReceiptController(
  req: Request<{ id: string }>,
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

    const labels = receipt.items.map((item) => item.label);
    const classified = await classifyReceiptLabels(labels);

    await categorizeReceiptItems(receiptId, classified);

    res.status(200).json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Categorization failed" });
  }
}
