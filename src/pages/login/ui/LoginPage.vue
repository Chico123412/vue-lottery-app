<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { LoginForm } from "@/features/auth";
const route = useRoute(),
  router = useRouter();
function success() {
  router.replace(String(route.query.redirect || "/users"));
}
</script>
<template>
  <div>
    <RouterLink class="logo auth-logo" to="/"
      ><span>V</span>Vue Users</RouterLink
    ><LoginForm @success="success" />
  </div>
</template>
