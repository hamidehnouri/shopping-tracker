export type ScannedReceiptItemDto = {
  label: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CreateReceiptItemRequestDto = {
  label: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type GetReceiptItemResponseDto = {
  id: number;
  receiptId: number;
  label: string;
  quantity: number;
  unitPrice: number | null;
  totalPrice: number;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
  createdAt: Date;
};
