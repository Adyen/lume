/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  define: {
    __VUE_VERSION__: 3,
  },
  test: {
    globals: true,
    threads: false,
    include: ['../lib/src/**/*.spec.{js,ts}'],
    setupFiles: ['../lib/test/config/setupTests.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: `./test/coverage`,
      include: [`${resolve(__dirname, '../lib/src')}/**/*.{ts,vue}`],
      allowExternal: true,
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, '../lib/src') },
      { find: '@test', replacement: resolve(__dirname, '../lib/test') },
      {
        find: '@vue/test-utils',
        replacement: resolve(__dirname, 'node_modules/@vue/test-utils'),
      },
    ],
  },
  plugins: [vue()],
});
