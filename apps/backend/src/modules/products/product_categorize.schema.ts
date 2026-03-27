export const productCategorizeJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          canonicalName: { type: ["string", "null"] },
          department: { type: ["string", "null"] },
          category: { type: ["string", "null"] },
          subcategory: { type: ["string", "null"] },
          product: { type: ["string", "null"] },
        },
        required: [
          "label",
          "canonicalName",
          "department",
          "category",
          "subcategory",
          "product",
        ],
      },
    },
  },
  required: ["items"],
} as const;
