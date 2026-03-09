"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReceiptListItem } from "@/types/receipt";
import ReceiptList from "@/components/receipts/ReceiptList";
import ScanReceiptButton from "@/components/receipts/ScanReceiptButton";
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

  const handleImageSelected = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const bytes = Array.from(new Uint8Array(buffer));

    sessionStorage.setItem(
      "pendingReceiptImage",
      JSON.stringify({
        name: file.name,
        type: file.type,
        bytes,
      }),
    );

    router.push("/receipts/process");
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-gray-50 pb-24">
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Receipts</h1>

        <ReceiptList
          receipts={receipts}
          onRowClick={(id) => router.push(`/receipts/${id}`)}
        />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <ScanReceiptButton onImageSelected={handleImageSelected} />
      </div>
    </main>
  );
}
