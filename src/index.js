import React from "react";
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './ducks'

import Spinner from 'components/Loading/Loading.jsx';

import "assets/css/material-dashboard-react.css?v=1.3.0";

import { hydrate } from 'ducks';
import { isLoading } from 'ducks/valves';
import indexRoutes from "routes/index.jsx";

const hist = createBrowserHistory();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

class App extends React.Component {
  componentWillMount() {
    this.props.hydrate();
  }

  render() {
    if (this.props.isLoading) return <Spinner />;
    return (
      <Router history={hist} basename="/garden-monitor">
        <Switch>
          {indexRoutes.map((prop, key) => {
            return <Route path={prop.path} component={prop.component} key={key} />;
          })}
        </Switch>
      </Router>
    );
  }
}

const Root = connect(s => ({ loading: isLoading(s) }), { hydrate })(App);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("root")
);
