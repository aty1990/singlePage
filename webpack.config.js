var webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


//http://0.0.0.0:8080/hospital.html 
//http://0.0.0.0:8080/airpart.html 
//http://0.0.0.0:8080/activity.html 
module.exports = {
    // 配置入口
    entry: {
        airpart: './src/pages/airpart/airpart.js',
        hospital: './src/pages/hospital/hospital.js',
        activity: './src/pages/activity/activity.js'
    },
    // 配置出口
    output: {
        path: __dirname + "/static/",
        filename: 'js/[name]-[hash:5].js',
        //publicPath: '/ibuick/spage/static/'   // 生产资源地址
        publicPath: '/'                         // 本地调试模式
    },

    module: {
        loaders: [
            //解析.js
            {
                test: '/\.js$/',
                loader: 'babel',
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, 'src'),
                query: {
                    presets: ['env']
                }
            },
            // css处理
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'

            },
            // less处理
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.scss$/,
                use:[ 'style-loader','css-loader','sass-loader'],
            },
            // 图片处理
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',

                query: {
                    name: 'assets/[name]-[hash:5].[ext]'
                },
            },{
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(__dirname + '/assert/css/common.scss'),

        new UglifyJsPlugin(),//压缩js
       //压缩css
       new OptimizeCssAssetsPlugin({
           assetNameRegExp: /\.optimize\.css$/g,
           cssProcessor: require('cssnano'),
           cssProcessorOptions: { discardComments: {removeAll: true } },
           canPrint: true
         }),
        new HtmlWebpackPlugin({
            filename: __dirname + '/static/airpart.html',
            inject: 'head',
            template: 'html-withimg-loader!'+__dirname + "/src/pages/airpart/airpart.html",
            chunks: ['airpart'],
            inlineSource: '.(js|css)$',
             minify:{
                removeComments: true,//删除注释
                collapseWhitespace:true//删除空格
            }
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: __dirname + '/static/hospital.html',
            template: __dirname + "/src/pages/hospital/hospital.html",
            chunks: ['hospital'],
            inlineSource: '.(js|css)$',
            minify:{
               removeComments: true,//删除注释
               collapseWhitespace:true//删除空格
           }
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: __dirname + '/static/activity.html',
            template: __dirname + "/src/pages/activity/activity.html",
            chunks: ['activity'],
            inlineSource: '.(js|css)$',
            minify:{
               removeComments: true,//删除注释
               collapseWhitespace:true//删除空格
           }
        }),
        //设置每一次build之前先删除static
        new CleanWebpackPlugin(
            ['static/*', 'static/*',],　     //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        )
    ],
    // 起本地服务，我起的static目录
    devServer: {
        contentBase: "./static",
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: '192.168.43.248',//我的局域网ip
    }
}
