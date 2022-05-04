const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.s[ac]ss|\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.stories\.js$/,
                loaders: [require.resolve('@storybook/addon-storysource/loader')],
                enforce: 'pre',
            }
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src/')
        }
    }
};