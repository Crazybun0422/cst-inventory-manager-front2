let path = require('path')
const { defineConfig } = require('@vue/cli-service')
const isDev = process.env.NODE_ENV === 'development'

module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/css/var.scss";`
      }
    }
  },
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devtool: isDev ? 'cheap-module-source-map' : 'source-map'
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve('src'))
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        // 全局变量路径
        path.resolve(__dirname, './assets/css/var.scss')
      ]
    }
  },
  devServer: {
    // port: 8000,
    // hot: false, // 禁用热模块替换
    // liveReload: false, // 禁用实时重载
    webSocketServer: false, // 禁用 WebSocket 服务器,热加载
    headers: {
      'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
    },
    proxy: {
      '/api-prefix': {
        // target: 'http://192.168.0.111:8000',  // 这是局域网地址
        target: 'http://127.0.0.1:8000',  // 这是本地地址
        // target: 'https://www.continuserv.com/api-direct/',    // 这是线上地址
        pathRewrite: { '^/api-prefix': '' },
        ws: false, //用于支持websocket
        logLevel: 'debug',  // 开启调试模式可以看到代理的详细信息
        changeOrigin: true//用于控制请求头中的host值
      },
      '/api': {
        // target: 'http://192.168.0.111:8000',  // 这是局域网地址
        target: 'http://127.0.0.1:8000',  // 这是本地地址
        // target: 'https://www.continuserv.com/api-direct/',    // 这是线上地址
        ws: false, //用于支持websocket
        logLevel: 'debug',  // 开启调试模式可以看到代理的详细信息
        changeOrigin: true //用于控制请求头中的host值
      },
      // WebSocket 代理配置
      '/websocket': {
        target: 'ws://127.0.0.1:8082', // 代理到 WebSocket 服务
        ws: true,  // 启用 WebSocket 支持
        changeOrigin: true,  // 控制 host 头的值
        pathRewrite: { '^/websocket': '' },  // 去掉 /websocket 前缀
        logLevel: 'debug'  // 打印调试日志
      },
      '/auth/': {
        target: 'http://127.0.0.1:8000',  // 这是本地地址
        // target: 'https://www.continuserv.com/api-direct/',    // 这是线上地址
        ws: false, //用于支持websocket
        logLevel: 'debug',  // 开启调试模式可以看到代理的详细信息
        changeOrigin: true //用于控制请求头中的host值
      }
    },
    client: {
      overlay: false,

    },

    allowedHosts: 'all',  // 允许所有主机连接
  }
})
