export const capitalize = (s: string) =>
  s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "";

export const formatMoney = (amount: number | null, currency: string) => {
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};

export const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
