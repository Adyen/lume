import Vue from 'vue';
import App from './components/app.vue';
import '@/styles/main.scss';

const vueApp = new Vue({
    el: document.getElementById('app'),
    render: h => h(App)
});
