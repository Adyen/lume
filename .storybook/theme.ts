import { create } from '@storybook/theming';

export default create({
  base: 'light',
  brandTitle: 'Data visualization Storybook',
  brandImage: './adyen-storybook.svg',

  // Storybook-specific color palette
  colorPrimary: '#0abf53',
  colorSecondary: '#06f',

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
  barSelectedColor: '#06f',
  barBg: '#fff',

  // Form colors
  inputBg: '#fff',
  inputBorder: '#e3e6eb',
  inputTextColor: '#00112c',
  inputBorderRadius: 4,
});
