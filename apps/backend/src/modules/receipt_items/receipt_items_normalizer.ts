import type { ScannedReceiptDto } from "../receipts/receipt.dto";

export const normalizeItems = (ocrResult: ScannedReceiptDto) =>
  ocrResult.items.map((item) => {
    const match = item.label.match(/^(.*?)(\s+\d+\s*Stk\s*x\s*([\d.,]+))$/i);

    if (match) {
      const cleanLabel = match[1].trim();
      const qtyMatch = item.label.match(/(\d+)\s*Stk/i);
      const unitMatch = item.label.match(/x\s*([\d.,]+)/i);

      const quantity = item.quantity ?? (qtyMatch ? Number(qtyMatch[1]) : 1);
      const unitPrice =
        item.unitPrice ??
        (unitMatch ? Number(unitMatch[1].replace(",", ".")) : item.totalPrice);

      return {
        ...item,
        label: cleanLabel,
        quantity,
        unitPrice,
      };
    }

    if (item.quantity == null) {
      return {
        ...item,
        quantity: 1,
        unitPrice: item.totalPrice,
      };
    }

    return item;
  });
