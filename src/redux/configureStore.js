import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducer';

const reducers = combineReducers(rootReducer);
const middlewares = [thunkMiddleware];
const appliedMiddlewares = applyMiddleware.apply(applyMiddleware, middlewares);
const devtoolValid = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
const middleware = devtoolValid ? compose(appliedMiddlewares, window.__REDUX_DEVTOOLS_EXTENSION__()) : compose(appliedMiddlewares);

const store = createStore(
  reducers,
  {},
  middleware,
);

store.asyncReducers = rootReducer;

if (module.hot) {
  module.hot.accept('./reducer', () => {
    const rootReducer = require('./reducer').default;
    const asyncReducers = store.asyncReducers;
    store.replaceReducer(combineReducers({
      ...rootReducer,
      ...asyncReducers,
    }));
  });
}

export {
  store,
};
