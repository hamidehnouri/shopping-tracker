import type { Request, Response } from "express";

export async function extractReceiptController(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: "Receipt image is required" });
    return;
  }

  res.status(200).json({
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
}
