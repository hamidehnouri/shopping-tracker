export const receiptClassifyJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          department: { type: ["string", "null"] },
          category: { type: ["string", "null"] },
          subcategory: { type: ["string", "null"] },
          product: { type: ["string", "null"] },
        },
        required: ["department", "category", "subcategory", "product"],
      },
    },
  },
  required: ["items"],
};
