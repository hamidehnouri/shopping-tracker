"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanText } from "lucide-react";
import type { ReceiptListItem } from "@/types/receipt";
import ReceiptList from "@/components/receipts/ReceiptList";
import { getReceipts } from "@/lib/api";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptListItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await getReceipts();
      setReceipts(data);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-md min-h-screen bg-gray-50 pb-24">
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Receipts</h1>

        <ReceiptList
          receipts={receipts}
          onRowClick={(id) => router.push(`/receipts/${id}`)}
        />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg hover:scale-105 transition">
          <ScanText className="h-7 w-7 text-gray-700" />
        </button>
      </div>
    </main>
  );
}
