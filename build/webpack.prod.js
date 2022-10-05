/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    nodeEnv: false, // Prevent resolving NODE_ENV to string during build
    mangleExports: 'size',
    moduleIds: 'deterministic',
    removeAvailableModules: true,
    removeEmptyChunks: true,
    // runtimeChunk: 'single', // this one causes the build to fail
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
