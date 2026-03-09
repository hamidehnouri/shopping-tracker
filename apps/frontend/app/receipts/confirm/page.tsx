"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatMoney } from "@/lib/utils";

type ExtractedReceiptItem = {
  name: string;
  quantity: number;
  price: number;
};

type ExtractedReceipt = {
  storeName?: string | null;
  purchasedAt: string;
  totalAmount: number;
  currency: string;
  items: ExtractedReceiptItem[];
};

export default function ReceiptConfirmPage() {
  const [receipt, setReceipt] = useState<ExtractedReceipt | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingExtractedReceipt");
    if (!raw) {
      router.replace("/receipts");
      return;
    }

    setReceipt(JSON.parse(raw));
  }, [router]);

  if (!receipt) return null;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
      <h1 className="mb-4 text-2xl font-semibold">Confirm receipt</h1>

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
              key={`${item.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
            >
              <span>{item.name}</span>
              <span className="text-sm text-gray-500">
                {item.quantity} × {formatMoney(item.price, receipt.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/receipts")}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            console.log("save confirmed receipt");
          }}
          className="flex-1 rounded-xl bg-gray-900 px-4 py-3 font-medium text-white"
        >
          Confirm
        </button>
      </div>
    </main>
  );
}
