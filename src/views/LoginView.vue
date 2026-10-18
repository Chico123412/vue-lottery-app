<script setup lang="ts">
import { ref } from 'vue'; import { useRoute, useRouter } from 'vue-router'; import { useForm, useField } from 'vee-validate'; import * as yup from 'yup'; import { useAuthStore } from '@/stores/auth'
const route = useRoute(), router = useRouter(), auth = useAuthStore(), apiError = ref('')
const { handleSubmit, isSubmitting } = useForm({ validationSchema: yup.object({ username: yup.string().required('Введіть логін'), password: yup.string().min(6, 'Мінімум 6 символів').required('Введіть пароль') }), initialValues: { username: 'emilys', password: 'emilyspass' } })
const username = useField<string>('username'), password = useField<string>('password')
const submit = handleSubmit(async (values) => { apiError.value = ''; try { await auth.login(values); await router.replace(String(route.query.redirect || '/users')) } catch (e) { apiError.value = e instanceof Error ? e.message : 'Помилка входу' } })
</script>
<template><form class="auth-card" @submit="submit"><p class="eyebrow">ЗАХИЩЕНИЙ ВХІД</p><h1>Увійти</h1><p class="text-secondary">Тестові дані вже заповнені.</p><label>Логін<input v-model="username.value.value" class="form-control"/><small>{{ username.errorMessage.value }}</small></label><label>Пароль<input v-model="password.value.value" type="password" class="form-control"/><small>{{ password.errorMessage.value }}</small></label><div v-if="apiError" class="alert alert-danger">{{ apiError }}</div><button class="btn btn-primary w-100" :disabled="isSubmitting">{{ isSubmitting ? 'Вхід…' : 'Увійти' }}</button></form></template>
