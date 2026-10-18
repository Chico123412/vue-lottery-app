import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ServiceProvider } from "@/shared/api";
import type { UserService } from "../api/user.service";
import type { CreateUserDto, UpdateUserDto, User } from "./types";
export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]),
    total = ref(0),
    isLoading = ref(false),
    error = ref<string | null>(null);
  const hasUsers = computed(() => users.value.length > 0);
  const service = () => ServiceProvider.get<UserService>("users");
  async function fetchUsers(page = 1, query = "", limit = 10) {
    isLoading.value = true;
    error.value = null;
    try {
      const x = await service().getAll(limit, (page - 1) * limit, query);
      users.value = x.users;
      total.value = x.total;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchUser(id: number) {
    return users.value.find((u) => u.id === id) ?? service().getById(id);
  }
  async function createUser(data: CreateUserDto) {
    const u = await service().create(data);
    users.value.unshift(u);
    total.value++;
    return u;
  }
  async function updateUser(id: number, data: UpdateUserDto) {
    const u = await service().update(id, data);
    users.value = users.value.map((x) => (x.id === id ? { ...x, ...u } : x));
    return u;
  }
  async function removeUser(id: number) {
    await service().delete(id);
    users.value = users.value.filter((x) => x.id !== id);
    total.value--;
  }
  return {
    users,
    total,
    isLoading,
    error,
    hasUsers,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    removeUser,
  };
});
