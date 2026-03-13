"use client";

import { useRef, type ReactNode, type ChangeEvent } from "react";
import { FabButton } from "@/components/ui/FabButton";
import { ScanText } from "lucide-react";

type ScanReceiptButtonProps = {
  onImageSelected?: (file: File) => void | Promise<void>;
  disabled?: boolean;
  children?: ReactNode;
};

export default function ScanReceiptButton({
  onImageSelected,
  disabled = false,
  children,
}: ScanReceiptButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
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

      <div onClick={openPicker}>
        {children ?? (
          <FabButton disabled={disabled}>
            <ScanText className="h-7 w-7 text-gray-700 transition-colors group-hover:text-violet-600" />
          </FabButton>
        )}
      </div>
    </>
  );
}
