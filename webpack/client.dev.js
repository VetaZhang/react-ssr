
const path = require('path');
const webpack = require('webpack');
const LoadablePlugin = require('@loadable/webpack-plugin');
const merger = require('webpack-merge');
const commonWebpackConfig = require('./common');

// 不显示 DeprecationWarning
process.noDeprecation = true;

const clientWebpackConfig = {
  mode: 'development',
  devtool: 'eval',
  // stats: 'errors-only',
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 8000,
    disableHostCheck: true,
  },
  stats:{
    modules: true,
    children: true,
    chunks: true,
    chunkModules: true
  },
  entry: {
    app: [
      'webpack-hot-middleware/client',
      `${path.resolve()}/src/index.jsx`,
    ],
  },
  output: {
    path: path.resolve(),
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: '[name].[chunkhash:5].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: ["@babel/preset-react", "@babel/preset-env"],
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
          'style-loader',
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
  optimization: {
    splitChunks: {
      chunks() {
        return false;
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        REACT_ENV: JSON.stringify("client"),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new LoadablePlugin(),
  ],
};

module.exports = merger(commonWebpackConfig, clientWebpackConfig);
