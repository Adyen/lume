import { PluginObject } from 'vue';

import charts from './charts';
import core from './core';

import './styles/main.scss';

const plugin: PluginObject<null> = {
  install(Vue) {
    // Register charts
    for (const prop in charts) {
      if (Object.prototype.hasOwnProperty.call(charts, prop)) {
        const component = charts[prop];
        Vue.component(prop, component);
      }
    }

    // Register core
    for (const prop in core) {
      if (Object.prototype.hasOwnProperty.call(core, prop)) {
        const component = core[prop];
        Vue.component(prop, component);
      }
    }
  },
};

export default plugin;
