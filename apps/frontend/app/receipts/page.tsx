"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReceiptList from "@/components/receipts/ReceiptList";
import ScanReceiptButton from "@/components/receipts/ScanReceiptButton";
import { H1 } from "@/components/ui/Typography";
import type { ReceiptListItem } from "@/types/receipt";
import { deleteReceipt, extractReceipt, getReceipts } from "@/lib/api";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptListItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const data = await getReceipts();
        setReceipts(data);
      } catch (error) {
        console.error("Failed to load receipts:", error);
      }
    };

    loadReceipts();
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
      console.error("Failed to extract receipt:", error);
      router.replace("/receipts");
      alert("Could not extract receipt.");
    }
  };

  const handleDeleteReceipt = async (id: number) => {
    if (!confirm("Delete this receipt?")) return;

    try {
      await deleteReceipt(id);
      setReceipts((prev) => prev.filter((receipt) => receipt.id !== id));
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      alert("Could not delete receipt.");
    }
  };

  return (
    <div className="pb-24">
      <div className="p-4">
        <H1 className="mb-4">Receipts</H1>

        <ReceiptList
          receipts={receipts}
          onRowClick={(id) => router.push(`/receipts/${id}`)}
          onRemove={handleDeleteReceipt}
        />
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <ScanReceiptButton onImageSelected={handleImageSelected} />
      </div>
    </div>
  );
}
