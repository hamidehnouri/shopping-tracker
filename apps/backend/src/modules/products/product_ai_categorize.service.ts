import { openai } from "../../config/openai";
import { productCategorizePrompt } from "./product_categorize.prompt";
import { productCategorizeJsonSchema } from "./product_categorize.schema";

type AiCategorizedProduct = {
  label: string;
  canonicalName: string | null;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
};

export async function categorizeProductWithAi(
  label: string,
): Promise<AiCategorizedProduct | null> {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o",
    input: [
      {
        type: "message",
        role: "user",
        content: [
          { type: "input_text", text: productCategorizePrompt },
          { type: "input_text", text: JSON.stringify({ items: [{ label }] }) },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "product_categorize",
        strict: true,
        schema: productCategorizeJsonSchema,
      },
    },
  });

  const jsonText = response.output_text ?? "{}";
  const categorized = JSON.parse(jsonText);

  return categorized.items?.[0] ?? null;
}
