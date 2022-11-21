import { defineConfig } from 'vitest/config';
import path from 'path';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  test: {
    globals: true,
    threads: false,
    root: 'src',
    setupFiles: ['./test/config/setupTests.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reportsDirectory: `./test/coverage`,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                  @import "${path.resolve(
    __dirname,
    './src/styles/variables'
  )}";
              `,
      },
    },
  },
  plugins: [vue()],
});
