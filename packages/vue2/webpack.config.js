import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// import { resolve } from './build/util.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const config = {
  mode: 'production',
  entry: {
    font: '@adyen/lume-core/font',
  },
  output: {
    path: path.resolve('dist/styles'),
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
