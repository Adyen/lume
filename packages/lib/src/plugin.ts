import { App, Plugin } from 'vue';

import * as components from './components';

type PluginFunction = (app: App) => any;

interface LumePluginFunction extends PluginFunction {
  installed?: boolean;
}

const install: LumePluginFunction = (app: App) => {
  if (install.installed) return;
  install.installed = true;

  // Register components
  for (const prop in components) {
    if (Object.prototype.hasOwnProperty.call(components, prop)) {
      const component = components[prop];
      app.component(prop, component);
    }
  }
};

const plugin: Plugin = { install };

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = (window as any).Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;
