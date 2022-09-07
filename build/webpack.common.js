/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: './src/index.ts',
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
        exclude: /src\/styles/,
      },
      {
        test: /(?<!\.vue)\.(s?[ac]ss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: /src\/styles/,
      },
      {
        test: /\.(woff2?|ttf|otf|eot|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/fonts/',
            publicPath: 'assets/fonts/',
          },
        },
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new MiniCssExtractPlugin()],
  resolve: {
    extensions: ['.vue', '.js', '.ts'],
    modules: ['./node_modules'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
};
