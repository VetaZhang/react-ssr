import React from 'react';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter, Route } from 'react-router-dom';
import { ChunkExtractor } from '@loadable/server'
import { ServerStyleSheet } from 'styled-components';
import { store } from '../src/redux/configureStore';
import { isDev } from '../config/env';
import App from '../src/App';

const createExtractor = () => new ChunkExtractor({
  statsFile: path.resolve('dist/client/loadable-stats.json'),
  entrypoints: ["app"],
});

const getExtractor = (function() {
  let extractor;
  if (!isDev) {
    extractor = createExtractor();
  }
  return () => {
    return isDev ? createExtractor() : extractor;
  };
})();

export default function render(url) {
  return new Promise((resolve, reject) => {
    const context = {};
    const sheet = new ServerStyleSheet();
    const extractor = getExtractor();
    const jsx = sheet.collectStyles(extractor.collectChunks(
      <Provider store={store}>
        <StaticRouter location={url} context={context}>
          <Route path="/" component={App} />
        </StaticRouter>
      </Provider>
    ));
    const result = {
      body: renderToString(jsx),
      script: extractor.getScriptTags(),
      style: sheet.getStyleTags(),
    };
    resolve(result);
  });
};
