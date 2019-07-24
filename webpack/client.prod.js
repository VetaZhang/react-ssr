const webpack = require('webpack');
const path = require('path');
const QiniuPlugin = require('qiniu-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const childProcess = require('child_process');
const merger = require('webpack-merge');
const LoadablePlugin = require('@loadable/webpack-plugin');
const commonWebpackConfig = require('./common');

// 不显示 DeprecationWarning
process.noDeprecation = true;

const config = {
  path: `ssr/${childProcess.execSync('git rev-parse HEAD').toString().replace(/\n/, '')}`,
  cdn: 'http://opeq3tea1.bkt.clouddn.com/',
};

// 这里配置 Plugin
const qiniuPlugin = new QiniuPlugin({
  ACCESS_KEY: 'Tor2L7aBu0znCFOhe1KE-czP3yng0hkVN--Cj33Q',
  SECRET_KEY: 'iOxZi0M4kSZoLu5oibf95oHiiC7bfjafSawnik2Z',
  bucket: 'share-xinpinget',
  path: config.path,
  include: [/(\.js|\.map)$/],
});

const clientWebpackConfig = {
  mode: "production",
  devtool: 'source-map',

  stats:{
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },

  entry: {
    app: `${path.resolve()}/src/index.jsx`,
  },

  output: {
    path: `${path.resolve()}/dist/client`,
    filename: '[name].js',
    publicPath: `${config.cdn}${config.path}`,
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
    new webpack.DefinePlugin({
      'process.env': {
        REACT_ENV: JSON.stringify("client"),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new LoadablePlugin(),
    // new webpack.optimize.AggressiveMergingPlugin(),
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: 4,
      uglifyOptions: {
        minimize: true,
        unused: true,
        ecma: 5,
        ie8: false,
        warnings: false,
      },
    }),
    qiniuPlugin,
  ],
};

module.exports = merger(commonWebpackConfig, clientWebpackConfig);