import {
  CreateReceiptItemRequestDto,
  GetReceiptItemResponseDto,
} from "../receipt_items/receipt_item.dto";

export type CreateReceiptRequestDto = {
  storeName?: string | null;
  purchasedAt?: string | null; // ISO string
  totalAmount?: number | null;
  currency?: string | null;
  rawText?: string | null;
  items: CreateReceiptItemRequestDto[];
};

export type GetReceiptResponseDto = {
  id: number;
  storeName: string | null;
  purchasedAt: Date | null;
  totalAmount: number | null;
  currency: string;
  rawText: string | null;
  createdAt: Date;
  items: GetReceiptItemResponseDto[];
};

export type CreateReceiptResponseDto = {
  id: number;
};
