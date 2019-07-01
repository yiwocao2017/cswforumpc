var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var es3ifyPlugin = require('es3ify-webpack-plugin');
const svgDirs = [
  require.resolve('antd').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
];
var theme = {
    "primary-color": "#db4528"
};

module.exports = {
    context: path.join(__dirname),
    devtool: debug
        ? "inline-sourcemap"
        : null,
    entry: {
        root: [
            "es5-shim", "es5-shim/es5-sham", 'console-polyfill', "babel-polyfill", "./src/js/index.js"     //
        ],
        // vendor: ['react']
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        'react', 'latest', 'es2016', 'es2015', "stage-0"
                    ],
                    plugins: [
                        'react-html-attrs',
                        [
                            "import",
                            [
                                {
                                    "libraryName": "antd",
                                    "style": true,
                                }
                            ]
                        ],
                        // 'add-module-exports',
                        'transform-es3-member-expression-literals',
                        'transform-es3-property-literals',
                    ] //添加组件的插件配置
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 versions", "> 1%", "ie >= 8", "firefox ESR"]}'
            }, {
                test: /\.less$/,
                loader: `style-loader!css-loader!less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
            }, {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 versions", "> 1%", "ie >= 8", "firefox ESR"]}!sass-loader'
            }, {
               test: /\.(svg)$/i,
               loader: 'svg-sprite',
               include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            }, {//woff|woff2|eot|ttf|svg
                test: /\.(png|jpg|gif)$/,
                // test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=1024'
            }, {
                test: /\.woff|eot|ttf$/,
                loader: require.resolve('file-loader') + '?name=[path][name].[ext]'
            }
        ],
        postLoaders: [
            {
                test: /\.js$/,
                loaders: ['es3ify-loader'],
            },
        ]
    },
    output: {
        filename: '[name].js', //注意这里，用[name]可以自动生成路由名称对应的js文件
        path: path.join(__dirname, 'build'),
        publicPath: '/build/',
        chunkFilename: '[name][chunkhash:8].js' //注意这里，用[name]可以自动生成路由名称对应的js文件
    },
    plugins: debug
        ? [
            new webpack.ProvidePlugin({
               'Promise': 'es6-promise',
            }),
            new es3ifyPlugin()
          ]
        : [
            new webpack.ProvidePlugin({
               Promise: 'es6-promise',
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
              'process.env':{
                'NODE_ENV': JSON.stringify('production')
              }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false, ie8: true}),
            new es3ifyPlugin()
        ]
};
