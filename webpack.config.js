const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {

    mode: 'development',
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    entry: {
        main: path.resolve(__dirname, './src/index.js'),
        search: path.resolve(__dirname, './src/search.js'),
        paginations: path.resolve(__dirname, './src/paginations.js'),
        library: path.resolve(__dirname, './src/My_library.js'),
        filmotekaLibrary: path.resolve(__dirname, './src/filmoteka_library.js')
    },

    output: {
        filename: '[name].bundle.js', 
        path: path.resolve(__dirname, 'dist')
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/template.html'),
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/pagination.html'),
            filename: 'paginats.html',
        }),
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/My_library.html'),
            filename: 'library.html',
        }),
        new CleanWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
 
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },

            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
}