<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(), router = useRouter()
function logout() { auth.logout(); router.push({ name: 'login' }) }
</script>
<template>
  <nav class="nav-links">
    <RouterLink to="/">Головна</RouterLink><RouterLink to="/about">Про автора</RouterLink>
    <RouterLink v-if="auth.isAuthenticated" to="/users">Користувачі</RouterLink>
    <button v-if="auth.isAuthenticated" class="btn btn-sm btn-outline-light" @click="logout">Вийти</button>
    <RouterLink v-else to="/login">Увійти</RouterLink>
  </nav>
</template>
