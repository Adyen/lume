// eslint-disable-next-line
const path = require('path');
// eslint-disable-next-line
const istanbulConfig = require('./istanbul.config');

// eslint-disable-next-line no-undef
module.exports = async () => ({
  verbose: true,
  preset: 'ts-jest',
  // eslint-disable-next-line no-undef
  rootDir: path.resolve(__dirname, '..', '..'),
  roots: ['<rootDir>/test/unit/specs/'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: [
    'js',
    'json',
    // tell Jest to handle `*.vue` files
    'vue',
    'ts',
  ],
  transformIgnorePatterns: [
    // By default Jest ignore everything inside node_modules
    // Here we override that to keep ignoring stuff inside node_modules,
    // except Vue SFCs and assets
    'node_modules/\\.+?(?<!\\.(vue|svg|png|gif|jpe?g))$',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/config/setupTests.ts'],
  transform: {
    // process `*.js` files with `babel-jest`
    // ".*\\.(js)$": "babel-jest",
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': '@vue/vue2-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      statements: 80,
    },
  },
  ...istanbulConfig,
});
