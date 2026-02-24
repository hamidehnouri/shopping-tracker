export type Receipt = {
  id: number;
  storeName: string | null;
  purchasedAt: Date | null;
  totalAmount: number | null;
  currency: string;
  rawText: string | null;
  createdAt: Date;
};
