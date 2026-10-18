<script setup lang="ts">
import InputText from "primevue/inputtext";
defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  error?: string;
}>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>
<template>
  <label class="app-field"
    ><span>{{ label }}</span
    ><InputText
      :model-value="modelValue"
      :type="type"
      @update:model-value="$emit('update:modelValue', String($event))"
    /><small>{{ error }}</small></label
  >
</template>
