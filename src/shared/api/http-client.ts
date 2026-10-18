import { API_URL } from "@/shared/config";
import {
  clearStoredSession,
  getStoredSession,
  saveStoredSession,
} from "./session";
import type { StoredSession } from "./session";
async function refreshToken() {
  const session = getStoredSession();
  if (!session) return null;
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });
  if (!response.ok) {
    clearStoredSession();
    return null;
  }
  const value = (await response.json()) as StoredSession;
  saveStoredSession(value);
  return value.accessToken;
}
export async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers),
    session = getStoredSession();
  if (options.body) headers.set("Content-Type", "application/json");
  if (session?.accessToken)
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401 && retry && (await refreshToken()))
    return request<T>(path, options, false);
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}
