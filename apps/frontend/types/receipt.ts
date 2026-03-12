export type ReceiptItem = {
  id: number;
  label: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type ReceiptListItem = {
  id: number;
  storeName: string | null;
  purchasedAt: string | null;
  totalAmount: number | null;
  currency: string;
  createdAt: string;
  items: ReceiptItem[];
};

export type ReceiptDisplayItem = {
  id?: number;
  label: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type ReceiptDisplay = {
  storeName: string | null;
  purchasedAt: string | null;
  totalAmount: number | null;
  currency: string;
  items: ReceiptDisplayItem[];
};

export type ExtractedReceipt = ReceiptDisplay;
