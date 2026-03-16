import { formatDate, formatMoney } from "@/lib/utils";
import type { ReceiptDisplay } from "@/types/receipt";
import { H2, Muted } from "@/components/ui/Typography";

type ReceiptItemsProps = {
  receipt: ReceiptDisplay;
};

export default function ReceiptItems({ receipt }: ReceiptItemsProps) {
  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <H2>{receipt.storeName ?? "Unknown store"}</H2>
        <Muted className="mt-1">{formatDate(receipt.purchasedAt)}</Muted>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <Muted>Items</Muted>
        </div>

        <div className="divide-y divide-gray-100">
          {receipt.items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-start justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-gray-900">
                  {item.label}
                </div>
                <div className="mt-1 text-sm text-gray-500 tabular-nums">
                  {item.quantity} ×{" "}
                  {formatMoney(item.unitPrice, receipt.currency)}
                </div>
              </div>

              <div className="shrink-0 text-right font-medium text-gray-900 tabular-nums">
                {formatMoney(item.totalPrice, receipt.currency)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-semibold text-gray-900 tabular-nums">
            {formatMoney(receipt.totalAmount, receipt.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
