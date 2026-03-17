export const receiptScanJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storeName: { type: ["string", "null"] },
    purchasedAt: { type: ["string", "null"] },
    totalAmount: { type: ["number", "null"] },
    currency: { type: "string" },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          quantity: { type: "number" },
          unitPrice: { type: "number" },
          totalPrice: { type: "number" },
        },
        required: ["label", "quantity", "unitPrice", "totalPrice"],
      },
    },
  },
  required: ["storeName", "purchasedAt", "totalAmount", "currency", "items"],
};

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
