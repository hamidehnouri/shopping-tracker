export type ReceiptListItem = {
  id: number;
  storeName: string | null;
  purchasedAt: string | null;
  totalAmount: number | null;
  currency: string;
  createdAt: string;
};

export type ReceiptItem = {
  id: number;
  descriptionRaw: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};
