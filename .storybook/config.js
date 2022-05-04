/**
  NOTE: This file in this directory has to exist, otherwise the build process errs. In bare-bones setup, it can be empty though.
*/
import Vue from 'vue';
import { addDecorator, addParameters, configure } from '@storybook/vue';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import brandImage from './static/adyen-storybook.svg';

if (process.env.NODE_ENV === 'development') {
  Vue.config.performance = true;
  Vue.config.productionTip = false;
}

addParameters({
  options: {
    sidebarAnimations: true,
    enableShortcuts: true,
    theme: {
      base: 'light',
      brandTitle: 'Data visualization Storybook',
      brandImage,

      // Storybook-specific color palette
      colorPrimary: '#0abf53',
      colorSecondary: '#06f',

      // UI
      appBg: '#f3f6f9',
      appContentBg: '#fff',
      appBorderColor: '#e3e6eb',
      appBorderRadius: 4,

      // Text colors
      textColor: '#00112c',
      textInverseColor: '#fff',

      // Toolbar default and active colors
      barTextColor: '#00112c',
      barSelectedColor: '#06f',
      barBg: '#fff',

      // Form colors
      inputBg: '#fff',
      inputBorder: '#e3e6eb',
      inputTextColor: '#00112c',
      inputBorderRadius: 4,
    },
  },
});

addDecorator(Story => ({
  components: { Story },
  template: '<div class="storybook-wrapper"><story /></div>',
}));

// Addons
addDecorator(withKnobs({ escapeHTML: false }));
addDecorator(withA11y);

const loadStories = storiesReq => storiesReq.keys().forEach(filename => storiesReq(filename));

configure(() => {
  loadStories(require.context('../src', true, /\.stories\.js$/));
}, module);