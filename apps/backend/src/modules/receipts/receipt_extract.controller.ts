import type { Request, Response } from "express";
import type { CreateReceiptRequestDto } from "./receipt.dto";
import { receiptExtractJsonSchema } from "./receipt_extract.schema";
import { openai } from "../../config/openai";

function toDataUrl(file: Express.Multer.File): string {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
}

export async function extractReceiptController(
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
            {
              type: "text",
              text:
                "Extract receipt data from the image and return ONLY JSON that matches the schema. " +
                "IMPORTANT: Set rawText to the full text you can read from the receipt (even if imperfect). " +
                "Find the purchase date/time and return purchasedAt as ISO-8601 if present, else null. " +
                "If currency is missing, use EUR. " +
                "Keep item names as they appear on the receipt in descriptionRaw.",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "receipt_extraction",
          strict: true,
          schema: receiptExtractJsonSchema,
        },
      },
    });

    const jsonText = completion.choices[0]?.message?.content ?? "{}";
    const dto = JSON.parse(jsonText) as CreateReceiptRequestDto;

    dto.currency = dto.currency ?? "EUR";
    for (const item of dto.items) {
      item.quantity = item.quantity ?? undefined;
      item.unitPrice = item.unitPrice ?? null;
      item.vatClass = item.vatClass ?? null;
      item.rawLineText = item.rawLineText ?? null;
    }

    res.status(200).json(dto);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Extraction Failed" });
  }
}
