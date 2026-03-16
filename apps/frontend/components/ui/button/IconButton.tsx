import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type IconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  variant?: "default" | "danger";
};

export function IconButton({
  children,
  variant = "default",
  className,
  ...props
}: IconButtonProps) {
  const variants = {
    default: "text-gray-400 hover:text-violet-600",
    danger: "text-gray-300 hover:text-amber-500",
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center p-2 transition",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
