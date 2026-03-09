"use client";

import { useRef } from "react";
import { ScanText } from "lucide-react";

type ScanReceiptButtonProps = {
  onImageSelected?: (file: File) => void | Promise<void>;
  disabled?: boolean;
};

export default function ScanReceiptButton({
  onImageSelected,
  disabled = false,
}: ScanReceiptButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await onImageSelected?.(file);

    event.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ScanText className="h-7 w-7 text-gray-700" />
      </button>
    </>
  );
}
