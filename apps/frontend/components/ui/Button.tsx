import type { ComponentProps } from "react";
import Link from "next/link";

type Variant = "solid" | "outline";

function getClasses(variant: Variant) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-full transition";

  const variants = {
    solid: "bg-violet-500 hover:bg-violet-700 text-white",
    outline:
      "border border-violet-500 bg-transparent text-violet-500 hover:bg-violet-500 hover:text-white",
  };

  return `${base} ${variants[variant]}`;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
};

export function Button({
  variant = "solid",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={`${getClasses(variant)} ${className}`} />
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
};

export function LinkButton({
  variant = "solid",
  className = "",
  ...props
}: LinkButtonProps) {
  return <Link {...props} className={`${getClasses(variant)} ${className}`} />;
}
