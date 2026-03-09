import type { ReceiptListItem } from "@/types/receipt";

export type ReceiptTableProps = {
  receipts: ReceiptListItem[];
  onRowClick?: (id: number) => void;
};
