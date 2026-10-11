<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import WinnerCard from "@/components/lottery/WinnerCard.vue";
import type { Participant } from "@/types/participant";

interface Props {
  participants: Participant[];
  winners: Participant[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "select-winner": [];
  "remove-winner": [participantId: string];
}>();

const availableParticipantsCount = computed(() => {
  const winnerIds = new Set(props.winners.map((winner) => winner.id));

  return props.participants.filter(
    (participant) => !winnerIds.has(participant.id),
  ).length;
});

const winnerButtonDisabled = computed(() => {
  return (
    props.participants.length === 0 ||
    props.winners.length >= 3 ||
    availableParticipantsCount.value === 0
  );
});

const buttonHint = computed(() => {
  if (props.participants.length === 0) {
    return "Спочатку додайте учасників";
  }

  if (props.winners.length >= 3) {
    return "Уже обрано максимальну кількість переможців";
  }

  if (availableParticipantsCount.value === 0) {
    return "Усі учасники вже стали переможцями";
  }

  return "Обрати випадкового переможця";
});
</script>

<template>
  <section class="lottery-panel">
    <div class="winners-header">
      <div>
        <h2 class="panel-title mb-1">Переможці</h2>

        <p class="text-secondary mb-0">Обрано {{ winners.length }} із 3</p>
      </div>

      <BaseButton
        :disabled="winnerButtonDisabled"
        :title="buttonHint"
        @click="emit('select-winner')"
      >
        Новий переможець
      </BaseButton>
    </div>

    <div v-if="winners.length > 0" class="winners-grid">
      <WinnerCard
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="emit('remove-winner', $event)"
      />
    </div>

    <p v-else class="empty-message">Переможців поки немає</p>
  </section>
</template>

<style scoped lang="scss">
.winners-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.winners-grid {
  display: grid;
  gap: 12px;
}

@media (max-width: 600px) {
  .winners-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
