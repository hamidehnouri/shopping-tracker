import type { Request, Response } from "express";
import { openai } from "../../../config/openai";
import { receiptExtractJsonSchema } from "./receipt_extract.schema";
import { receiptExtractPrompt } from "./receipt_extract.prompt";
import type { ExtractedReceiptDto } from "../receipt.dto";

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
            { type: "text", text: receiptExtractPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
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
    const extracted = JSON.parse(jsonText) as ExtractedReceiptDto;

    extracted.currency = extracted.currency ?? "EUR";

    res.status(200).json(extracted);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Extraction failed" });
  }
}
