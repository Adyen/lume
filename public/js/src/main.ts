import Vue from 'vue';
import VueCompositionAPI, { createApp } from '@vue/composition-api';

import App from './components/app.vue';
import '@/styles/main.scss';

Vue.use(VueCompositionAPI);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vueApp = createApp(App);
vueApp.mount('#root');
