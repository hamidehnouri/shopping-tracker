export const productCategorizePrompt = `
Categorize grocery receipt items.

Rules:
- Return one result for each input item
- Preserve the input label exactly
- canonicalName must be a stable internal name in lowercase snake_case
- product must be a short user-friendly product name
- department, category, and subcategory must be short and consistent
- Base the categorization on the label only
- Do not invent brand, weight, or variant details unless clearly present
- If unsure, return null
`;
