export type ReceiptItem = {
  id: number;
  receiptId: number;
  itemIndex: number;
  descriptionRaw: string;
  quantity: number;
  unitPrice: number | null;
  totalPrice: number;
  vatClass: string | null;
  rawLineText: string | null;
  createdAt: Date;
};
