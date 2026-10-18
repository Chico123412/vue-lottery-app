import { clearSession, readSession, saveSession } from './auth-session'

const API_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

async function refreshAccessToken(): Promise<string | null> {
  const session = readSession()
  if (!session?.refreshToken) return null
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: session.refreshToken, expiresInMins: 30 }),
  })
  if (!response.ok) { clearSession(); return null }
  const tokens = await response.json() as { accessToken: string; refreshToken: string }
  saveSession({ ...session, ...tokens })
  window.dispatchEvent(new CustomEvent('auth-session-refreshed'))
  return tokens.accessToken
}

export async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const session = readSession()
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (session?.accessToken) headers.set('Authorization', `Bearer ${session.accessToken}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (response.status === 401 && retry && await refreshAccessToken()) return request<T>(path, options, false)
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string }
    throw new Error(body.message || `HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}
