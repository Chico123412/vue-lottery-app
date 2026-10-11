<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EditParticipantForm from "@/components/lottery/EditParticipantForm.vue";
import ParticipantsTable from "@/components/lottery/ParticipantsTable.vue";
import RegistrationForm from "@/components/lottery/RegistrationForm.vue";
import WinnersList from "@/components/lottery/WinnersList.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import type {
  Participant,
  ParticipantDraft,
  SortDirection,
  SortField,
} from "@/types/participant";

const storageKey = "vue-lottery-participants";

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const participant = value as Record<string, unknown>;

  return (
    typeof participant.id === "string" &&
    typeof participant.name === "string" &&
    typeof participant.birthDate === "string" &&
    typeof participant.email === "string" &&
    typeof participant.phone === "string"
  );
}

function loadParticipants(): Participant[] {
  try {
    const savedParticipants = localStorage.getItem(storageKey);

    if (!savedParticipants) {
      return [];
    }

    const parsedData: unknown = JSON.parse(savedParticipants);

    if (!Array.isArray(parsedData)) {
      return [];
    }

    return parsedData.filter(isParticipant);
  } catch {
    return [];
  }
}

const participants = ref<Participant[]>(loadParticipants());

const winners = ref<Participant[]>([]);
const searchValue = ref("");
const sortField = ref<SortField | null>(null);
const sortDirection = ref<SortDirection>("asc");

const editingParticipant = ref<Participant | null>(null);
const deletingParticipant = ref<Participant | null>(null);

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

watch(
  participants,
  (newParticipants) => {
    localStorage.setItem(storageKey, JSON.stringify(newParticipants));
  },
  {
    deep: true,
  },
);

const visibleParticipants = computed(() => {
  const normalizedSearch = searchValue.value.trim().toLocaleLowerCase("uk-UA");

  let result = participants.value.filter((participant) =>
    participant.name.toLocaleLowerCase("uk-UA").includes(normalizedSearch),
  );

  if (!sortField.value) {
    return result;
  }

  result = [...result].sort((first, second) => {
    let comparison = 0;

    if (sortField.value === "name") {
      comparison = first.name.localeCompare(second.name, "uk-UA");
    }

    if (sortField.value === "birthDate") {
      comparison = first.birthDate.localeCompare(second.birthDate);
    }

    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  return result;
});

function addParticipant(participantDraft: ParticipantDraft): void {
  const participant: Participant = {
    id: crypto.randomUUID(),
    ...participantDraft,
  };

  participants.value.push(participant);
}

function selectRandomWinner(): void {
  if (winners.value.length >= 3) {
    return;
  }

  const winnerIds = new Set(winners.value.map((winner) => winner.id));

  const availableParticipants = participants.value.filter(
    (participant) => !winnerIds.has(participant.id),
  );

  if (availableParticipants.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableParticipants.length);

  const selectedWinner = availableParticipants[randomIndex];

  if (selectedWinner) {
    winners.value.push(selectedWinner);
  }
}

function removeWinner(participantId: string): void {
  winners.value = winners.value.filter((winner) => winner.id !== participantId);
}

function changeSorting(field: SortField): void {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";

    return;
  }

  sortField.value = field;
  sortDirection.value = "asc";
}

function filterByName(value: string): void {
  searchValue.value = value;
}

function openEditModal(participant: Participant): void {
  editingParticipant.value = participant;
  isEditModalOpen.value = true;
}

function closeEditModal(): void {
  isEditModalOpen.value = false;
  editingParticipant.value = null;
}

function updateParticipant(updatedParticipant: Participant): void {
  const participantIndex = participants.value.findIndex(
    (participant) => participant.id === updatedParticipant.id,
  );

  if (participantIndex !== -1) {
    participants.value[participantIndex] = updatedParticipant;
  }

  const winnerIndex = winners.value.findIndex(
    (winner) => winner.id === updatedParticipant.id,
  );

  if (winnerIndex !== -1) {
    winners.value[winnerIndex] = updatedParticipant;
  }

  closeEditModal();
}

function openDeleteModal(participant: Participant): void {
  deletingParticipant.value = participant;
  isDeleteModalOpen.value = true;
}

function closeDeleteModal(): void {
  isDeleteModalOpen.value = false;
  deletingParticipant.value = null;
}

function confirmDelete(): void {
  if (!deletingParticipant.value) {
    return;
  }

  const participantId = deletingParticipant.value.id;

  participants.value = participants.value.filter(
    (participant) => participant.id !== participantId,
  );

  winners.value = winners.value.filter((winner) => winner.id !== participantId);

  closeDeleteModal();
}
</script>

<template>
  <main class="lottery-page">
    <header class="page-header">
      <h1>Vue Lottery</h1>

      <p>Реєструйте учасників та обирайте випадкових переможців.</p>
    </header>

    <WinnersList
      :participants="participants"
      :winners="winners"
      @select-winner="selectRandomWinner"
      @remove-winner="removeWinner"
    />

    <RegistrationForm
      :participants="participants"
      @add-participant="addParticipant"
    />

    <ParticipantsTable
      :participants="visibleParticipants"
      :sort-field="sortField"
      :sort-direction="sortDirection"
      @sort="changeSorting"
      @filter-by-name="filterByName"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <BaseModal
      v-model="isEditModalOpen"
      title="Редагування учасника"
      @close="editingParticipant = null"
    >
      <EditParticipantForm
        v-if="editingParticipant"
        :participant="editingParticipant"
        :participants="participants"
        @update="updateParticipant"
        @cancel="closeEditModal"
      />
    </BaseModal>

    <BaseModal
      v-model="isDeleteModalOpen"
      title="Видалення учасника"
      @close="deletingParticipant = null"
    >
      <p v-if="deletingParticipant">
        Ви дійсно бажаєте видалити учасника
        <strong>
          {{ deletingParticipant.name }} </strong
        >,
        <strong>
          {{ deletingParticipant.email }} </strong
        >?
      </p>

      <template #footer>
        <BaseButton variant="secondary" @click="closeDeleteModal">
          Ні
        </BaseButton>

        <BaseButton variant="danger" @click="confirmDelete"> Так </BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
