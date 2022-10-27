/* eslint-disable no-unused-vars */
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const pkg = require('./package.json');

module.exports = (env, argv) => {

    const DEV = argv.mode === 'development';
    const PROD = argv.mode === 'production';

    const config = {
        devtool: DEV ? 'eval-source-map' : 'source-map',

        entry: {
            main: [
                './src/app/main.js',
                './src/app/main.scss',
            ],
        },

        // TODO: Integrate with ESLint:
        // https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1321
        resolve: {
            fallback: {
                "fs": false,
                "os": false,
                "path": false
            },
        },

        output: {
            filename: PROD ? '[name].[contenthash].js' : '[name].[fullhash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: './',
        },

        devServer: {
            static: {
                directory: path.resolve(__dirname, 'static'),
            },
            devMiddleware: {
                publicPath: '/',
                // When sharing the site using ssh -R 80:localhost:8080 ssh.localhost.run
                // disableHostCheck: true,
            },
            client: {
                overlay: {
                    warnings: false,
                    errors: false,
                },
            },
        },

        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            }, {
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            }, {
                test: /\.ejs$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ejs-compiled-loader',
                },
            }],
        },

        plugins: [
            new ESLintPlugin({ fix: true }),

            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, 'dist/index.html'),
                template: path.resolve(__dirname, 'src/app/components/app/app.template.ejs'),
                title: 'Blozum',
                description: pkg.description,
                favicon: path.resolve(__dirname, 'static/favicon.ico'),
                inlineSource: '.(js|css)$', // Inline JS and CSS.
                minify: PROD,
                meta: {
                    author: pkg.author.name,
                    description: pkg.description,
                    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
                },
                // We can use templateParameters if more options are required, but it will override all the above.
            }),

            new Dotenv(),

            new MiniCssExtractPlugin({
                filename: PROD ? '[name].[contenthash].css' : '[name].[fullhash].css',
            }),

            new StyleLintPlugin({
                fix: true,
            }),

            new CopyWebpackPlugin({
                patterns: [{
                    from: 'static',
                }],
            }),

            // eslint-disable-next-line no-undef
            new webpack.DefinePlugin({
                'process.env.USERNAME': JSON.stringify(process.env.USERNAME),
                'process.env.PASSWORD': JSON.stringify(process.env.PASSWORD),
            }),

            // Same as before, but sets properties inside `process.env` specifically:
            // new webpack.EnvironmentPlugin({
            //     DEV,
            //     PROD,
            // }),

            // new BundleAnalyzerPlugin(),
        ],

        optimization: {
            minimize: true,

            // Extract all styles in a single file:
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },

            minimizer: PROD ? [
                '...',
                new CssMinimizerPlugin(),
            ] : [],
        },
    };

    /*
    if (PROD) {
        config.plugins.push(new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin));
    }
    */

    return config;
};
