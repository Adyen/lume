export default {
  trailingComma: 'es5',
  useTabs: false,
  tabWidth: 4,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  printWidth: 120,
  arrowParens: 'avoid',
  proseWrap: 'always',
  htmlWhitespaceSensitivity: 'strict',
  vueIndentScriptAndStyle: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: ['**/*.yaml', '**/*.yml'],
      options: {
        tabWidth: 2,
        parser: 'yaml',
        proseWrap: 'preserve',
        singleQuote: false,
      },
    },
    {
      files: ['.prettierrc.mjs'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
