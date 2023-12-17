import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/arya-green/theme.css";
import Tooltip from "primevue/tooltip";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(PrimeVue);
app.directive("tooltip", Tooltip);
app.mount("#app");
