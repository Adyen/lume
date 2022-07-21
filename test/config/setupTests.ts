import VueCompositionApi from '@vue/composition-api'
import Vue from 'vue';

Vue.use(VueCompositionApi);

global.ResizeObserver = require('resize-observer-polyfill');

export {}