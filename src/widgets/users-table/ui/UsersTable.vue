<script setup lang="ts">
import Column from "primevue/column";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { AppTable } from "@/shared/ui";
import type { User } from "@/entities/user";
const props = defineProps<{ users: User[] }>(),
  emit = defineEmits<{ remove: [id: number] }>(),
  confirm = useConfirm(),
  toast = useToast();
function remove(user: User) {
  confirm.require({
    message: `Видалити ${user.firstName} ${user.lastName}?`,
    header: "Підтвердження",
    acceptLabel: "Видалити",
    rejectLabel: "Скасувати",
    accept: () => {
      emit("remove", user.id);
      toast.add({
        severity: "success",
        summary: "Користувача видалено",
        life: 2500,
      });
    },
  });
}
</script>
<template>
  <AppTable :value="props.users"
    ><Column header="Користувач"
      ><template #body="{ data }"
        ><div class="person">
          <img :src="data.image" alt="" /><span
            ><b>{{ data.firstName }} {{ data.lastName }}</b
            ><small>{{ data.email }}</small></span
          >
        </div></template
      ></Column
    ><Column field="username" header="Username" /><Column
      field="phone"
      header="Телефон"
    /><Column header="Дії"
      ><template #body="{ data }"
        ><div class="actions">
          <RouterLink :to="`/users/${data.id}`">Відкрити</RouterLink
          ><button @click="remove(data)">Видалити</button>
        </div></template
      ></Column
    ></AppTable
  >
</template>
