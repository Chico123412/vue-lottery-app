import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  request,
  clearStoredSession,
  getStoredSession,
  saveStoredSession,
} from "@/shared/api";
interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age: number;
  gender: string;
  phone: string;
  image?: string;
}
interface LoginResult extends SessionUser {
  accessToken: string;
  refreshToken: string;
}
export const useSessionStore = defineStore(
  "session",
  () => {
    const stored = getStoredSession();
    const accessToken = ref(stored?.accessToken ?? null),
      refreshToken = ref(stored?.refreshToken ?? null),
      user = ref<SessionUser | null>(null);
    const isAuthenticated = computed(() => Boolean(accessToken.value));
    function setSession(result: LoginResult) {
      const { accessToken: a, refreshToken: r, ...u } = result;
      accessToken.value = a;
      refreshToken.value = r;
      user.value = u;
      saveStoredSession({ accessToken: a, refreshToken: r });
    }
    function clearSession() {
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
      clearStoredSession();
    }
    async function login(username: string, password: string) {
      setSession(
        await request<LoginResult>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password, expiresInMins: 30 }),
        }),
      );
    }
    async function initialize() {
      if (!accessToken.value) return;
      try {
        user.value = await request<SessionUser>("/auth/me");
      } catch {
        clearSession();
      }
    }
    return {
      accessToken,
      refreshToken,
      user,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      initialize,
    };
  },
  { persist: { pick: ["user"] } },
);
