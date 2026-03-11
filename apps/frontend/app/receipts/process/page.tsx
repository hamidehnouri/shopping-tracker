import { Loader2 } from "lucide-react";

export default function ReceiptProcessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-gray-700" />

      <h1 className="text-xl font-semibold text-gray-900">
        Scanning the receipt...
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Please wait while we extract the details.
      </p>
    </div>
  );
}
