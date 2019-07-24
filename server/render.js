
const { getAppCss, getChunkCss } = require('./util');
const getRouterConfig = require('./routerConfig');
const Cache = require('lru-cache');

const ssrCache = new Cache({
  max: 100 * 1024 * 1024, /* cache size will be 100 MB using `return n.length` as length() function */
  length(n) {
    return n.length;
  },
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

const renderWithSSR = ({req, res, renderFunc, routerConfig}) => {
  const { router, config } = routerConfig;
  const cached = ssrCache.get(router);
  if (cached) {
    if (config.getInitialData) {
      config.getInitialData().then(initialData => {
        cached.initialData = initialData;
        res.render('index', cached);
      });
    } else {
      res.render('index', cached);
    }
  } else {
    let promiseList = [
      getAppCss(),
      getChunkCss(req.url),
      renderFunc(req.url),
    ];
    if (config.getInitialData) {
      promiseList.push(config.getInitialData());
    }
    return Promise.all(promiseList)
      .then((result) => {
        const [appCss, chunkCss, tags, initialData] = result;
        const data = {
          title: '火球买手',
          css: `${appCss}\n${chunkCss}`,
          style: tags.style,
          body: tags.body,
          initialData,
          script: tags.script,
        };
        ssrCache.set(router, data)
        res.render('index', data);
      })
      .catch((error) => {
        console.log(error);
        if (404) {
          res.sendStatus(404);
        } else {
          res.sendStatus(500);
        }
      });
  }
};

let csrCache = {};
const createPageParams = (script, initialData) => {
  const tag = '<script type="text/javascript">window.__fb_use_render__ = true;</script>';
  return { title: '', css: '', style: '', body: '', initialData, script: `${tag}\n${script}` };
};
const renderPlainHtml = ({req, res, renderFunc, routerConfig}) => {
  const { router, config } = routerConfig;
  

  if (csrCache[router]) {
    if (config.getInitialData) {
      config.getInitialData().then(initialData => {
        res.render('index', createPageParams(csrCache[router], initialData));
      });
    } else {
      res.render('index', createPageParams(csrCache[router]));
    }
  } else {
    let promiseList = [renderFunc(req.url)];
    if (config.getInitialData) {
      promiseList.push(config.getInitialData());
    }
    return Promise.all(promiseList).then(result => {
      const [tags, initialData] = result;
      csrCache[router] = tags.script;
      res.render('index', createPageParams(tags.script, initialData));
    });
  }
};

module.exports = function({req, res, renderFunc}) {
  const routerConfig = getRouterConfig(req.path);
  const { config } = routerConfig;

  if (config.ssr === false) {
    renderPlainHtml({req, res, renderFunc, routerConfig});
  } else {
    renderWithSSR({req, res, renderFunc, routerConfig});
  }
};