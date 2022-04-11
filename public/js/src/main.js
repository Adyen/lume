import Vue from 'vue';
import App from './components/app.vue';
import '@adyen/adl/scss/adl.scss';

const vueApp = new Vue({
    el: document.getElementById('app'),
    render: h => h(App)
});
