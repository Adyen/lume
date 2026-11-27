import { join } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

import { lumeStylesPlugin } from '../lib/vite-styles-plugin';

const libSrcDir = join(__dirname, './node_modules/@adyen/lume-core/src');

export default defineConfig({
  define: {
    __VUE_VERSION__: 2,
  },
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        plugin: './src/plugin.ts',
      },
      formats: ['es'],
      name: 'Lume',
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['@popperjs/core', 'd3', 'd3-sankey', 'vue'],
      output: {
        chunkFileNames: 'common/[hash].js',
      },
    },
  },
  plugins: [vue(), lumeStylesPlugin(libSrcDir)],
  resolve: {
    alias: {
      '@': libSrcDir,
    },
  },
});
