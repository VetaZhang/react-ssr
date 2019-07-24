const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");
const merger = require('webpack-merge');
const commonWebpackConfig = require('./common');

class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject() {
    return {};
  }
}

const serverWebpackConfig = {
  mode: 'development',
  devtool: 'eval',
  stats: 'errors-only',
  entry: {
    app: `${path.resolve('server/server-entry.jsx')}`
  },
  output: {
    path: path.resolve('dist/server'),
    filename: "entry.js",
    publicPath: path.resolve('dist/server'),
    chunkFilename: '[name]-chunk.js',
    libraryTarget: "commonjs2",  // 打包成commonjs2规范
  },
  target: "node",  // 指定node运行环境
  externals: ['@loadable/component', nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: ["@babel/preset-react", "@babel/preset-env",],
              plugins: [
                "@loadable/babel-plugin",
                ['styled-components', { 'ssr': true, 'displayName': true, 'preprocess': false }],
              ],
            }
          },
        ],
        exclude: /node_modules/
      }, {
        test: /\.(css|less|scss)$/,
        use: [
          {
            loader: ServerMiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path]_[name]_[local]_[hash:base64:5]'
            }
          },
          'less-loader'
        ],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        REACT_ENV: JSON.stringify("server"),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new ServerMiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: 'css/[id]-chunk.css',
    }),
  ],
};

module.exports = merger(commonWebpackConfig, serverWebpackConfig);
