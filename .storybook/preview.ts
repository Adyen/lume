import Vue, { Component } from 'vue';

import '@/styles/font.scss';
import '@/styles/main.scss';
import './preview-styles.scss';

if (process.env.NODE_ENV === 'development') {
  Vue.config.performance = true;
  Vue.config.productionTip = false;
}

export const parameters = {
  passArgsFirst: false,
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#f3f6f9',
      },
      {
        name: 'dark',
        value: '#20304c',
      },
    ],
  },
  controls: {
    hideNoControlsWarning: true,
    expanded: true, // show all documentation with control input
  },
};

export const decorators = [
  (Story: Component) => ({
    components: { Story },
    template: `
      <div class="preview">
        <div class="card">
          <story />
        </div>
      </div>
    `,
  }),
];
