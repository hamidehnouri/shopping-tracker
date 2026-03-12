import type { Request, Response } from "express";
import { openai } from "../../../config/openai";
import { receiptClassifyJsonSchema } from "./receipt_classify.schema";
import { receiptClassifyPrompt } from "./receipt_classify.prompt";
import { getReceiptById } from "../receipt.service";
import { categorizeReceiptItems } from "./receipt.classify.service";

export async function categorizeReceiptController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const receiptId = Number(req.params.id);

    if (!receiptId) {
      res.status(400).json({ error: "Invalid receipt id" });
      return;
    }

    const receipt = await getReceiptById(receiptId);

    if (!receipt) {
      res.status(404).json({ error: "Receipt not found" });
      return;
    }

    const labels = receipt.items.map((item) => item.label);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: receiptClassifyPrompt(labels),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "receipt_classification",
          strict: true,
          schema: receiptClassifyJsonSchema,
        },
      },
    });

    const jsonText = completion.choices[0]?.message?.content ?? "{}";
    const classified = JSON.parse(jsonText) as {
      items: {
        department: string | null;
        category: string | null;
        subcategory: string | null;
        product: string | null;
      }[];
    };

    if (classified.items.length !== receipt.items.length) {
      res.status(500).json({ error: "Classification item count mismatch" });
      return;
    }

    await categorizeReceiptItems(receiptId, classified.items);

    res.status(200).json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message || "Categorization failed" });
  }
}
