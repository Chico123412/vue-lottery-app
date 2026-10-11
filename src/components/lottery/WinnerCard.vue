<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import type { Participant } from "@/types/participant";

interface Props {
  winner: Participant;
}

defineProps<Props>();

const emit = defineEmits<{
  remove: [participantId: string];
}>();
</script>

<template>
  <article class="winner-card">
    <div class="winner-icon" aria-hidden="true">🏆</div>

    <div class="winner-information">
      <strong>{{ winner.name }}</strong>
      <span>{{ winner.email }}</span>
      <span>{{ winner.phone }}</span>
    </div>

    <BaseButton variant="danger" @click="emit('remove', winner.id)">
      Видалити
    </BaseButton>
  </article>
</template>

<style scoped lang="scss">
.winner-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #fde68a;
  border-radius: 14px;
  background: linear-gradient(135deg, #fffbeb, #ffffff);
}

.winner-icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #fef3c7;
  font-size: 1.4rem;
}

.winner-information {
  display: grid;
  flex: 1;
  gap: 2px;

  span {
    color: #64748b;
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .winner-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
