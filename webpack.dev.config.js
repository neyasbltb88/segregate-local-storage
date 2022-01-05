const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

let config = {
    mode: NODE_ENV,
    context: path.resolve(__dirname, 'src'),

    entry: {
        index: './demo.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true,
        port: PORT,
        open: true,
        https: true,
        // Для полной перезагрузки при изменении в html, нужен режим liveReload
        liveReload: true,
        // Для горячей замены модулей, при разработке SPA на фреймворках, нужен режим hot
        // При включении режима hot, перестает работать режим liveReload
        // hot: true,
        writeToDisk: false,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        },
        overlay: {
            warnings: true,
            errors: true
        }
    },

    devtool: 'inline-source-map',
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
