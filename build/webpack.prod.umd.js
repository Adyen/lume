/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');

module.exports = merge(prod, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'adv.umd.js',
    library: {
      name: 'ADV',
      type: 'umd',
      umdNamedDefine: true,
    },
    clean: true,
  },
  externals: {
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'Vue',
    },
  },
});
