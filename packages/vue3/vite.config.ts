import { join } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
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
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/@adyen/lume-core/src/styles/',
          dest: './',
          rename: 'scss',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': join(__dirname, './node_modules/@adyen/lume-core/src'),
    },
  },
});
