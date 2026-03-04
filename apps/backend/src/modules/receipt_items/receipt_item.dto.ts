export type CreateReceiptItemRequestDto = {
  itemIndex: number;
  descriptionRaw: string;
  totalPrice: number;
  quantity?: number;
  unitPrice?: number | null;
  vatClass?: string | null;
  department?: string | null;
  category?: string | null;
  subcategory?: string | null;
  product?: string | null;
  rawLineText?: string | null;
};

export type GetReceiptItemResponseDto = {
  id: number;
  receiptId: number;
  itemIndex: number;
  descriptionRaw: string;
  quantity: number;
  unitPrice: number | null;
  totalPrice: number;
  vatClass: string | null;
  rawLineText: string | null;
  department: string | null;
  category: string | null;
  subcategory: string | null;
  product: string | null;
  createdAt: Date;
};
