import type { AuthSession } from '@/types/auth'

const KEY = 'lottery-auth-session'

export const readSession = (): AuthSession | null => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') as AuthSession | null } catch { return null }
}
export const saveSession = (session: AuthSession) => localStorage.setItem(KEY, JSON.stringify(session))
export const clearSession = () => localStorage.removeItem(KEY)
