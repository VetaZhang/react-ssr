const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const render = require('./render');

const webpack = require('webpack');
const { isDev } = require("../config/env");
const { removeModuleCache, writeFile } = require('./util');

const app = express();

app.set('views', path.resolve('ejs'));
app.set('view engine', 'ejs');
app.use(express.static(path.resolve()));
app.use(cookieParser());

let renderFunc;

const compileServer = () => {
  const serverConfig = require('../webpack/server');
  const serverCompiler = webpack(serverConfig);

  return new Promise((resolve, reject) => {
    serverCompiler.watch({
      ignored: /node_modules/,
    }, (err, stats)=>{
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const info = stats.toJson();

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
        }

        if (stats.hasErrors()) {
          console.error(info.errors);
          reject(info.errors);
        }

        console.log('server build finished');
        if (renderFunc) {
          // 用于服务端渲染的文件更新后需要删除缓存并重新引入
          removeModuleCache('../dist/server/entry');
        }
        renderFunc = require('../dist/server/entry').default;
      }
    });
  });
};

const compileClient = () => {
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const clientConfig = require('../webpack/client.dev');

  const compiler = webpack(clientConfig);
  const devMiddleware = webpackDevMiddleware(compiler, { noInfo: false, publicPath: clientConfig.output.publicPath });
  const hotMiddleware = webpackHotMiddleware(compiler);

  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap('done', (stats) => {
      const info = stats.toJson();

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }

      if (stats.hasErrors()) {
        return console.error(info.errors);
      }

      try {
        const filename = path.join(clientConfig.output.path, 'loadable-stats.json');
        const loadableStats = devMiddleware.fileSystem.readFileSync(filename, "utf-8");
        writeFile(['dist', 'client'], 'loadable-stats.json', loadableStats);
        resolve('');
      } catch(err) {
        console.log(err);
        reject(err);
      }
    });

    app.use(devMiddleware);
    app.use(hotMiddleware);
  });
};

let handleRequest;
if (isDev) {
  const compile = Promise.all([
    compileServer(),
    compileClient(),
  ]);
  handleRequest = (req, res) => {
    if (renderFunc) {
      render({ req, res, renderFunc });
    } else {
      compile.then(result => {
        const [renderFunc, clientCompileResult] = result;
        render({ req, res, renderFunc });
      }).catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    }
  };
} else {
  renderFunc = require('../dist/server/entry').default;
  handleRequest = (req, res) => {
    render({ req, res, renderFunc });
  };
}

app.get('/*', handleRequest);

const port = 8000;

app.listen(port, () => {
  console.log(`Your app is running on port ${port}`);
});
