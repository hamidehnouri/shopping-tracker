import { formatDate, formatMoney } from "@/lib/utils";
import type { ReceiptDisplay } from "@/types/receipt";

type ReceiptItemsProps = {
  receipt: ReceiptDisplay;
};

export default function ReceiptItems({ receipt }: ReceiptItemsProps) {
  return (
    <div className="p-4 pb-24">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Store:</span>{" "}
            {receipt.storeName ?? "-"}
          </div>
          <div>
            <span className="font-medium">Date:</span>{" "}
            {formatDate(receipt.purchasedAt)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-2">
          {receipt.items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center justify-between px-3 py-1"
            >
              <span>{item.label}</span>
              <span className="text-sm text-gray-500">
                {item.quantity} ×{" "}
                {formatMoney(item.unitPrice, receipt.currency)} ={" "}
                {formatMoney(item.totalPrice, receipt.currency)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between px-3 py-2 border-t border-gray-200">
          <span className="font-medium">Total:</span>{" "}
          {formatMoney(receipt.totalAmount, receipt.currency)}
        </div>
      </div>
    </div>
  );
}
