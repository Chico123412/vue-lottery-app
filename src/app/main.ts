import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
import { setupUi } from "./providers/ui";
import { registerServices } from "./providers/services";
import { useSessionStore } from "@/entities/session";
import "./styles/main.scss";
import "primeicons/primeicons.css";
registerServices();
const app = createApp(App),
  pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
setupUi(app);
useSessionStore().initialize();
app.mount("#app");
