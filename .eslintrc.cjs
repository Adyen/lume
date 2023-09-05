// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    indent: ['warn', 2],
    'object-curly-spacing': ['warn', 'always'],
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'off', // ESLint thinks `tspan` tag is a custom componenent, so disabling this until we find a way to fix that.
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
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
  },
  env: {
    es6: true,
  },
  globals: {
    __VUE_VERSION__: 'readonly',
  },
};
