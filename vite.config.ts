import { join } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
      // output: {
      //   format: 'es',
      //   chunkFileNames: 'common/[name].[hash].js',
      //   entryFileNames: '[name].js',
      // },
    },
  },
  publicDir: 'src/assets',
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: './src/styles/',
          dest: './',
          rename: 'scss',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': join(__dirname, 'src/'),
    },
  },
});
