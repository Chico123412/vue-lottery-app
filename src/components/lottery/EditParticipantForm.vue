<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import type {
  Participant,
  ParticipantDraft,
  ParticipantErrors,
} from "@/types/participant";
import { hasValidationErrors, validateParticipant } from "@/utils/validation";

interface Props {
  participant: Participant;
  participants: Participant[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  update: [participant: Participant];
  cancel: [];
}>();

const form = reactive<ParticipantDraft>({
  name: "",
  birthDate: "",
  email: "",
  phone: "",
});

const errors = ref<ParticipantErrors>({});

const maxDate = computed(() => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
});

watch(
  () => props.participant,
  (participant) => {
    Object.assign(form, {
      name: participant.name,
      birthDate: participant.birthDate,
      email: participant.email,
      phone: participant.phone,
    });

    errors.value = {};
  },
  {
    immediate: true,
  },
);

function clearFieldError(field: keyof ParticipantErrors): void {
  if (!errors.value[field]) {
    return;
  }

  const updatedErrors = { ...errors.value };
  delete updatedErrors[field];
  errors.value = updatedErrors;
}

function submitForm(): void {
  const participantDraft: ParticipantDraft = {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
  };

  errors.value = validateParticipant(
    participantDraft,
    props.participants,
    props.participant.id,
  );

  if (hasValidationErrors(errors.value)) {
    return;
  }

  emit("update", {
    id: props.participant.id,
    ...participantDraft,
  });
}
</script>

<template>
  <form
    novalidate
    @submit.prevent="submitForm"
    @keydown.enter.prevent="submitForm"
  >
    <BaseInput
      id="edit-participant-name"
      v-model="form.name"
      label="Ім’я"
      placeholder="Введіть ім’я учасника"
      autocomplete="name"
      :error="errors.name"
      @update:model-value="clearFieldError('name')"
    />

    <BaseInput
      id="edit-participant-birth-date"
      v-model="form.birthDate"
      label="Дата народження"
      type="date"
      :max="maxDate"
      :error="errors.birthDate"
      @update:model-value="clearFieldError('birthDate')"
    />

    <BaseInput
      id="edit-participant-email"
      v-model="form.email"
      label="Електронна пошта"
      type="email"
      placeholder="name@example.com"
      autocomplete="email"
      :error="errors.email"
      @update:model-value="clearFieldError('email')"
    />

    <BaseInput
      id="edit-participant-phone"
      v-model="form.phone"
      label="Номер телефону"
      type="tel"
      placeholder="+380XXXXXXXXX"
      autocomplete="tel"
      :error="errors.phone"
      @update:model-value="clearFieldError('phone')"
    />

    <div class="form-actions">
      <BaseButton variant="secondary" @click="emit('cancel')">
        Скасувати
      </BaseButton>

      <BaseButton type="submit"> Оновити дані </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}
</style>
