import type { Request, Response } from "express";
import { openai } from "../../../config/openai";
import { receiptOcrJsonSchema } from "./receipt_ocr.schema";
import { receiptOcrPrompt } from "./receipt_ocr.prompt";
import type { ScannedReceiptDto } from "../receipt.dto";
import { normalizeItems } from "./normalizer";

function toDataUrl(file: Express.Multer.File): string {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
}

export async function scanReceiptController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "Receipt image is required" });
      return;
    }

    if (!file.mimetype.startsWith("image/")) {
      res.status(400).json({ error: "Uploaded file must be an image" });
      return;
    }

    const imageUrl = toDataUrl(file);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: receiptOcrPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "receipt_ocr",
          strict: true,
          schema: receiptOcrJsonSchema,
        },
      },
    });

    const jsonText = completion.choices[0]?.message?.content ?? "{}";
    const ocrResult = JSON.parse(jsonText) as ScannedReceiptDto;
    const items = normalizeItems(ocrResult);

    res.status(200).json({
      ...ocrResult,
      currency: ocrResult.currency ?? "EUR",
      items,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Receipt scan failed";
    res.status(500).json({ error: message });
  }
}
