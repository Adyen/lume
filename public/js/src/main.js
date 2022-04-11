import Vue from 'vue';
// import App from './components/app.vue';
import App from '../../../src/box-plot/box-plot.vue'

const vueApp = new Vue({
    el: document.getElementById('app'),
    render: h => h(App)
});
