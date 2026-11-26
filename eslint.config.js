import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import tsParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginYml from 'eslint-plugin-yml';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueEslintParser from 'vue-eslint-parser';

export default tseslint.config([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    ...pluginVue.configs['flat/vue2-recommended'],
    eslintConfigPrettier,

    {
        files: ['**/*.{js,mjs,cjs,mts,ts,vue,tsx}'],
        plugins: {
            '@stylistic/js': stylisticJs,
            unicorn: eslintPluginUnicorn,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                parser: tsParser,
                ecmaFeatures: { jsx: true },
                extraFileExtensions: ['.vue'],
            },
            globals: {
                ...globals.es2021,
                ...globals.node,
                ...globals.browser,
                __VUE_VERSION__: 'readonly',
            },
        },
        rules: {
            ...eslint.configs.recommended.rules,

            // Style rules aligned with Bento
            curly: ['error', 'all'],
            '@stylistic/js/brace-style': 'error',
            '@stylistic/js/arrow-parens': ['error', 'as-needed'],

            // Global rules aligned with Bento
            'no-console': 'error',
            'no-nested-ternary': 'error',
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['vue'],
                            importNames: ['defineProps', 'defineEmits'],
                            message:
                                "'defineProps' and 'defineEmits' can be used within <script setup> without importing.",
                        },
                    ],
                },
            ],
            'no-param-reassign': [
                'error',
                {
                    props: true,
                    ignorePropertyModificationsFor: ['acc', 'e', 'req', 'request', 'res', 'response', 'state'],
                },
            ],
            'sort-imports': [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
                    allowSeparatedGroups: false,
                },
            ],

            // TypeScript rules aligned with Bento
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    ignoreRestSiblings: true,
                    vars: 'local',
                },
            ],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-var-requires': 'error',
            // Allow Vite define constant __VUE_VERSION__
            'no-underscore-dangle': ['error', { allow: ['__VUE_VERSION__'] }],
            '@typescript-eslint/no-empty-function': 'error',
            'consistent-return': 'error',
            eqeqeq: ['error', 'smart'],
            'no-redeclare': 'off',
            'vue/component-definition-name-casing': ['error', 'kebab-case'],
            '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
            '@typescript-eslint/array-type': ['error', { default: 'generic' }],
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            'unicorn/prefer-module': 'error',
        },
    },

    // Vue SFCs
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueEslintParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            'vue/component-name-in-template-casing': ['error', 'kebab-case'],
            'vue/no-deprecated-slot-attribute': 'error',
            'vue/no-deprecated-slot-scope-attribute': 'error',
            'vue/no-unsupported-features': ['error', { version: '^2.7.8', ignores: ['script-setup'] }],
            'vue/multi-word-component-names': 'off',
            'vue/first-attribute-linebreak': 'off',
            'vue/order-in-components': [
                'error',
                {
                    order: [
                        'el',
                        'name',
                        'parent',
                        'functional',
                        ['delimiters', 'comments'],
                        'components',
                        'directives',
                        'filters',
                        'extends',
                        'mixins',
                        'inheritAttrs',
                        'model',
                        ['props', 'propsData'],
                        'inject',
                        'fetch',
                        'asyncData',
                        'data',
                        'computed',
                        'provide',
                        'watch',
                        'LIFECYCLE_HOOKS',
                        'methods',
                        'head',
                        ['template', 'render'],
                        'renderError',
                    ],
                },
            ],
            'vue/no-deprecated-dollar-scopedslots-api': 'off',
            'vue/no-v-for-template-key-on-child': 'off',
            'vue/no-deprecated-v-bind-sync': 'error',
        },
    },

    // YAML
    {
        ...eslintPluginYml.configs['flat/recommended'][0],
        ...eslintPluginYml.configs['flat/recommended'][1],
        files: ['**/*.yaml', '**/*.yml'],
        ignores: ['.github/**/*', 'pnpm-lock.yaml'],
        rules: {
            'yml/sort-keys': ['error', { pathPattern: '.*', order: { type: 'asc', natural: true } }],
            'yml/sort-sequence-values': ['error', { pathPattern: '.*', order: { type: 'asc' } }],
        },
    },

    // Build CLI scripts
    {
        files: ['build/**/*.js'],
        rules: {
            'no-console': 'off',
        },
    },

    // Vitest
    {
        files: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**/*.ts'],
        plugins: {
            ...vitest.configs.recommended.plugins,
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
                __dirname: true,
                process: true,
            },
        },
        rules: {
            ...vitest.configs.recommended.rules,
            'id-denylist': ['error', 'propsData'],
            'vitest/expect-expect': 'off',
            'vitest/no-focused-tests': 'error',
        },
    },

    globalIgnores([
        '**/.cache/',
        '**/coverage/',
        '**/dist/',
        '**/node_modules/',
        '**/node-compile-cache/',
        '**/@types/',
        'storybook/',
        'pnpm-lock.yaml',
        '.prettierignore',
        '*.md',
        '*.mdx',
        '*.json',
        '*.css',
        '*.scss',
        'stylelint*',
        '*.png',
    ]),
]);
