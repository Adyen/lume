const path = require('path');

module.exports = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: /\.stories\.ts$/,
        },
      },
    },
  ],
  framework: '@storybook/vue',
  stories: [
    '../src/charts/**/*.stories.@(ts)',
    '../src/core/**/*.stories.@(ts)',
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
