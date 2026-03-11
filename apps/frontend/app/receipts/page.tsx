"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReceiptListItem } from "@/types/receipt";
import ReceiptList from "@/components/receipts/ReceiptList";
import ScanReceiptButton from "@/components/receipts/ScanReceiptButton";
import { deleteReceipt, extractReceipt, getReceipts } from "@/lib/api";

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
    try {
      router.push("/receipts/process");

      const extracted = await extractReceipt(file);

      sessionStorage.setItem(
        "pendingExtractedReceipt",
        JSON.stringify(extracted),
      );

      router.replace("/receipts/confirm");
    } catch (error) {
      console.error(error);
      router.replace("/receipts");
      alert("Could not extract receipt.");
    }
  };

  const handleDeleteReceipt = async (id: number) => {
    if (!confirm("Delete this receipt?")) return;

    await deleteReceipt(id);

    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="pb-24">
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">Receipts</h1>
        <ReceiptList
          receipts={receipts}
          onRowClick={(id) => router.push(`/receipts/${id}`)}
          onRemove={(id) => handleDeleteReceipt(id)}
        />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <ScanReceiptButton onImageSelected={handleImageSelected} />
      </div>
    </div>
  );
}
