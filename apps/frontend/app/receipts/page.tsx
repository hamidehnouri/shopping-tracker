"use client";

import { useEffect, useState } from "react";
import type { ReceiptListItem } from "@/types/receipt";
import ReceiptTable from "@/components/receipt/ReceiptTable";
import { getReceipts } from "@/lib/api";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptListItem[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getReceipts();
      setReceipts(data);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-4 pb-24">
      <h1 className="text-2xl font-semibold mb-4">Receipts</h1>
      <ReceiptTable
        receipts={receipts}
        onRowClick={(id) => console.log("open", id)}
      />
    </main>
  );
}
