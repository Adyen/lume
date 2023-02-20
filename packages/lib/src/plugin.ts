import { PluginFunction, PluginObject } from 'vue';

import * as components from './components';

interface LumePluginFunction extends PluginFunction<null> {
  installed?: boolean;
}

const install: LumePluginFunction = (Vue) => {
  if (install.installed) return;
  install.installed = true;

  // Register components
  for (const prop in components) {
    if (Object.prototype.hasOwnProperty.call(components, prop)) {
      const component = components[prop];
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

export default plugin;
