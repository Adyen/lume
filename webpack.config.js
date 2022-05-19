/* eslint-disable no-undef */
import { VueLoaderPlugin } from 'vue-loader';
console.log(__dirname + '/dist');

export const entry = './public/js/src/main.js';
export const output = {
  path: __dirname + '/public/js/dist',
  filename: 'build.js',
  publicPath: '/js/dist',
};
export const devServer = {
  contentBase: './public',
  hot: true,
  inline: true,
};
export const module = {
  rules: [
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.ts?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-optional-chaining',
        ],
      },
    },
    {
      test: /\.s[ac]ss|\.css$/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader'],
    },
    {
      test: /\.(woff2?|ttf|otf|eot|svg)$/,
      use: ['file-loader'],
    },
  ],
};
export const plugins = [new VueLoaderPlugin()];
export const resolve = {
  alias: {
    vue: __dirname + '/node_modules/vue/dist/vue.js',
    '@': __dirname + '/src/',
  },
};
