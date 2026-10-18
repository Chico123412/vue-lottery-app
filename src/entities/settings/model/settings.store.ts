import { ref, watch } from "vue";
import { defineStore } from "pinia";
export const useSettingsStore = defineStore(
  "settings",
  () => {
    const theme = ref<"light" | "dark">("light");
    function toggleTheme() {
      theme.value = theme.value === "light" ? "dark" : "light";
    }
    watch(theme, (v) => (document.documentElement.dataset.theme = v), {
      immediate: true,
    });
    return { theme, toggleTheme };
  },
  { persist: true },
);
