import { combineReducers } from 'redux';
import axios from 'axios';

import auth from './auth';
import valves from './valves';
import sensors from './sensors';

export const API_URL = process.env.REACT_APP_API_URL;

const BEGIN_LOAD = 'BEGIN_LOAD';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
// const LOAD_FAIL = 'LOAD_FAIL';

const fetchBegin = _ => ({ type: BEGIN_LOAD });

const fetchSuccess = ({ sensors, valves }) => ({ type: LOAD_SUCCESS, sensors, valves });

// const fetchError = ({ sensors, valves }) => ({ type: LOAD_FAIL, sensors, valves });

export function hydrate() {
  const token = localStorage.getItem('token');
  const headers = { authorization: `Bearer ${token}`, 'X-Key-Inflection': 'camel' };
  return dispatch => {
    dispatch(fetchBegin());
    axios
    .get(`${API_URL}/devices`, { headers })
    .then(({ data }) => dispatch(fetchSuccess(data)));
  }
}

export default combineReducers({ auth, valves, sensors })
