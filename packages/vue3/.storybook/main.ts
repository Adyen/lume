import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  addons: [
    { name: '@storybook/addon-essentials', options: { docs: false } },
    '@storybook/addon-a11y',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: '@storybook/vue3-vite',
  stories: [
    '../../lib/src/components/charts/**/*.stories.@(ts)',
    '../../lib/src/components/core/**/*.stories.@(ts)',
    '../../lib/src/playground/**/*.stories.@(ts)',
  ],
};

export default config;
