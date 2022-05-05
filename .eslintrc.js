// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  plugins: ['vue'],
  rules: {
    'indent': ['warn', 2],
    'vue/multi-word-component-names': 'off',
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  env: {
    es6: true
  }
}