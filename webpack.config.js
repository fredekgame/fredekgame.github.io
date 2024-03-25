const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const webpack = require('webpack')

module.exports = {

    mode: 'development',
    devServer: {
        historyApiFallback: true,
        // path: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    entry: {
        main: path.resolve(__dirname, './src/index.js'),
        search: path.resolve(__dirname, './src/search.js'),
        paginations: path.resolve(__dirname, './src/paginations.js'),
        library: path.resolve(__dirname, './src/My_library.js')
    
    },

    output: {
        filename: '[name].bundle.js', 
        path: path.resolve(__dirname, 'dist')
    },

    // entry: [
    //     'webpack/hot/dev-server',
    //     'webpack-hot-middleware/client',
    //     path.resolve(__dirname, '../client/index.coffee')
    // ],

    // output: {
    //     path: '/template.html',
    //     publicPath: 'http/://localhost:3000/scripts/',
    //     filename: '[name].bundle.js',
    // },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/template.html'), // template file
            filename: 'index.html', // output file
        }),
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/pagination.html'), // template file
            filename: 'paginats.html', // output file
        }),
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, './src/My_library.html'), // template file
            filename: 'library.html', // output file
        }),
        new CleanWebpackPlugin(),
    ],

    module: {
        rules: [
            // JavaScript
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            // Fonts and SVGs
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            // CSS, PostCSS, and Sass
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.(css)$/,
            //     use: [{
            //         loader: 'style-loader', // inject CSS to page
            //     }, {
            //         loader: 'css-loader', // translates CSS into CommonJS modules
            //     }, 
            // {
            //     loader: 'postcss-loader', // Run post css actions
            //     options: {
            //         plugins: function () { // post css plugins, can be exported to postcss.config.js
            //             return [
            //                 require('precss'),
            //                 require('autoprefixer')
            //             ];
            //         }
            //     }
            // }, {
            // loader: 'sass-loader' // compiles Sass to CSS
            // }]
            // },
        ],
    },
}