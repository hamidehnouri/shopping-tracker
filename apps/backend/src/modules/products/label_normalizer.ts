export function normalizeLabel(label: string): string {
  return label.toLowerCase().trim().replace(/\s+/g, " ");
}
