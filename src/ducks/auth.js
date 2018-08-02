import axios from 'axios';
import { push } from 'connected-react-router'

import { API_URL } from './index';
// action types
const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
const LOGOUT = 'auth/LOGOUT';

// Side effects
export function login({ email, password }) {
  const headers = { 'X-Key-Inflection': 'camel' };
  const auth = { email, password };
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
    axios
    .post(`${API_URL}/user_token`, { headers, auth })
    .then(({ data }) => data.jwt)
    .then(jwt => {
      localStorage.setItem('token', jwt);
      dispatch({ type: LOGIN_SUCCESS });
      dispatch(push('/'));
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: LOGIN_FAILURE });
    });
  }
}

export function signup({ email, password }) {
  const headers = { 'X-Key-Inflection': 'camel' };
  const user = { email, password };
  return dispatch => {
    dispatch({ type: LOGIN_REQUEST });
    axios
    .post(`${API_URL}/users`, { headers, user })
    .then(() => dispatch(login(user)))
    .catch(err => {
      console.log(err);
      dispatch({ type: LOGIN_FAILURE });
    });
  }
}

export function logout() {
  localStorage.clear('token');
  return { type: LOGOUT };
}

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, loading: false };
    case LOGIN_FAILURE:
      return { ...state, isAuthenticated: false, loading: false };
    case LOGOUT:
      return { ...state, isAuthenticated: false };
    default: return state;
  }
}
