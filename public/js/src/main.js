import Vue from 'vue';
import App from './components/app.vue';

const vueApp = new Vue({
    el: document.getElementById('app'),
    render: h => h(App)
});
