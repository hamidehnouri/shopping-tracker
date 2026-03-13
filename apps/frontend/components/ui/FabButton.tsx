import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type FabButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export function FabButton({
  children,
  className = "",
  type = "button",
  ...props
}: FabButtonProps) {
  return (
    <button
      type={type}
      className={`group inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
