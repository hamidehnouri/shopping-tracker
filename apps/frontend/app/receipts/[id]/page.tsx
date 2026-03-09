import { getReceipt } from "@/lib/api";
import { ReceiptItem } from "@/types/receipt";
import Link from "next/dist/client/link";
import { notFound } from "next/navigation";

export default async function ReceiptDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const receipt = await getReceipt(id);

  console.log(receipt);
  if (!receipt) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Receipt #{receipt.id}</h1>

      <div className="rounded-xl border p-4 bg-white">
        <div className="space-y-2 text-sm">
          <div>Store: {receipt.storeName}</div>
          <div>Date: {receipt.purchasedAt}</div>
          <div>Total: {receipt.totalAmount}</div>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white">
        <h2 className="font-semibold mb-3">Items</h2>

        <ul className="space-y-2">
          {receipt.items.map((item: ReceiptItem) => (
            <li
              key={item.id}
              className="flex justify-between border rounded-md px-3 py-2"
            >
              <span>{item.descriptionRaw}</span>
              <span>{item.quantity}</span>
              <span>{item.unitPrice}</span>
              <span>{item.totalPrice}</span>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/receipts" className="text-sm text-gray-600 hover:underline">
        ← Back to receipts
      </Link>
    </main>
  );
}
