import type { Request, Response } from "express";
import { categorizeProductWithAi } from "./product_ai_categorize.service";

export async function categorizeProductWithAiController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Items are required" });
      return;
    }

    const results = await Promise.all(
      items.map((item: { label: string }) =>
        categorizeProductWithAi(item.label),
      ),
    );

    res.status(200).json({ items: results });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Product categorization failed";
    res.status(500).json({ error: message });
  }
}
