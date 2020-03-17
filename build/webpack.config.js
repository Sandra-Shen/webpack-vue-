const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const Webpack = require('webpack')
const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname,'../src/main.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename:'[name].[hash].js'
    },
    module:{
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                exclude:/node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // only enable hot in development
                            // hmr: process.env.NODE_ENV === 'development',
                            hmr: true,
                            // if hmr does not work, this is a forceful method.
                            reloadAll: true,
                        }
                    },
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // only enable hot in development
                            // hmr: process.env.NODE_ENV === 'development',
                            hmr: true,
                            // if hmr does not work, this is a forceful method.
                            reloadAll: true,
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: '[name][hash].[ext]',
                                    outputPath: 'images/'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|mav|flac|acc)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: '[name][hash].[ext]',
                                    outputPath: 'media/'
                                }
                            }
                        }
                    }
                ]
            }
        ]  
    },
    resolve: {
        alias: {
            'vue$':'vue/dist/vue.runtime.esm.js',
            '@': path.resolve(__dirname,'../src')
        },
        extensions: ['*','.js','.json','.vue']
    },
    devServer: {
        port:3000,
        hot:true,
        contentBase:'../dist'
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: path.resolve(__dirname, '../public/index.html')
            }
        ),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name][hash].css',
            chunkFilename: '[id].css',
          }),
          new vueLoaderPlugin(),
          new Webpack.HotModuleReplacementPlugin()
    ]
}