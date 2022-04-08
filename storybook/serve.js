const storybook = require('@storybook/vue/standalone');

storybook({
  mode: 'dev',
  port: 9009,
  configDir: './.storybook',
  staticDir: []
});
