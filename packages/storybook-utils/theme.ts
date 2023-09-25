import { create } from '@storybook/theming';

export default create({
  base: 'light',
  brandTitle: 'Lume Storybook',

  // Storybook-specific color palette
  colorPrimary: '#a9d6ff',
  colorSecondary: '#0066ff',

  // UI
  appBg: '#f3f6f9',
  appContentBg: '#fff',
  appBorderColor: '#e3e6eb',
  appBorderRadius: 4,

  // Text colors
  textColor: '#00112c',
  textInverseColor: '#fff',

  // Toolbar default and active colors
  barTextColor: '#00112c',
  barSelectedColor: '#0066ff',
  barBg: '#fff',

  // Form colors
  inputBg: '#fff',
  inputBorder: '#e3e6eb',
  inputTextColor: '#00112c',
  inputBorderRadius: 4,
});
