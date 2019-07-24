import { combineReducers } from 'redux';
import { store } from './configureStore';

const generateReducer = (config) => {
  const { name, state: defaultState, valueField } = config;

  // 往默认的 state 里添加通用方法
  defaultState.set = function set(obj) {
    store.dispatch({ type: `${name}/diff`, obj });
  };
  // 生成 reducer 方法
  const reducer = function (state = defaultState, action) {
    if (action.type === `${name}/diff`) {
      if (valueField && typeof valueField === 'string') {
        const value = Object.assign({}, state[valueField], action.obj);
        return Object.assign({}, state, { [valueField]: value });
      }
      return Object.assign({}, state, action.obj);
    }
    return state;
  };
  // 判断是否存在，是则输出提示
  if (store.asyncReducers[name]) {
    console.log(`Reducer ${name} is exists, reload it.`);
  }
  // 注入 reducer
  store.asyncReducers[name] = reducer;
  store.replaceReducer((reducers => combineReducers({
    ...reducers,
  }))(store.asyncReducers));
  
};

export {
  generateReducer,
};
