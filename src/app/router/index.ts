import { createRouter, createWebHistory } from "vue-router";
import { useSessionStore } from "@/entities/session";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home"),
      meta: { title: "Головна" },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/pages/about"),
      meta: { title: "Про автора" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login"),
      meta: { title: "Вхід", layout: "auth" },
    },
    {
      path: "/users",
      name: "users",
      component: () => import("@/pages/users"),
      meta: { title: "Користувачі", requiresAuth: true },
    },
    {
      path: "/users/new",
      name: "user-create",
      component: () => import("@/pages/user-create"),
      meta: { title: "Новий користувач", requiresAuth: true },
    },
    {
      path: "/users/:id",
      name: "user-detail",
      component: () => import("@/pages/user-details"),
      props: true,
      meta: { title: "Профіль", requiresAuth: true },
      children: [
        {
          path: "edit",
          name: "user-edit",
          component: () => import("@/pages/user-edit"),
          props: true,
          meta: { title: "Редагування", requiresAuth: true },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/not-found"),
      meta: { title: "404" },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
router.beforeEach((to) => {
  const s = useSessionStore();
  if (to.meta.requiresAuth && !s.isAuthenticated)
    return { name: "login", query: { redirect: to.fullPath } };
  if (to.name === "login" && s.isAuthenticated) return { name: "users" };
});
router.afterEach((to) => (document.title = `${to.meta.title} — FSD Lab`));
export default router;
