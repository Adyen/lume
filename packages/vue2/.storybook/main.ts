import type { StorybookConfig } from '@storybook/vue-vite';

const config: StorybookConfig = {
  addons: [
    { name: '@storybook/addon-essentials', options: { docs: false } },
    '@storybook/addon-a11y',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: '@storybook/vue-vite',
  stories: [
    '../../lib/src/components/charts/**/*.stories.@(ts)',
    '../../lib/src/components/core/**/*.stories.@(ts)',
    '../../lib/src/playground/**/*.stories.@(ts)',
  ],
};

export default config;
