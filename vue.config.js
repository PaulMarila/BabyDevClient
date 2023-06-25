const { defineConfig } = require('@vue/cli-service')
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '/api': '',
        },
        secure: false,
      },
    },
  },
  transpileDependencies: true,
};
