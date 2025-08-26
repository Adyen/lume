import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueEslintParser from 'vue-eslint-parser';

import globals from 'globals';

export default [
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsParser, // For <script lang="ts">
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        __VUE_VERSION__: 'readonly',
      },
    },
  },
  {
    rules: {
      indent: ['warn', 2],
      'object-curly-spacing': ['warn', 'always'],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
          allowSeparatedGroups: true,
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        __VUE_VERSION__: 'readonly',
      },
    },
  },
];
