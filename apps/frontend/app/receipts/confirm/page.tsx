"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReceiptItems from "@/components/receipts/ReceiptItems";
import type { ExtractedReceipt } from "@/types/receipt";

type PendingReceipt = {
  id: number;
  extracted: ExtractedReceipt;
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

    const parsed: PendingReceipt = JSON.parse(raw);
    setReceipt(parsed.extracted);
  }, [router]);

  if (!receipt) return null;

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Confirm receipt</h1>
      <ReceiptItems receipt={receipt} />
    </>
  );
}
