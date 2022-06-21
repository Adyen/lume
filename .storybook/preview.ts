import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

import '@/styles/main.scss';

if (process.env.NODE_ENV === 'development') {
  Vue.config.performance = true;
  Vue.config.productionTip = false;
}

Vue.use(VueCompositionAPI);

export const parameters = {
  passArgsFirst: false,
  controls: {
    hideNoControlsWarning: true,
    expanded: true, // show all documentation with control input
  },
};
