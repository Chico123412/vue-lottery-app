import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { clearSession, readSession, saveSession } from '@/api/auth-session'
import { services } from '@/services/service-provider'
import type { LoginDto } from '@/types/auth'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(readSession())
  const user = computed<User | null>(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => Boolean(session.value?.accessToken))
  async function login(credentials: LoginDto) {
    const result = await services.auth.login(credentials)
    const { accessToken, refreshToken, ...loggedUser } = result
    session.value = { user: loggedUser, accessToken, refreshToken }
    saveSession(session.value)
  }
  async function initialize() {
    session.value = readSession()
    if (!session.value) return
    try { session.value.user = await services.auth.me(); saveSession(session.value) } catch { logout() }
  }
  function logout() { session.value = null; clearSession() }
  window.addEventListener('auth-session-refreshed', () => { session.value = readSession() })
  return { user, isAuthenticated, login, initialize, logout }
})
