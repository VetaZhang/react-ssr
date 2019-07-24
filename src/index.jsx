
// import 'babel-polyfill';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { loadableReady } from '@loadable/component'
import { store } from './redux/configureStore';
import App from './App';

const renderPage = window.__fb_use_render__ ? render : hydrate;

loadableReady(() => {
  renderPage(
    <Provider store={store}>
      <Router>
        <Route path="/" component={App} />
      </Router>
    </Provider>,
    document.getElementById('app')
  );
});

if (module.hot) {
  module.hot.accept();
}