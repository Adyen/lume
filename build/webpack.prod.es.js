/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');

module.exports = merge(prod, {
  output: {
    clean: true,
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].esm.js',
    library: {
      type: 'module',
    },
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  externals: {
    '@popperjs/core': '@popperjs/core',
    d3: 'd3',
    'd3-sankey': 'd3-sankey',
    vue: 'vue',
  },
  externalsType: 'module',
});
