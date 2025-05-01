import { globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  globalIgnores(['**/dist/']),
  {
    plugins: {
      vue: pluginVue,
    },
    languageOptions: {
      globals: {
        __VUE_VERSION__: 'readonly',
      },

      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        extraFileExtensions: ['.vue'],
      },
    },
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
  },
);

// import { defineConfig } from 'eslint/config';
// import pluginVue from 'eslint-plugin-vue';
// import typescriptEslint from '@typescript-eslint/eslint-plugin';
// import parser from 'vue-eslint-parser';

// export default defineConfig([
//   typescriptEslint.configs.recommended,
//   ...pluginVue.configs['flat/recommended'],
//   {
//     plugins: {
//       vue: pluginVue,
//       '@typescript-eslint': typescriptEslint,
//     },

//     languageOptions: {
//       globals: {
//         __VUE_VERSION__: 'readonly',
//       },

//       parser: parser,
//       ecmaVersion: 5,
//       sourceType: 'script',

//       parserOptions: {
//         parser: '@typescript-eslint/parser',
//         extraFileExtensions: ['.vue'],
//       },
//     },

//     rules: {
//       indent: ['warn', 2],
//       'object-curly-spacing': ['warn', 'always'],
//       'vue/multi-word-component-names': 'off',
//       'vue/no-v-text-v-html-on-component': 'off',

//       'sort-imports': [
//         'error',
//         {
//           ignoreCase: true,
//           ignoreDeclarationSort: true,
//           ignoreMemberSort: false,
//           memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
//           allowSeparatedGroups: true,
//         },
//       ],
//     },
//   },
// ]);
