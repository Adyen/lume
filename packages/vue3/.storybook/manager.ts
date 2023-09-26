import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

import themeObject from 'storybook-utils/theme';
import brandImage from 'storybook-utils/assets/logo.svg';

const theme = create({
  ...themeObject,
  brandImage,
});

addons.setConfig({
  enableShortcuts: true,
  theme,
});
