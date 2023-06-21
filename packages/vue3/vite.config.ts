import { join } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vue from '@vitejs/plugin-vue';
import createExternal from 'vite-plugin-external';

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
    createExternal({
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    }),
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: '../lib/src/styles/',
          dest: './',
          rename: 'scss',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': join(__dirname, '../../node_modules/@adyen/lume-core/src'),
    },
  },
});
