import { ref } from 'vue'
import { defineStore } from 'pinia'
import { services } from '@/services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([]), total = ref(0), loading = ref(false), error = ref('')
  async function fetchUsers(page = 1, query = '', limit = 10) {
    loading.value = true; error.value = ''
    try { const data = await services.users.getAll(limit, (page - 1) * limit, query); users.value = data.users; total.value = data.total }
    catch (e) { error.value = e instanceof Error ? e.message : 'Помилка завантаження' }
    finally { loading.value = false }
  }
  async function getById(id: number) { return users.value.find((u) => u.id === id) ?? services.users.getById(id) }
  async function create(data: CreateUserDto) { const user = await services.users.create(data); users.value.unshift(user); total.value++; return user }
  async function update(id: number, data: UpdateUserDto) { const user = await services.users.update(id, data); users.value = users.value.map((u) => u.id === id ? { ...u, ...user } : u); return user }
  async function remove(id: number) { await services.users.delete(id); users.value = users.value.filter((u) => u.id !== id); total.value-- }
  return { users, total, loading, error, fetchUsers, getById, create, update, remove }
})
