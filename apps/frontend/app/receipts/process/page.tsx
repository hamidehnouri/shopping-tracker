"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { extractReceipt } from "@/lib/api";

export default function ReceiptProcessPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const raw = sessionStorage.getItem("pendingReceiptImage");

        if (!raw) {
          router.replace("/receipts");
          return;
        }

        const parsed = JSON.parse(raw) as {
          name: string;
          type: string;
          bytes: number[];
        };

        const file = new File([new Uint8Array(parsed.bytes)], parsed.name, {
          type: parsed.type,
        });

        const extracted = await extractReceipt(file);

        sessionStorage.removeItem("pendingReceiptImage");
        sessionStorage.setItem(
          "pendingExtractedReceipt",
          JSON.stringify(extracted),
        );

        router.replace("/receipts/confirm");
      } catch (error) {
        console.error(error);
        router.replace("/receipts");
      }
    };

    void run();
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-gray-700" />
      <h1 className="text-xl font-semibold text-gray-900">
        Scanning receipt...
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        We’re extracting the receipt details.
      </p>
    </main>
  );
}
