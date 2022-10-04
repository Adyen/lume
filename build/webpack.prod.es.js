/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');

module.exports = merge(prod, {
  output: {
    clean: true,
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    filename: ({ chunk: { name } }) => {
      return name.startsWith('charts/') ? '[name].js' : '[name].esm.js';
    },
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
