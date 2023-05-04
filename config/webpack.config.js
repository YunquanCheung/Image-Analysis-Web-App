const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");


// 用于判断当前是开发模式还是生产模式（合并了开发和生产模式的配置文件）
// 需要通过 cross-env 定义环境变量
const isProduction = process.env.NODE_ENV === "production";

// 将样式loader公共部分提取出来
const getStyleLoaders = (preProcessor) => {
    return [
        // 生产模式下把css内容都单独提取出来
        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);
};


module.exports = {
    entry: './src/index.js',
    output: {
        path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
        filename: isProduction
            ? "static/js/[name].[contenthash:10].js"
            : "static/js/[name].js",
        chunkFilename: isProduction
            ? "static/js/[name].[contenthash:10].chunk.js"
            : "static/js/[name].chunk.js",
        assetModuleFilename: "static/js/[hash:10][ext][query]",
        clean: true,
    },
    module: {
        rules: [
            {
                // oneOf提升打包构建速度，只匹配一个
                oneOf: [
                    // 首先处理css兼容性问题
                    // 配合package.json中的browserslist来制定兼容性做到什么程度
                    {
                        // 用来匹配 .css 结尾的文件
                        test: /\.css$/,
                        // use 数组里面 Loader 执行顺序是从右到左
                        use: getStyleLoaders(),
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoaders("less-loader"),
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: getStyleLoaders("sass-loader"),
                    },
                    {
                        test: /\.styl$/,
                        use: getStyleLoaders("stylus-loader"),
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                            },
                        },
                    },
                    {
                        test: /\.(ttf|woff2?)$/,
                        type: "asset/resource",
                    },

                    // 使用babel处理js文件
                    {
                        test: /\.(jsx|js)$/,
                        include: path.resolve(__dirname, "../src"),
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩
                            plugins: [
                                // "@babel/plugin-transform-runtime",  // presets中包含了
                                // 开发模式下使用react-refresh/babel

                                !isProduction && "react-refresh/babel",
                            ].filter(Boolean),
                        },
                    },
                ],
            },

        ]
    },

    plugins: [

        new ESLintWebpackPlugin({
            extensions: [".js", ".jsx"],
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            // 使用缓存，性能更好
            cache: true,
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
        }),
        new HtmlWebpackPlugin({
            title: 'LZ-Classify',
            // favicon: "./public/favicon.ico",
            // filename: "index.html",
            // manifest: "./public/manifest.json",
            template: 'public/index.html'
        }),

        // 生产模式下启用
        isProduction &&
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
        }),
        // 开发模式下启用热更新
        !isProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),   // 因为有些数组项可能是空的，所以过筛一下

    optimization: {
        // 生产模式下才运行下面的minimizer选项
        minimize: isProduction,
        // 具体压缩的使用的工具和操作
        minimizer: [
            // 压缩css
            new CssMinimizerPlugin(),
            // 压缩js
            new TerserWebpackPlugin(),
            // 压缩图片
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],

        // 下面这两个也都属于优化项
        // 代码分割配置
        splitChunks: {
            chunks: "all",
            // 其他都用默认值
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },

    resolve: {
        // 按照顺序解析后缀名，如果同名不同后缀，按顺序只匹配第一个
        // 这样的话同时用户可以在引入模块的时候不加后缀名字
        extensions: [".jsx", ".js", ".json"],
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 3000,
        client:{
            // show overlay in the browser only when errors happening
            // (syntax varies across different versions)
            overlay:{
                warnings: false,
                errors: true,
            }
        },
        hot: true,
        compress: true,
        // 主要来解决SPA中刷新返回404的情况
        historyApiFallback: true,

    },
    mode: isProduction ? "production" : "development",
    // cheap- 忽略列信息，打包更迅速
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    // other configuration options...
    stats: {
        // 控制台输出等级
        all: false,
        // 只输出错误和警告信息
        warnings: true,
        errors: true
    },
}
