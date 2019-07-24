import React from 'react';
import styles from './App.css';
import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component'

const Foo = loadable(() => import(/* webpackChunkName: 'foo' */ './pages/foo'));

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className={styles.text}>
      app
      <Switch>
        <Route path="/foo/:id" component={Foo}></Route>
      </Switch>
    </div>);
  }
}

export default App;