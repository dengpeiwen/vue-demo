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
        host: '0.0.0.0',
        port:'8089',
        https:false,
        stats: { colors: true },
        // 代理
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

