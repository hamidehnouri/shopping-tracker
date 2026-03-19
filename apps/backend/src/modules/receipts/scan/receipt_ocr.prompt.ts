export const receiptOcrPrompt = `
Extract receipt data from this image.

You are performing OCR only.

Rules:
- Do not guess
- Do not calculate missing values
- Do not modify item names
- Preserve the item label as seen on the receipt
- If the next row contains only quantity/unit-price details such as "2 Stk x 0,49", attach it to the previous item
- Rows containing only quantity/unit-price details are not separate items
- When such a detail row is attached, keep label as the product name only
- Put the quantity into quantity
- Put the per-unit price into unitPrice
- Put the final line price into totalPrice
- If a single price is clearly visible for an item, put it in totalPrice
- If a value is unclear, use null
- Do not include subtotal, tax, payment, card, or total lines as items
- Extract totalAmount from the final payable total if clearly visible
`;
