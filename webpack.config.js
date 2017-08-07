const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const webpack = require('webpack');
const dev = 'dev';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const definePlugin = new webpack.DefinePlugin({
    __DEV__: (process.env.NODE_ENV || dev).trim() == 'dev'
});

var jqueryPath = path.join(__dirname, "./node_modules/jquery/dist/jquery.js");
//进行路径的转换
let rewriteUrl = (path, replacePath) => {
    return (req, res, proxyOptions) => {
        return req.path.replace(path, replacePath);

    }
};
module.exports = {
    //设置入口文件的绝对目录
    entry: path.resolve('src/index.js'),
    output: {
        path: path.resolve('./build'),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            'jquery': jqueryPath
        }
    },
    //定义了对模块的处理逻辑     Object
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, './node_modules/'),
                use: 'babel-loader',
            },
            {
                test: /.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.(jpg|png)$/,
                use: 'file-loader'
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ]
        // loaders: [//定义了一系列的加载器   Array
        //     {
        //         test: /\.js$/,//正则，匹配到的文件后缀名
        //         loader: 'babel-loader',  // loader/loaders：string|array，处理匹配到的文件
        //         // include：String|Array  包含的文件夹
        //         // exclude：String|Array  排除的文件夹
        //     }
        // ]
    },
    //指定webpack-dev-server配置项
    devServer: {
        contentBase: path.join(__dirname, "build"),
        port: 8080,
        inline: true,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                bypass: rewriteUrl(/\/api\/(.*)/, '\/$1.json'),
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                title: 'My App',
                filename: 'index.html',
                template: 'src/index.html'
            }
        ),
        new OpenBrowserWebpackPlugin({url: 'http://localhost:8080'}),
        definePlugin,
        new ExtractTextPlugin("bundle.css"),

    ]
};