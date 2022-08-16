import VueCompositionApi from '@vue/composition-api'
import Vue from 'vue';

Vue.use(VueCompositionApi);

// Jest cannot find these functionalities natively, so we pad them in as best we need to
global.ResizeObserver = require('resize-observer-polyfill');
global.structuredClone = object => JSON.parse(JSON.stringify(object));

export {}