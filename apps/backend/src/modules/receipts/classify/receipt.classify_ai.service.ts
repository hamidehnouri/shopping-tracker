import { openai } from "../../../config/openai";
import { receiptClassifyJsonSchema } from "./receipt_classify.schema";
import { receiptClassifyPrompt } from "./receipt_classify.prompt";

export type ReceiptItemClassification = {
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
};

export async function classifyReceiptLabels(
  labels: string[],
): Promise<ReceiptItemClassification[]> {
  if (labels.length === 0) return [];

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
    items: ReceiptItemClassification[];
  };

  if (!classified.items || classified.items.length !== labels.length) {
    throw new Error("Classification item count mismatch");
  }

  return classified.items;
}
