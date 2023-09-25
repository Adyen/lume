import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

import themeObject from 'storybook-utils/theme';

const theme = create({
  ...themeObject,
  brandImage: '../node_modules/storybook-utils/assets/logo.svg',
});

addons.setConfig({
  enableShortcuts: true,
  theme,
});
