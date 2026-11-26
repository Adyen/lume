import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    define: {
        __VUE_VERSION__: 3,
    },
    test: {
        globals: true,
        include: ['../lib/src/**/*.spec.{js,ts}'],
        setupFiles: ['../lib/test/config/setupTests.ts'],
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reportsDirectory: `./test/coverage`,
            include: [`${resolve(import.meta.dirname, '../lib/src')}/**/*.{ts,vue}`],
            exclude: [
                ...coverageConfigDefaults.exclude,
                '**/*.spec.{js,ts}',
                '**/*.stories.{js,ts}',
                '**/docs/**',
                '**/playground/**',
                '**/next/**',
            ],
            allowExternal: true,
        },
    },
    resolve: {
        alias: [
            { find: '@', replacement: resolve(import.meta.dirname, '../lib/src') },
            { find: '@test', replacement: resolve(import.meta.dirname, '../lib/test') },
            {
                find: '@vue/test-utils',
                replacement: resolve(import.meta.dirname, 'node_modules/@vue/test-utils'),
            },
        ],
    },
    plugins: [vue()],
});
