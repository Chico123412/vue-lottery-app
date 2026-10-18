<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useUsersStore, type User } from "@/entities/user";
const props = defineProps<{ id: string }>(),
  store = useUsersStore(),
  user = ref<User | null>(null),
  error = ref("");
async function load() {
  try {
    user.value = await store.fetchUser(Number(props.id));
  } catch (e) {
    error.value = (e as Error).message;
  }
}
onMounted(load);
watch(() => props.id, load);
</script>
<template>
  <RouterView v-if="$route.name === 'user-edit'" />
  <section v-else-if="user" class="profile page-card">
    <img :src="user.image" alt="" />
    <div>
      <p class="eyebrow">USER #{{ user.id }}</p>
      <h1>{{ user.firstName }} {{ user.lastName }}</h1>
      <p>{{ user.email }} · @{{ user.username }}</p>
      <p>{{ user.phone }} · {{ user.age }} років · {{ user.gender }}</p>
      <div class="button-row">
        <RouterLink class="app-link-button" :to="`/users/${user.id}/edit`"
          >Редагувати</RouterLink
        ><RouterLink to="/users">Назад</RouterLink>
      </div>
    </div>
  </section>
  <div v-else-if="error" class="alert">{{ error }}</div>
  <div v-else class="status">Завантаження…</div>
</template>
