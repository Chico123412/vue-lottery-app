<script setup lang="ts">
interface Props {
  id: string;
  modelValue: string;
  label: string;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  error?: string;
  max?: string;
  autocomplete?: string;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  error: "",
  max: undefined,
  autocomplete: "off",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  emit("update:modelValue", input.value);
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">
      {{ label }}
    </label>

    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :max="max"
      :autocomplete="autocomplete"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="handleInput"
    />

    <span v-if="error" :id="`${id}-error`" class="form-error">
      {{ error }}
    </span>
  </div>
</template>
