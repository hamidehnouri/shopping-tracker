import ReceiptItems from "@/components/receipts/ReceiptItems";
import { getReceipt } from "@/lib/api";
import Link from "next/dist/client/link";
import { notFound } from "next/navigation";

export default async function ReceiptDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const receipt = await getReceipt(id);

  if (!receipt) {
    notFound();
  }

  return (
    <>
      <ReceiptItems receipt={receipt} />
      <Link href="/receipts" className="text-sm text-gray-600 hover:underline">
        ← Back to receipts
      </Link>
    </>
  );
}
