export interface StoredSession {
  accessToken: string;
  refreshToken: string;
}
const KEY = "lottery-session";
export const getStoredSession = (): StoredSession | null => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};
export const saveStoredSession = (value: StoredSession) =>
  localStorage.setItem(KEY, JSON.stringify(value));
export const clearStoredSession = () => localStorage.removeItem(KEY);
