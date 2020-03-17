# webpack-vue-
webpack从0开始配置开发环境

webpack是前端打包的一个工具，按照其官方的说法：webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。简而言之，webpack就是一个能将前端的资源包括js，样式文件，图片等资源打包到一个或多个的bundle中去。下面我们就来学习一下webpack的入门配置，学完你就可以自己手动搭建一个前端vue工程化的开发环境。
> 在开始之前，你的电脑中需安装[node环境](https://nodejs.org/zh-cn/)（建议安装长期支持版本），在后面的讲解过程中我们需要安装各种依赖包。如果你不知道是否已安装node,可以在命令行窗口输入`node --version`，如果有版本号就说明已安装，没有则需要安装。
### 一、webpack核心概念
* 入口（entry）
* 出口（output）
* loader
* plugin（插件）
> 入口（entry）

入口起点，一般是webpack指定某个模块或者文件作为构建其内部依赖图的开始。进入入口起点后，webpack会找到有哪些模块和库是入口起点（直接或间接）依赖的。
```
//webpack.config.js
module.exports = {
    entry:'./path/to/my/entry/file.js'
}
```
> 出口（output）

output告诉webpack在哪里输出它所创建的bundles，以及如何命名这些文件，默认值是`./dist`。基本上，整个应用程序结构都会被编译到指定的输出路径的文件夹中。
```
//webpack.config.js
const path = require('path')
module.exports = {
    entry:'./path/to/my/entry/file.js',
    output:{
        path:path.resolve(__dirname,'dist'), //所有最终打包的资源都会在dist文件夹中
        filename:'my-webpack-bundle.js'
    }
}
```
> loader

webpack本身只能识别js，但是我们的项目中除了js，还有样式（.css/.scss/.less）、图片(.png/.jpg/.jpeg)等文件，要识别这些资源需要安装对应的loader，让webpack能够进行处理。
```
//webpack.config.js
const path = require('path')
module.exports = {
    entry:'./path/to/my/entry/file.js',
    output:{
        path:path.resolve(__dirname,'dist'), //所有最终打包的资源都会在dist文件夹中
        filename:'my-webpack-bundle.js'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
            //test用于识别出需要被转换的文件，use使用哪一种loader进行转换
        ]
    }
}
```
> 插件（plugins）

loader用于转换某些类型的模块，而插件则可以执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，用来处理各种各样的任务。
```
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件

const config = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;
```
### 二、开始动手从零搭建
#### 1、项目初始化
在新创建的文件夹中，创建package.json
> npm init -y 

安装webpack相关依赖
> npm i webpack webpack-cli -D  //也可以使用yarn进行安装，开发依赖`-D`,生产依赖`-S`

新建`src`目录，添加`main.js`,在main.js中添加一些代码。然后在package.json中添加一条`script`执行语句来进行打包。执行`npm run build`，如果生成dist文件，则说明打包成功。
```
"scripts": {
    "build": "webpack src/main.js"
  },
```
#### 2、webpack基本配置
在根目录新建一个build文件夹，里面新建一个webpack.config.js。进行如下配置
```
const path = require('path')

module.exports = {
    mode: "development", //设置模式，开发(development)或者生产(production)
    entry: path.resolve(__dirname,'../src/main.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename:'bundle.js'
    }
}

```
同时修改`package.json`文件中的`build`的命令
```
"scripts": {
    "build": "webpack --config build/webpack.config.js"
  },
```
运行`npm run build`就生成打包之后的文件。
#### 3、配置插件
- `html-webpack-plugin`：打包之后的js文件需要引用到html中，使用该插件可以动态引用js
- `clean-webpack-plugin`：每次打包之前需销毁之前的dist文件，重新生成新打包之后的dist
```
npm i html-webpack-plugin clean-webpack-plugin -D
```
```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //注意这里的CleanWebpackPlugin

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname,'../src/main.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename:'[name].[hash].js' //输出的文件可以使用原来的文件名，可以加上hash值
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: path.resolve(__dirname, '../public/index.html')//指定HTML模板
            }
        ),
        new CleanWebpackPlugin()
    ]
}
```
#### 4、配置loader
以下文件需安装对应的loader
- css  `css-loader postcss`
    > 注意这里可以使用`mini-css-extract-plugin`来进行css样式抽离
- less `less less-loader`
- 图片等媒体文件 `file-loader url-loader` 
    > `file-loader`和`url-loader`可以接收并加载任何媒体文件，两者一般搭配使用。`url-loader`可以设置文件存储大小，如果超出配置的大小返回则会返回base编码。

- 将js中ES6语法转换成ES5  `babel-loader @babel/preset-env @babel/core`
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module:{
        rules: [
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
                    'css-loader'
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
        ],
        plugins: [
            new HtmlWebpackPlugin(
                {
                    template: path.resolve(__dirname, '../public/index.html')
                }
            ),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name][hash].css',
                chunkFilename: '[id].css',
              })
        ]
    },
```
#### 5、配置vue开发环境
安装Vue以及Vue相关依赖，【`vue-loader`(解析.vue文件)】,【`vue-template-compiler`(vue编译)】,【`vue-style-loader`】
```
npm i -S vue
npm i -D vue-loader vue-template-compiler vue-style-loader
```
```
//配置.vue依赖的loader
//webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    module:{
          rules:[{
              test:/\.vue$/,
              use:['vue-loader']
          },]
      },
      resolve:{
          alias:{
            'vue$':'vue/dist/vue.runtime.esm.js',
            ' @':path.resolve(__dirname,'../src')
          },
          extensions:['*','.js','.json','.vue']
    },
    plugins:[
          new vueLoaderPlugin()
    ]
}
```
在src目录中新建app.vue模板文件，里面写vue模板，将这个文件引入到main.js，这样一个vue项目的基本骨架差不多搭建好了。激不激动!!!
```
import Vue from 'vue'
import App from './app'

new Vue({
    render: h=>h(App)
}).$mount('#app')
```
别慌，我们还需要进行热重载，跟实际vue项目那样，运行`npm run dev`就可以试项目跑起来
> npm i webpack-dev-server -D

在webpack.config.js中进行配置
```
const Webpack = require('webpack')
module.exports = {
    //...省略配置
    devServer: {
        port:8080,
        hot:true,
        contentBase:'../dist'
    },
    plugins：[
        new Webpack.HotModuleReplacementPlugin()
    ]
}
```
最后，在``packpage.json`中进行配置，项目就可以运行起来啦啦啦啦啦//
```
"scripts": {
    "dev": "webpack-dev-server --config build/webpack.config.js --open",
    "build": "webpack --config build/webpack.config.js"
  },
```
