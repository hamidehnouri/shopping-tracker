export const receiptScanPrompt =
  "Scan receipt data from the image and return ONLY JSON matching the schema. " +
  "Accuracy of dates, quantities, unit prices, line totals, and final total is the highest priority. " +
  "Return storeName, purchasedAt, totalAmount, currency, and items. " +
  "Return purchasedAt as ISO-8601 if clearly visible, else null. " +
  "If currency is missing, use EUR. " +
  "For each line item, return label exactly as read, quantity, unitPrice, and totalPrice. " +
  "Preserve receipt order. " +
  "If a line shows 'price x quantity total', use those values exactly. " +
  "For single items, quantity must be 1 and unitPrice must equal totalPrice. " +
  "Include discount lines as items with negative price values. " +
  "Do not classify items in this step. " +
  "Do not invent values.";
