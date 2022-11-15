import { mergeConfig } from 'vite';
import path from 'path';
import { StorybookViteConfig } from '@storybook/builder-vite';

const config: StorybookViteConfig = {
  core: {
    builder: '@storybook/builder-vite',
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false },
    },
    {
      name: '@storybook/addon-storysource',
      options: { rule: { test: /\.stories\.ts$/ } },
    },
    '@storybook/addon-a11y',
    'storybook-addon-designs',
  ],
  framework: '@storybook/vue',
  stories: [
    '../src/components/charts/**/*.stories.@(ts)',
    '../src/components/core/**/*.stories.@(ts)',
    '../src/playground/**/*.stories.@(ts)',
  ],
  staticDirs: ['./static'],
  viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.join(__dirname, 'src/'),
        },
      },
    });
  },
};

export default config;
