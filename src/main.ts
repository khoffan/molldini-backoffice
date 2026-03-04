import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase/firebase_conf";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router)
app.use(createPinia())

app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
    ]
})

app.mount("#app")
