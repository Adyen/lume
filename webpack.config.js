/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './public/js/src/main.ts',
  output: {
    path: __dirname + '/public/js/dist',
    filename: 'build.js',
    publicPath: '/js/dist',
  },
  devServer: {
    contentBase: './public',
    hot: true,
    port: 8888,
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
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['.vue', '.js', '.ts'],
    alias: {
      '@': __dirname + '/src/',
    },
  },
};
