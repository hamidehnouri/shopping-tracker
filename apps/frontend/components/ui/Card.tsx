import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function CardHeader({ children }: PropsWithChildren) {
  return <div className="p-4 border-b border-gray-200">{children}</div>;
}

export function CardContent({ children }: PropsWithChildren) {
  return <div className="p-4">{children}</div>;
}
