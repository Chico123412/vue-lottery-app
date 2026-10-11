<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import SearchBar from "@/components/lottery/SearchBar.vue";
import type {
  Participant,
  SortDirection,
  SortField,
} from "@/types/participant";

interface Props {
  participants: Participant[];
  sortField: SortField | null;
  sortDirection: SortDirection;
}

defineProps<Props>();

const emit = defineEmits<{
  edit: [participant: Participant];
  delete: [participant: Participant];
  sort: [field: SortField];
  "filter-by-name": [searchValue: string];
}>();

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("uk-UA").format(new Date(`${date}T00:00:00`));
}

function sortIcon(
  field: SortField,
  activeField: SortField | null,
  direction: SortDirection,
): string {
  if (field !== activeField) {
    return "↕";
  }

  return direction === "asc" ? "↑" : "↓";
}
</script>

<template>
  <section class="lottery-panel">
    <div class="participants-header">
      <div>
        <h2 class="panel-title mb-1">Список учасників</h2>

        <p class="text-secondary mb-0">Знайдено: {{ participants.length }}</p>
      </div>

      <SearchBar @filter-by-name="emit('filter-by-name', $event)" />
    </div>

    <BaseTable
      :has-rows="participants.length > 0"
      empty-message="Учасників не знайдено"
    >
      <template #header>
        <th scope="col">№</th>

        <th scope="col">
          <button
            type="button"
            class="sort-button"
            @click="emit('sort', 'name')"
          >
            Ім’я
            <span aria-hidden="true">
              {{ sortIcon("name", sortField, sortDirection) }}
            </span>
          </button>
        </th>

        <th scope="col">
          <button
            type="button"
            class="sort-button"
            @click="emit('sort', 'birthDate')"
          >
            Дата народження
            <span aria-hidden="true">
              {{ sortIcon("birthDate", sortField, sortDirection) }}
            </span>
          </button>
        </th>

        <th scope="col">Email</th>

        <th scope="col">Телефон</th>

        <th scope="col">Дії</th>
      </template>

      <tr v-for="(participant, index) in participants" :key="participant.id">
        <td>{{ index + 1 }}</td>

        <td>
          <strong>{{ participant.name }}</strong>
        </td>

        <td>
          {{ formatDate(participant.birthDate) }}
        </td>

        <td>
          {{ participant.email }}
        </td>

        <td>
          {{ participant.phone }}
        </td>

        <td>
          <div class="action-buttons">
            <BaseButton variant="outline" @click="emit('edit', participant)">
              Редагувати
            </BaseButton>

            <BaseButton variant="danger" @click="emit('delete', participant)">
              Видалити
            </BaseButton>
          </div>
        </td>
      </tr>
    </BaseTable>
  </section>
</template>

<style scoped lang="scss">
.participants-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.sort-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: #0d6efd;
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 3px solid rgb(13 110 253 / 25%);
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;

  .btn {
    padding: 6px 10px;
    font-size: 0.875rem;
  }
}

@media (max-width: 750px) {
  .participants-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
