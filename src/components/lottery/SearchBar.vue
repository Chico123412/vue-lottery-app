<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import BaseInput from "@/components/ui/BaseInput.vue";

const emit = defineEmits<{
  "filter-by-name": [searchValue: string];
}>();

const searchValue = ref("");
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(searchValue, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    emit("filter-by-name", newValue.trim());
  }, 300);
});

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <div class="search-bar">
    <BaseInput
      id="participant-search"
      v-model="searchValue"
      label="Пошук учасників"
      placeholder="Введіть ім’я..."
      autocomplete="off"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  width: min(100%, 360px);

  :deep(.mb-3) {
    margin-bottom: 0 !important;
  }
}
</style>
