const path  = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: true,
    chainWebpack: config => {
        config.resolve.alias.set('@',resolve('src'));
    },
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'index.html'
        }
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        proxy: {
            '/api/': {
                // 目标服务器地址
               target: '服务器地址',
                changeOrigin: true,
                secure: false,
                // 路径重写
                pathRewrite: {
                    "^/api": ""
                }
            },
        }
    }
}
