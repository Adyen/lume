/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function convertDirToEntryPoints(dir) {
  return fs
    .readdirSync(path.resolve(__dirname, '../src/components/' + dir))
    .reduce((acc, name) => {
      if (name.startsWith('lume-')) {
        acc[`${dir}/${name}`] = `./src/components/${dir}/${name}`;
      }
      return acc;
    }, {});
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    index: './src/index.ts',
    'styles/main': './src/styles/main.scss',
    'styles/font': './src/styles/font.scss',
    ...convertDirToEntryPoints('charts'),
    ...convertDirToEntryPoints('core'),
    ...convertDirToEntryPoints('groups'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: { appendTsSuffixTo: [/\.vue$/] },
          },
        ],
        exclude: [/node_modules/, /test/],
      },
      {
        test: /\.vue\.(s?[ac]ss)$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /(?<!\.vue)\.(s?[ac]ss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/styles'),
          to: path.resolve(__dirname, '../dist/scss'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.vue', '.js', '.ts'],
    modules: ['./node_modules'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '../.cache/webpack'),
  },
};
