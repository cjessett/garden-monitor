import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router'

import rootReducer from './ducks'

import Login from 'views/Auth/Login.jsx';
import Signup from 'views/Auth/Signup.jsx';
import Spinner from 'components/Loading/Loading.jsx';

import "assets/css/material-dashboard-react.css?v=1.3.0";

import { hydrate } from 'ducks';
import { isLoading } from 'ducks/valves';
import indexRoutes from "routes/index.jsx";

const initialState = { auth: { isAuthenticated: !!localStorage.getItem('token') } }

const hist = createBrowserHistory();
const store = createStore(
  connectRouter(hist)(rootReducer),
  initialState,
  composeWithDevTools(applyMiddleware(routerMiddleware(hist), thunkMiddleware))
);

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class App extends React.Component {
  componentWillMount() {
    if (this.props.authorized) this.props.hydrate();
  }
  render() {
    if (this.props.isLoading) return <Spinner />;
    return (
      <Router history={hist} basename="/garden-monitor">
        <Switch>
         <Route path="/login" render={() => this.props.authorized ? <Redirect to='/' /> : <Login />} />
         <Route path="/signup" render={() => this.props.authorized ? <Redirect to='/' /> : <Signup />} />
          {indexRoutes.map((prop, key) => {
            return <PrivateRoute isAuthenticated={this.props.authorized} path={prop.path} component={prop.component} key={key} />;
          })}
        </Switch>
      </Router>
    );
  }
}

const Root = connect(s => ({ loading: isLoading(s), authorized: s.auth.isAuthenticated }), { hydrate })(App);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById("root")
);
