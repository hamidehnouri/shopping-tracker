import type { Request, Response } from "express";
import type { CreateReceiptRequestDto } from "./receipt.dto";
import { createReceipt } from "./receipt.service";
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
                "IMPORTANT: Set rawText to the full text you can read from the receipt. " +
                "Find the purchase date/time and return purchasedAt as ISO-8601 if present, else null. " +
                "If currency is missing, use EUR. " +
                "Keep item names exactly as they appear on the receipt in descriptionRaw. " +
                "Classify each item using the following hierarchy: department → category → subcategory → product. " +
                "department: very broad store department such as grocery, household, apparel, electronics, beauty, or other. " +
                "category: broad group inside a department. Examples: fruits, vegetables, dairy, meat, bakery, drinks, snacks, pantry, cleaning, clothing. " +
                "subcategory: product family. Examples: citrus, apple, yogurt, cheese, bread_rolls, pickles, milk. " +
                "product: normalized base item name (singular, lowercase). Examples: apple, orange, yogurt, milk, egg, bread, cucumber. " +
                "Rules: " +
                "- product must be singular and normalized (apple, orange, yogurt, egg). " +
                "- Do NOT include color, flavor, brand, organic/bio labels, size, packaging, or adjectives in product. " +
                "- Variants like 'red apple', 'blood orange', 'strawberry yogurt' should still have product 'apple', 'orange', 'yogurt'. " +
                "- subcategory should group similar products (example: apple and pear → pome, orange and mandarin → citrus). " +
                "Examples: " +
                "'Apfel rot' → department: grocery, category: fruits, subcategory: pome, product: apple. " +
                "'Blutorangen' → department: grocery, category: fruits, subcategory: citrus, product: orange. " +
                "'Romatomaten' → department: grocery, category: vegetables, subcategory: nightshade, product: tomato. " +
                "'Naturjoghurt' → department: grocery, category: dairy, subcategory: yogurt, product: yogurt. " +
                "'Eier Größe M' → department: grocery, category: dairy, subcategory: eggs, product: egg. " +
                "'Brötchen Weltm.' → department: grocery, category: bakery, subcategory: bread_rolls, product: bread_roll. " +
                "If classification is unclear, set department='other', category='other', subcategory=null, product=null.",
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

    const id = await createReceipt(dto);

    res.status(201).json({ id, extracted: dto });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Extraction Failed" });
  }
}
