<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSessionStore } from "@/entities/session";
import { useSettingsStore } from "@/entities/settings";
const session = useSessionStore(),
  settings = useSettingsStore(),
  router = useRouter();
function logout() {
  session.clearSession();
  router.push("/login");
}
</script>
<template>
  <header>
    <div class="container header-inner">
      <RouterLink class="logo" to="/"><span>V</span>Vue Users</RouterLink>
      <nav class="nav-links">
        <RouterLink to="/">Головна</RouterLink
        ><RouterLink to="/about">Про автора</RouterLink
        ><RouterLink v-if="session.isAuthenticated" to="/users"
          >Користувачі</RouterLink
        ><button class="icon-button" @click="settings.toggleTheme">
          {{ settings.theme === "light" ? "🌙" : "☀️" }}</button
        ><button
          v-if="session.isAuthenticated"
          class="outline-button"
          @click="logout"
        >
          Вийти</button
        ><RouterLink v-else to="/login">Увійти</RouterLink>
      </nav>
    </div>
  </header>
</template>
