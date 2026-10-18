<script setup lang="ts">
import { watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import type { CreateUserDto, User } from "@/entities/user";
const props = defineProps<{
  initial?: Partial<User>;
  submitLabel: string;
  includePassword?: boolean;
}>();
const emit = defineEmits<{ submit: [data: CreateUserDto] }>();
const schema = yup.object({
  firstName: yup.string().required("Обов’язкове поле"),
  lastName: yup.string().required("Обов’язкове поле"),
  email: yup.string().email("Некоректний email").required("Обов’язкове поле"),
  username: yup.string().required("Обов’язкове поле"),
  password: props.includePassword
    ? yup.string().min(6, "Мінімум 6 символів").required("Обов’язкове поле")
    : yup.string(),
  age: yup.number().min(1).max(120).required(),
  gender: yup.string().required(),
  phone: yup.string().required("Обов’язкове поле"),
});
const { defineField, errors, handleSubmit, resetForm, isSubmitting } =
  useForm<CreateUserDto>({
    validationSchema: schema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      age: 18,
      gender: "male",
      phone: "",
      ...props.initial,
    },
  });
watch(
  () => props.initial,
  (value) =>
    value && resetForm({ values: { password: "", ...value } as CreateUserDto }),
  { deep: true },
);
const [firstName] = defineField("firstName"),
  [lastName] = defineField("lastName"),
  [email] = defineField("email"),
  [username] = defineField("username"),
  [password] = defineField("password"),
  [age] = defineField("age"),
  [gender] = defineField("gender"),
  [phone] = defineField("phone");
const submit = handleSubmit((values) => emit("submit", values));
</script>
<template>
  <form class="page-card user-form" @submit="submit">
    <div class="form-grid">
      <label
        >Ім’я<input v-model="firstName" class="form-control" /><small>{{
          errors.firstName
        }}</small></label
      ><label
        >Прізвище<input v-model="lastName" class="form-control" /><small>{{
          errors.lastName
        }}</small></label
      ><label
        >Email<input
          v-model="email"
          type="email"
          class="form-control"
        /><small>{{ errors.email }}</small></label
      ><label
        >Username<input v-model="username" class="form-control" /><small>{{
          errors.username
        }}</small></label
      ><label v-if="includePassword"
        >Пароль<input
          v-model="password"
          type="password"
          class="form-control"
        /><small>{{ errors.password }}</small></label
      ><label
        >Вік<input v-model="age" type="number" class="form-control" /><small>{{
          errors.age
        }}</small></label
      ><label
        >Стать<select v-model="gender" class="form-select">
          <option value="male">Чоловіча</option>
          <option value="female">Жіноча</option>
        </select></label
      ><label
        >Телефон<input v-model="phone" class="form-control" /><small>{{
          errors.phone
        }}</small></label
      >
    </div>
    <button class="btn btn-primary" :disabled="isSubmitting">
      {{ submitLabel }}
    </button>
  </form>
</template>
