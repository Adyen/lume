module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  plugins: ['vue'],
  rules: {
    'vue/multi-word-component-names': 'off'
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  env: {
    es6: true
  }
}