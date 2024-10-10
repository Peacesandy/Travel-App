const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    entry: ['regenerator-runtime/runtime.js', './src/client/index.js'], // Corrected entry
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/, // Corrected test rule
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // Using MiniCssExtractPlugin in production
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css', // Extract and hash CSS for cache busting
        }),
        new CleanWebpackPlugin(),
        new WorkboxPlugin.GenerateSW({
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set limit to 5MB
        })
    ],
};
