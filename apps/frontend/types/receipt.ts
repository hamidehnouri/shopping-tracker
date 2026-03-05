export type ReceiptListItem = {
  id: number;
  storeName: string | null;
  purchasedAt: string | null;
  totalAmount: number | null;
  currency: string;
  createdAt: string;
};
