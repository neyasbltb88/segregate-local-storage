const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';

let config = {
    mode: NODE_ENV,
    context: path.resolve(__dirname, 'src'),

    entry: {
        index: './index.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'SegregateStorage',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },

    watch: false,
    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: false,
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.txt$|\.png$|\.jpg$|\.jpeg$|\.svg$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            fallback: 'file-loader'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.sass$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                indentedSyntax: true
                            }
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: ['index.js', '.js', '.css', '*']
    }
};

module.exports = config;
