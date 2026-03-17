import { Loader2 } from "lucide-react";
import { H2, Muted } from "@/components/ui/Typography";

export default function ReceiptProcessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-gray-700" />

      <H2>Scanning the receipt...</H2>
      <Muted className="mt-2">
        Please wait while we read the receipt details.
      </Muted>
    </div>
  );
}
