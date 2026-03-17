import type { Request, Response } from "express";
import { openai } from "../../../config/openai";
import { receiptScanJsonSchema } from "./receipt_scan.schema";
import { receiptScanPrompt } from "./receipt_scan.prompt";
import type { ScannedReceiptDto } from "../receipt.dto";

function toDataUrl(file: Express.Multer.File): string {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
}

export async function scanReceiptController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Receipt image is required" });
      return;
    }

    if (!req.file.mimetype.startsWith("image/")) {
      res.status(400).json({ error: "Uploaded file must be an image" });
      return;
    }

    const imageUrl = toDataUrl(req.file);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: receiptScanPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "receipt_scan",
          strict: true,
          schema: receiptScanJsonSchema,
        },
      },
    });

    const jsonText = completion.choices[0]?.message?.content ?? "{}";
    const scanned = JSON.parse(jsonText) as ScannedReceiptDto;

    scanned.currency = scanned.currency ?? "EUR";

    res.status(200).json(scanned);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Scanion failed" });
  }
}
