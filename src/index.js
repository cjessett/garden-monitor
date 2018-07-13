import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './ducks'

import "assets/css/material-dashboard-react.css?v=1.3.0";

import indexRoutes from "routes/index.jsx";

const hist = createBrowserHistory();
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

const App = _ => (
  <Router history={hist}>
    <Switch>
      {indexRoutes.map((prop, key) => {
        return <Route path={prop.path} component={prop.component} key={key} />;
      })}
    </Switch>
  </Router>
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
