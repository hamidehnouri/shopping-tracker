const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://192.168.1.158:4001";

export async function scanReceipt(file: File) {
  const formData = new FormData();
  formData.append("receipt", file);

  const res = await fetch(`${API_BASE}/api/receipts/scan`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to scan receipt");
  }

  return res.json();
}

export async function getReceipts() {
  const res = await fetch(`${API_BASE}/api/receipts`);

  if (!res.ok) {
    throw new Error("Failed to fetch receipts");
  }

  return res.json();
}

export async function getReceipt(id: string) {
  const res = await fetch(`${API_BASE}/api/receipts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export async function createReceipt(receipt: unknown) {
  const res = await fetch(`${API_BASE}/api/receipts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receipt),
  });

  if (!res.ok) {
    throw new Error("Failed to save receipt");
  }

  return res.json();
}

export async function deleteReceipt(id: number) {
  const res = await fetch(`${API_BASE}/api/receipts/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete receipt");
  }
}
