import type { Request, Response } from "express";
import type { CreateReceiptRequestDto } from "./receipt.dto";
import { createReceipt } from "./receipt.service";

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
    res.status(400).json({ error: message || "Bad request" });
  }
}
