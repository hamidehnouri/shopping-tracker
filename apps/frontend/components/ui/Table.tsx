import type { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: PropsWithChildren) {
  return <thead className="bg-gray-50 text-gray-600">{children}</thead>;
}

export function TR({ children }: PropsWithChildren) {
  return <tr className="border-t border-gray-100">{children}</tr>;
}

export function TH({ children }: PropsWithChildren) {
  return <th className="px-4 py-3 text-left font-medium">{children}</th>;
}

export function TD({ children }: PropsWithChildren) {
  return <td className="px-4 py-3 text-gray-900">{children}</td>;
}
