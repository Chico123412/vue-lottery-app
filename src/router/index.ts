import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Головна' } },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'Про автора' } },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: 'Вхід', layout: 'auth' } },
    { path: '/users', name: 'users', component: () => import('@/views/users/UsersView.vue'), meta: { title: 'Користувачі', requiresAuth: true } },
    { path: '/users/new', name: 'user-create', component: () => import('@/views/users/UserCreateView.vue'), meta: { title: 'Новий користувач', requiresAuth: true } },
    {
      path: '/users/:id', name: 'user-detail', component: () => import('@/views/users/UserDetailView.vue'), props: true,
      meta: { title: 'Профіль користувача', requiresAuth: true },
      children: [{ path: 'edit', name: 'user-edit', component: () => import('@/views/users/UserEditView.vue'), props: true, meta: { title: 'Редагування', requiresAuth: true } }],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: '404' } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'users' }
})
router.afterEach((to) => { document.title = `${to.meta.title} — Vue Users Lab` })
export default router
