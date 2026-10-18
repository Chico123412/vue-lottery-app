<script setup lang="ts">
import DataTable from "primevue/datatable";
defineProps<{ value: unknown[] }>();
</script>
<template>
  <div class="table-wrap">
    <DataTable :value="value"><slot /></DataTable>
  </div>
</template>
