<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "@/entities/user";
import { UsersTable } from "@/widgets/users-table";
const route = useRoute(),
  router = useRouter(),
  store = useUsersStore(),
  { users, total, isLoading, error } = storeToRefs(store),
  search = ref(String(route.query.q || "")),
  limit = 10,
  page = computed(() => Math.max(1, Number(route.query.page) || 1)),
  pages = computed(() => Math.max(1, Math.ceil(total.value / limit)));
let timer = 0;
const load = () =>
  store.fetchUsers(page.value, String(route.query.q || ""), limit);
function onSearch() {
  clearTimeout(timer);
  timer = window.setTimeout(
    () =>
      router.replace({
        query: {
          page: 1,
          ...(search.value.trim() ? { q: search.value.trim() } : {}),
        },
      }),
    350,
  );
}
function setPage(p: number) {
  router.push({ query: { ...route.query, page: p } });
}
watch(() => route.query, load);
onMounted(load);
</script>
<template>
  <section>
    <div class="page-heading">
      <div>
        <p class="eyebrow">FSD + PINIA</p>
        <h1>Користувачі</h1>
      </div>
      <RouterLink class="app-link-button" to="/users/new">+ Додати</RouterLink>
    </div>
    <input
      v-model="search"
      class="search-input"
      placeholder="Пошук користувачів…"
      @input="onSearch"
    />
    <div v-if="isLoading" class="status">Завантаження…</div>
    <div v-else-if="error" class="alert">{{ error }}</div>
    <UsersTable v-else :users="users" @remove="store.removeUser" />
    <div class="pagination">
      <button :disabled="page <= 1" @click="setPage(page - 1)">←</button
      ><span>Сторінка {{ page }} з {{ pages }}</span
      ><button :disabled="page >= pages" @click="setPage(page + 1)">→</button>
    </div>
  </section>
</template>
