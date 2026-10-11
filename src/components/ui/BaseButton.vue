<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "primary",
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => {
  const classes = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    outline: "btn-outline-primary",
  };

  return classes[props.variant];
});
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="buttonClass"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
