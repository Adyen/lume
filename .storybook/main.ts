const path = require('path');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { docs: false },
    },
    {
      name: '@storybook/addon-storysource',
      options: { rule: { test: /\.stories\.ts$/ } },
    },
    '@storybook/addon-a11y',
    'storybook-addon-designs',
  ],
  framework: '@storybook/vue',
  stories: [
    '../src/components/charts/**/*.stories.@(ts)',
    '../src/components/core/**/*.stories.@(ts)',
    '../src/playground/**/*.stories.@(ts)',
  ],
  staticDirs: ['./static'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.s[ac]ss|\.css$/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader'],
    });

    config.resolve.alias['@'] = path.resolve(__dirname, '../src/');

    return config;
  },
};
