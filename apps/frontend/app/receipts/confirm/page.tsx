"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReceiptItems from "@/components/receipts/ReceiptItems";
import type { ScannedReceipt } from "@/types/receipt";
import { Button } from "@/components/ui/button/Button";
import { createReceipt } from "@/lib/api";

export default function ReceiptConfirmPage() {
  const [receipt, setReceipt] = useState<ScannedReceipt | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    if (!receipt) return;

    try {
      setIsSaving(true);
      await createReceipt(receipt);
      //TDO: uncomment this when we want to clear the pending receipt after saving
      //sessionStorage.removeItem("pendingScannedReceipt");
      router.push("/receipts");
    } catch (error) {
      console.error("Failed to save receipt:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onRetry = () => {
    sessionStorage.removeItem("pendingScannedReceipt");
    router.push("/receipts");
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pendingScannedReceipt");

      if (!raw) {
        router.replace("/receipts");
        return;
      }

      const parsed: ScannedReceipt = JSON.parse(raw);
      setReceipt(parsed);
    } catch (error) {
      console.error("Failed to load pending receipt:", error);
      router.replace("/receipts");
    }
  }, [router]);

  if (!receipt) return null;

  return (
    <>
      <ReceiptItems receipt={receipt} />

      <div className="fixed bottom-0 left-0 right-0 flex justify-end gap-4 border-t border-gray-200 bg-white px-6 py-4">
        <Button variant="outline" onClick={onRetry} disabled={isSaving}>
          Retry
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </>
  );
}
