import { PluginFunction, PluginObject } from 'vue';

import * as charts from './charts';
import * as core from './core';
import * as groups from './groups';

import './styles/main.scss';

interface AdvPluginFunction extends PluginFunction<null> {
  installed?: boolean;
}

const install: AdvPluginFunction = (Vue) => {
  if (install.installed) return;
  install.installed = true;

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

  // Register groups
  for (const prop in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, prop)) {
      const component = groups[prop];
      Vue.component(prop, component);
    }
  }
};

const plugin: PluginObject<null> = { install };

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export * from './charts';
export * from './core';
export * from './groups';

export default plugin;
