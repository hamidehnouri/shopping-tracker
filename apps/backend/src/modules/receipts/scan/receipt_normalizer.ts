import type { ScannedReceiptDto } from "../receipt.dto";

export const normalizeReceipt = (ocrResult: ScannedReceiptDto) => {
  const currency = ocrResult.currency ?? "EUR";

  const purchasedAt =
    ocrResult.purchasedAt &&
    !Number.isNaN(new Date(ocrResult.purchasedAt).getTime())
      ? new Date(ocrResult.purchasedAt).toISOString()
      : null;

  return {
    ...ocrResult,
    purchasedAt,
    currency,
  };
};
