import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  test: {
    globals: true,
    threads: false,
    root: 'src',
    include: ['**/*.spec.{js,ts}'],
    setupFiles: ['./test/config/setupTests.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reportsDirectory: `./test/coverage`,
      statements: 80,
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '@test', replacement: resolve(__dirname, './test') },
      { find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' },
    ],
  },
  plugins: [vue()],
});
