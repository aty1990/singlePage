var webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const glob = require("glob");

//http://localhost:8989/hospital.html 
//http://localhost:8989/about.html
//http://localhost:8989/airpart.html 
//http://localhost:8989/activity.html 
//http://localhost:8989/help.html 

const htmls = glob.sync('src/pages/**/*.html'); //扫描出入口页面模板的路径, 如src/pages/help/help.html, 存放在 htmls 对象里
const entrys = {}; //定义一个 entrys 动态添加入口文件
const htmlCfgs = []; //定义一个 htmlCfg 动态添加入口文件配置
htmls.forEach((filePath) => { //遍历扫描到的页面模板路径
    let path = filePath.split('/'); //分割路径,
    let file = path.pop(); //把入口模板页面文件名pop出来, 比如: help.html
    let name = file.split('.')[0]; //把入口页面名分割出来, 取第一个就是 help
    entrys[name] = './src/pages/' + name + '/' + name + '.js'; //动态配置入口文件路径
    htmlCfgs.push( //动态配置入口文件插件
        new HtmlWebpackPlugin({
            filename:file,
            inject: 'head',
            template: 'html-withimg-loader!'+__dirname + "/"+filePath,
            chunks: [name],
            inlineSource: '.(js|css)$',
             minify:{
                removeComments: true,//删除注释
                collapseWhitespace:true//删除空格
            }
        }),
    )
});

htmlCfgs.push(new ExtractTextPlugin(__dirname + '/assert/css/common.scss'))
htmlCfgs.push(new UglifyJsPlugin())
// htmlCfgs.push(new webpack.HotModuleReplacementPlugin())
htmlCfgs.push(new OptimizeCssAssetsPlugin({
   assetNameRegExp: /\.optimize\.css$/g,
   cssProcessor: require('cssnano'),
   cssProcessorOptions: { discardComments: {removeAll: true } },
   canPrint: true
 }))
htmlCfgs.push(
    //设置每一次build之前先删除static
    new CleanWebpackPlugin(
        ['static/*', 'static/*',],　       //匹配删除的文件
        {
            root: __dirname,       　　　　　　//根目录
            verbose: true,        　　　　　　　//开启在控制台输出信息
            dry: false        　　　　　　　　　　//启用删除文件
        }
    )
)
module.exports = {
    // 配置入口
    entry: entrys,
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
    plugins: htmlCfgs,
    // 起本地服务，我起的static目录
    devServer: {
        contentBase: "./static",
        historyApiFallback: true,
        inline: true,
        hot: true,
        port:8989,
        host: 'localhost',//我的局域网ip
    }
}
