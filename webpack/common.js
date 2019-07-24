/*
 * By Veta
 * webpack 各环境下通用的配置项
 */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', 'css', 'less', 'scss'],
    modules: [
      path.resolve('src'),
      'node_modules',
    ],
    alias: {
      pages: path.resolve('./src/pages'),
      components: path.resolve('./src/components'),
      utils: path.resolve('./src/utils'),
      reduxStore: path.resolve('./src/redux'),
      config: path.resolve('./config'),
    },
  },
};
