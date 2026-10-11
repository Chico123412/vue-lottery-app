<script setup lang="ts">
interface Props {
  hasRows: boolean;
  emptyMessage?: string;
}

withDefaults(defineProps<Props>(), {
  emptyMessage: "Дані відсутні",
});
</script>

<template>
  <div>
    <div v-if="hasRows" class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <slot name="header" />
          </tr>
        </thead>

        <tbody>
          <slot />
        </tbody>
      </table>
    </div>

    <p v-else class="empty-message">
      {{ emptyMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.table {
  margin-bottom: 0;

  th {
    white-space: nowrap;
    color: #475569;
    font-size: 0.875rem;
  }

  td {
    vertical-align: middle;
  }
}
</style>
