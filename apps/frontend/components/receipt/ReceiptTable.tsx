import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TR, TH, TD } from "@/components/ui/Table";
import type { ReceiptListItem } from "@/types/receipt";

function formatMoney(amount: number | null, currency: string) {
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function ReceiptTable({
  receipts,
  onRowClick,
}: {
  receipts: ReceiptListItem[];
  onRowClick?: (id: number) => void;
}) {
  // Mobile: cards
  return (
    <div className="space-y-3">
      <div className="block md:hidden space-y-3">
        {receipts.map((r) => (
          <button
            key={r.id}
            onClick={() => onRowClick?.(r.id)}
            className="w-full text-left"
          >
            <Card>
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {r.storeName ?? "Unknown store"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(r.purchasedAt)}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatMoney(r.totalAmount, r.currency)}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">#{r.id}</div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          <THead>
            <tr>
              <TH>ID</TH>
              <TH>Store</TH>
              <TH>Purchased at</TH>
              <TH>Total</TH>
            </tr>
          </THead>
          <tbody>
            {receipts.map((r) => (
              <TR key={r.id}>
                <TD>
                  <button
                    className="text-gray-900 hover:underline"
                    onClick={() => onRowClick?.(r.id)}
                  >
                    {r.id}
                  </button>
                </TD>
                <TD>{r.storeName ?? "—"}</TD>
                <TD>{formatDate(r.purchasedAt)}</TD>
                <TD>
                  <span className="font-medium">
                    {formatMoney(r.totalAmount, r.currency)}
                  </span>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
