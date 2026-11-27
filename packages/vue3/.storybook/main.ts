import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    './remark-gfm-addon.ts',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: '@storybook/vue3-vite',
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
          '@storybook/addon-actions': resolve(
            import.meta.dirname,
            '../node_modules/storybook/dist/actions'
          ),
          '@storybook/blocks': resolve(
            import.meta.dirname,
            '../node_modules/@storybook/addon-docs/dist/blocks'
          ),
        },
      },
    };
  },
};

export default config;
