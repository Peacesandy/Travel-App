const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    entry: ['./src/client/index.js'],
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"], // Use style-loader for live reload
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
            filename: "index.html",
        }),
        new CleanWebpackPlugin(),
        new WorkboxPlugin.GenerateSW({
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set limit to 5MB
        })
    ],
};
