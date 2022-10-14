import { VueLoaderPlugin } from 'vue-loader';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { resolve } from './util.js';

export default {
  context: resolve(),
  entry: {
    index: './src/index.ts',
    'styles/main': './src/styles/main.scss',
    'styles/font': './src/styles/font.scss',
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
          from: resolve('src/styles'),
          to: resolve('dist/scss'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.vue', '.js', '.ts'],
    modules: ['./node_modules'],
    alias: {
      '@': resolve('src/'),
    },
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: resolve('.cache/webpack'),
  },
};
