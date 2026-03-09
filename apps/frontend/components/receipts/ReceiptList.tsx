import type { ReceiptListItem } from "@/types/receipt";
import ReceiptListRow from "./ReceiptListRow";

type ReceiptListProps = {
  receipts: ReceiptListItem[];
  onRowClick?: (id: number) => void;
  onRemove?: (id: number) => void;
};

export default function ReceiptList({
  receipts,
  onRowClick,
  onRemove,
}: ReceiptListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {receipts.map((receipt, index) => (
        <ReceiptListRow
          key={receipt.id}
          receipt={receipt}
          onClick={onRowClick}
          onRemove={onRemove}
          showBorder={index < receipts.length - 1}
        />
      ))}
    </div>
  );
}
