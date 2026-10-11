<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import type {
  Participant,
  ParticipantDraft,
  ParticipantErrors,
} from "@/types/participant";
import { hasValidationErrors, validateParticipant } from "@/utils/validation";

interface Props {
  participants: Participant[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "add-participant": [participant: ParticipantDraft];
}>();

function createEmptyParticipant(): ParticipantDraft {
  return {
    name: "",
    birthDate: "",
    email: "",
    phone: "",
  };
}

const form = reactive<ParticipantDraft>(createEmptyParticipant());

const errors = ref<ParticipantErrors>({});

const maxDate = computed(() => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
});

function clearFieldError(field: keyof ParticipantErrors): void {
  if (!errors.value[field]) {
    return;
  }

  const updatedErrors = { ...errors.value };
  delete updatedErrors[field];
  errors.value = updatedErrors;
}

function resetForm(): void {
  Object.assign(form, createEmptyParticipant());
  errors.value = {};
}

function submitForm(): void {
  const normalizedParticipant: ParticipantDraft = {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
  };

  errors.value = validateParticipant(normalizedParticipant, props.participants);

  if (hasValidationErrors(errors.value)) {
    return;
  }

  emit("add-participant", normalizedParticipant);
  resetForm();
}

function submitWithEnter(): void {
  submitForm();
}
</script>

<template>
  <section class="lottery-panel">
    <h2 class="panel-title">Реєстрація нового учасника</h2>

    <p class="text-secondary mb-4">Усі поля форми є обов’язковими.</p>

    <form
      novalidate
      @submit.prevent="submitForm"
      @keydown.enter.prevent="submitWithEnter"
    >
      <div class="row">
        <div class="col-md-6">
          <BaseInput
            id="participant-name"
            v-model="form.name"
            label="Ім’я"
            placeholder="Введіть ім’я учасника"
            autocomplete="name"
            :error="errors.name"
            @update:model-value="clearFieldError('name')"
          />
        </div>

        <div class="col-md-6">
          <BaseInput
            id="participant-birth-date"
            v-model="form.birthDate"
            label="Дата народження"
            type="date"
            :max="maxDate"
            :error="errors.birthDate"
            @update:model-value="clearFieldError('birthDate')"
          />
        </div>

        <div class="col-md-6">
          <BaseInput
            id="participant-email"
            v-model="form.email"
            label="Електронна пошта"
            type="email"
            placeholder="name@example.com"
            autocomplete="email"
            :error="errors.email"
            @update:model-value="clearFieldError('email')"
          />
        </div>

        <div class="col-md-6">
          <BaseInput
            id="participant-phone"
            v-model="form.phone"
            label="Номер телефону"
            type="tel"
            placeholder="+380XXXXXXXXX"
            autocomplete="tel"
            :error="errors.phone"
            @update:model-value="clearFieldError('phone')"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <BaseButton type="submit"> Зберегти учасника </BaseButton>
      </div>
    </form>
  </section>
</template>
