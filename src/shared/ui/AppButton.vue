<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  label: string;
  loading?: boolean;
  severity?: "secondary" | "danger";
  type?: "button" | "submit" | "reset";
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <Button
    class="app-button"
    :class="severity"
    :label="label"
    :loading="loading"
    :type="type ?? 'button'"
    @click="$emit('click', $event)"
  />
</template>
