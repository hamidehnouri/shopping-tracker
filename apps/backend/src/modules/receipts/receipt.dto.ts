import {
  ExtractedReceiptItemDto,
  CreateReceiptItemRequestDto,
  GetReceiptItemResponseDto,
} from "../receipt_items/receipt_item.dto";

export type ExtractedReceiptDto = {
  storeName: string | null;
  purchasedAt: string | null;
  totalAmount: number | null;
  currency: string;
  items: ExtractedReceiptItemDto[];
};

export type CreateReceiptRequestDto = {
  storeName?: string | null;
  purchasedAt?: string | null;
  totalAmount?: number | null;
  currency?: string | null;
  items: CreateReceiptItemRequestDto[];
};

export type GetReceiptResponseDto = {
  id: number;
  storeName: string | null;
  purchasedAt: Date | null;
  totalAmount: number | null;
  currency: string;
  createdAt: Date;
  items: GetReceiptItemResponseDto[];
};
