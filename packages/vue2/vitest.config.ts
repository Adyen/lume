import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  test: {
    globals: true,
    threads: false,
    // root: '../lib/src',
    include: ['../lib/src/**/*.spec.{js,ts}'],
    setupFiles: ['../lib/test/config/setupTests.ts'], // relative to `root` (src)
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reportsDirectory: `./test/coverage`,
      statements: 80,
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, '../lib/src') },
      { find: '@test', replacement: resolve(__dirname, '../lib/test') },
      {
        find: 'vue',
        replacement: resolve(__dirname, 'node_modules/vue'),
      },
      {
        find: '@vue/test-utils',
        replacement: resolve(__dirname, 'node_modules/@vue/test-utils'),
      },
      // { find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' },
    ],
  },
  plugins: [vue()],
});
