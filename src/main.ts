import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';

import './style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueQueryPlugin);
app.use(Toast);

app.mount('#app');
