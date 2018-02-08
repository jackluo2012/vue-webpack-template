const path = require('path')

const HTMLPlugin = require('html-webpack-plugin')

const webpack = require('webpack')
//非javascript 打包成静态文件
const extractPlugin = require('extract-text-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development'

const config = {
    target:'web',
    //输入
    entry:path.join(__dirname,'src/index.js'),
    //输出
    output:{
        //filename: "bundle.js",
        filename: "bundle-[hash:8].js",
        path:path.join(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader:'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader:'babel-loader'
            },
            //写到图片里面
            {
                test:/\.css$/,
                //loader:'css-loader' //打包成文件
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        //这里定义，在js也能引用
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'
            }
        }),
        //生成html用
        new HTMLPlugin()
    ]
}
if (isDev){
    config.module.rules.push({
        test:/\.styl$/,
        use:[
            'style-loader',
            'css-loader',
            {
                loader:'postcss-loader',
                options:{
                    sourceMap:true
                }
            },
            'stylus-loader'
        ]
    })
    //config.devTool = '#cheap-module-eval-source-map'//帮助我们调试代码,浏览器输出的也是源代码
    config.devtool = '#cheam-module-eval-source-map'
    config.devServer ={
        port:8000,
        host:'0.0.0.0',
        overlay:{
            errors:true
        },
        //局部刷新更改内容
        hot:true
        //是否打开浏览器
        //open:true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else{
    config.entry = {
        app:path.join(__dirname,'src/index.js'),
        vendor:['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
        test:/\.styl$/,
        use:extractPlugin.extract({
            fallback:'style-loader',
            use:[
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{
                        sourceMap:true
                    }
                },
                'stylus-loader'
            ]
        })
    })
    config.plugins.push(
        new extractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'runtime'
        })
    )

}
module.exports = config