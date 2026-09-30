import { getStoredPassword } from "./components/PasswordGate";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

function authHeaders(extra = {}) {
  return { "x-app-password": getStoredPassword(), ...extra };
}

export async function convert(text, direction, save = true) {
  const res = await fetch(`${BASE}/convert`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ text, direction, save }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchHistory(limit = 20) {
  const res = await fetch(`${BASE}/history?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function clearHistory() {
  const res = await fetch(`${BASE}/history`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.ok;
}
