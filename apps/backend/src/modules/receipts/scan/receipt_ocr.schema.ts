export const receiptOcrJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storeName: { type: ["string", "null"] },
    purchasedAt: { type: ["string", "null"] },
    totalAmount: { type: ["number", "null"] },
    currency: { type: ["string", "null"] },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          quantity: { type: ["number", "null"] },
          unitPrice: { type: ["number", "null"] },
          totalPrice: { type: ["number", "null"] },
        },
        required: ["label", "quantity", "unitPrice", "totalPrice"],
      },
    },
  },
  required: ["storeName", "purchasedAt", "totalAmount", "currency", "items"],
} as const;
