const { VueLoaderPlugin } = require('vue-loader');
console.log(__dirname + '/dist');

module.exports = {
    entry: './public/js/src/main.js',
    output: {
        path: __dirname + '/public/js/dist',
        filename: 'build.js',
        publicPath: "/js/dist"
    },
    devServer: {
        contentBase: "./public",
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    plugins: [
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                        '@babel/plugin-proposal-optional-chaining',
                    ]
                }
            },
            {
                test: /\.s[ac]ss|\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            vue: __dirname + '/node_modules/vue/dist/vue.js'
        }
    }
};