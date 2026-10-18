<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { UserForm } from "@/features/user-form";
import { useUsersStore, type CreateUserDto } from "@/entities/user";
const store = useUsersStore(),
  router = useRouter(),
  toast = useToast(),
  error = ref("");
async function submit(data: CreateUserDto) {
  try {
    const user = await store.createUser(data);
    toast.add({
      severity: "success",
      summary: "Користувача створено",
      life: 2500,
    });
    router.push(`/users/${user.id}`);
  } catch (e) {
    error.value = (e as Error).message;
  }
}
</script>
<template>
  <div class="page-heading"><h1>Новий користувач</h1></div>
  <div v-if="error" class="alert">{{ error }}</div>
  <UserForm submit-label="Створити" include-password @submit="submit" />
</template>
