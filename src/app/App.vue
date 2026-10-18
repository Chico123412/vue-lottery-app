<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Toast from "primevue/toast";
import { AppConfirmDialog } from "@/shared/ui";
import { AppHeader } from "@/widgets/app-header";
const route = useRoute();
const auth = computed(() => route.meta.layout === "auth");
</script>
<template>
  <Toast /><AppConfirmDialog />
  <main v-if="auth" class="auth-layout"><RouterView /></main>
  <template v-else
    ><AppHeader />
    <main class="container py-5"><RouterView /></main>
    <footer>Лабораторна №6 · Feature-Sliced Design</footer></template
  >
</template>
