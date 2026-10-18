<script setup lang="ts">
import { ref } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useToast } from "primevue/usetoast";
import { useSessionStore } from "@/entities/session";
import { AppButton, AppInput } from "@/shared/ui";

const emit = defineEmits<{
  success: [];
}>();

const session = useSessionStore();
const toast = useToast();
const apiError = ref("");

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: yup.object({
    username: yup.string().required("Введіть логін"),
    password: yup
      .string()
      .min(6, "Мінімум 6 символів")
      .required("Введіть пароль"),
  }),
  initialValues: {
    username: "emilys",
    password: "emilyspass",
  },
});

const username = useField<string>("username");
const password = useField<string>("password");

const submit = handleSubmit(async (values) => {
  apiError.value = "";

  try {
    await session.login(values.username, values.password);

    toast.add({
      severity: "success",
      summary: "Вхід виконано",
      life: 2500,
    });

    emit("success");
  } catch (error) {
    apiError.value = (error as Error).message;

    toast.add({
      severity: "error",
      summary: "Помилка авторизації",
      detail: apiError.value,
      life: 3000,
    });
  }
});
</script>

<template>
  <form class="auth-card" @submit.prevent="submit">
    <p class="eyebrow">ЗАХИЩЕНИЙ ВХІД</p>
    <h1>Увійти</h1>

    <AppInput
      v-model="username.value.value"
      label="Логін"
      :error="username.errorMessage.value"
    />

    <AppInput
      v-model="password.value.value"
      label="Пароль"
      type="password"
      :error="password.errorMessage.value"
    />

    <div v-if="apiError" class="alert">
      {{ apiError }}
    </div>

    <AppButton label="Увійти" type="submit" :loading="isSubmitting" />
  </form>
</template>
