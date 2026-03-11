import { capitalize, formatDate, formatMoney, cn } from "@/lib/utils";
import type { ReceiptListItem } from "@/types/receipt";
import { Trash } from "lucide-react";

type ReceiptListRowProps = {
  receipt: ReceiptListItem;
  onClick?: (id: number) => void;
  onRemove?: (id: number) => void;
  showBorder?: boolean;
};

export default function ReceiptListRow({
  receipt,
  onClick,
  onRemove,
  showBorder = true,
}: ReceiptListRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        showBorder && "border-b border-gray-200",
      )}
    >
      <button
        type="button"
        onClick={() => onClick?.(receipt.id)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-gray-900">
            {capitalize(receipt.storeName ?? "-")}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {formatDate(receipt.purchasedAt)}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-medium text-gray-900">
            {formatMoney(receipt.totalAmount, receipt.currency)}
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(receipt.id);
        }}
        className="p-2 text-gray-400 hover:text-red-500"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  );
}
