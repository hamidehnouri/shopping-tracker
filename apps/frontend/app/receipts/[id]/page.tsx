import ReceiptItems from "@/components/receipts/ReceiptItems";
import { LinkButton } from "@/components/ui/button/Button";
import { getReceipt } from "@/lib/api";
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
      <div className="fixed bottom-0 left-0 right-0 flex justify-end gap-4 border-t border-gray-200 bg-white px-6 py-4">
        <LinkButton href="/receipts" variant="outline">
          ← Back
        </LinkButton>
      </div>
    </>
  );
}
