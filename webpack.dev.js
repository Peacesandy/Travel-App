const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const WorkboxPlugin = require("workbox-webpack-plugin");


module.exports = {
    entry: ['regenerator-runtime/runtime.js', './src/client/index.js'], // Corrected entry
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Ensures old builds are cleaned up
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/, // Corrected test rule
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // Using MiniCssExtractPlugin
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]',
                },
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new HtmlWebPackPlugin({
            template: "./src/client/views/form.html",
            filename: "./form.html",
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new WorkboxPlugin.GenerateSW(),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false,
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        hot: true,
        open: true,
        devMiddleware: {
            writeToDisk: true, // Forces Webpack to write files to disk in dev mode
        },
    },
};
