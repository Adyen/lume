/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');

module.exports = merge(prod, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'lume.esm.js',
    library: {
      type: 'module',
    },
    module: true,
  },
  experiments: {
    outputModule: true,
  },
  externals: { vue: 'vue' },
  externalsType: 'module',
});
