import { resolve } from 'path';
import type { StorybookConfig } from '@storybook/vue-vite';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    './remark-gfm-addon.ts',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: '@storybook/vue-vite',
  stories: [
    '../../lib/src/components/charts/**/*.@(stories|docs).@(ts|mdx)',
    '../../lib/src/components/core/**/*.@(stories|docs).@(ts|mdx)',
    '../../lib/src/components/groups/**/*.@(stories|docs).@(ts|mdx)',
    '../../lib/src/playground/**/*.stories.@(ts)',
  ],
  viteFinal(viteConfig) {
    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...viteConfig.resolve?.alias,
          '@storybook/blocks': resolve(
            __dirname,
            '../node_modules/@storybook/blocks'
          ),
          vue: resolve(__dirname, '../node_modules/vue/dist/vue.esm.js'),
        },
      },
    };
  },
};

export default config;
