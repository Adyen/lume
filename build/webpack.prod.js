import { merge } from 'webpack-merge';

import { resolve } from './util.js';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',

  output: {
    clean: true,
    filename: '[name].js',
    library: { type: 'module' },
    module: true,
    path: resolve('dist'),
  },
  experiments: { outputModule: true },
  externals: {
    '@popperjs/core': '@popperjs/core',
    'd3-array': 'd3-array',
    'd3-format': 'd3-format',
    'd3-sankey': 'd3-sankey',
    'd3-scale': 'd3-scale',
    'd3-shape': 'd3-shape',
    vue: 'vue',
  },
  externalsType: 'module',

  optimization: {
    nodeEnv: false, // Prevent resolving NODE_ENV to string during build
    // runtimeChunk: 'single', // this one causes the build to fail
    // splitChunks: {
    //   chunks: 'async',
    //   cacheGroups: {
    //     defaultVendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10,
    //       reuseExistingChunk: true,
    //     },
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
  },
});
