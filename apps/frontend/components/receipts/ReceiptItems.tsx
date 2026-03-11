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
          <div>
            <span className="font-medium">Total:</span>{" "}
            {formatMoney(receipt.totalAmount, receipt.currency)}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Items</h2>

        <div className="space-y-2">
          {receipt.items.map((item, index) => (
            <div
              key={item.id ?? `${item.descriptionRaw}-${index}`}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
            >
              <span>{item.descriptionRaw}</span>
              <span className="text-sm text-gray-500">
                {item.quantity} ×{" "}
                {formatMoney(item.unitPrice, receipt.currency)} ={" "}
                {formatMoney(item.totalPrice, receipt.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
