import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { resolve } from './build/util.js';

const config = {
  mode: 'production',
  entry: {
    font: './src/styles/font.scss',
  },
  output: {
    path: resolve('dist/styles'),
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        // Encode font to Base 64 and inline it in font.css
        // This makes it so consumers don't have to deal with font file types from their node_modules.
        test: /\.(woff2?)$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

export default config;
