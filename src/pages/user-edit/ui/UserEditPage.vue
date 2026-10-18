<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { UserForm } from "@/features/user-form";
import { useUsersStore, type CreateUserDto, type User } from "@/entities/user";
const props = defineProps<{ id: string }>(),
  store = useUsersStore(),
  router = useRouter(),
  toast = useToast(),
  user = ref<User>(),
  error = ref("");
onMounted(async () => {
  try {
    user.value = await store.fetchUser(Number(props.id));
  } catch (e) {
    error.value = (e as Error).message;
  }
});
async function submit(data: CreateUserDto) {
  try {
    await store.updateUser(Number(props.id), data);
    toast.add({
      severity: "success",
      summary: "Користувача оновлено",
      life: 2500,
    });
    router.push(`/users/${props.id}`);
  } catch (e) {
    error.value = (e as Error).message;
  }
}
</script>
<template>
  <h1>Редагування користувача</h1>
  <div v-if="error" class="alert">{{ error }}</div>
  <UserForm
    v-if="user"
    :initial="user"
    submit-label="Зберегти"
    @submit="submit"
  />
  <div v-else class="status">Завантаження…</div>
</template>
