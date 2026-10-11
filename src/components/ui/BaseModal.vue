<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";

interface Props {
  modelValue: boolean;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  close: [];
}>();

const modalOverlay = ref<HTMLElement | null>(null);

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      modalOverlay.value?.focus();
    }
  },
);

function closeModal(): void {
  emit("update:modelValue", false);
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        ref="modalOverlay"
        class="modal-overlay"
        role="presentation"
        tabindex="-1"
        @click.self="closeModal"
        @keydown.esc="closeModal"
      >
        <section
          class="modal-window"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'Модальне вікно'"
        >
          <header class="modal-header">
            <slot name="header">
              <h2 class="modal-title">
                {{ title }}
              </h2>
            </slot>

            <BaseButton
              variant="secondary"
              aria-label="Закрити модальне вікно"
              @click="closeModal"
            >
              ×
            </BaseButton>
          </header>

          <div class="modal-body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  z-index: 1050;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
  background: rgb(15 23 42 / 60%);
}

.modal-window {
  width: min(560px, 100%);
  overflow: hidden;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 25px 80px rgb(15 23 42 / 30%);
}

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
}

.modal-header {
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.modal-footer {
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-body {
  padding: 22px;
}
</style>
