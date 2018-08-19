import axios from 'axios';

import { API_URL } from './index';

export const ALL = 'all';
export const OPEN = 'open';
export const CLOSED = 'closed';
// Action types
const SET_FILTER = 'SET_FILTER';
const BEGIN_LOAD = 'BEGIN_LOAD';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_FAIL = 'LOAD_FAIL';
const BEGIN_CREATE = 'valves/BEGIN_CREATE';
const BEGIN_UPDATE = 'valves/BEGIN_UPDATE';
const CREATE_FAIL = 'valves/CREATE_FAIL';
const CREATE = 'valves/CREATE';
const UPDATE = 'valves/UPDATE';
const REMOVE = 'valves/REMOVE';
const LOGOUT = 'auth/LOGOUT';

// selectors
export const getValves = state => state.valves.items;
export const getVisibilityFilter = state => state.valves.visibilityFilter;
export const isUpdating = state => state.valves.updating;
export const isCreating = state => state.valves.creating;
export const isUpdatingId = (state, id) => state.valves.updating && (state.valves.updatingId === id);
export const getValve = (state, id) => state.valves.items.find(v => v.id === id);
export const isLoading = state => state.valves.loading;

export function getAverage(state, id) {
  const sensors = state.sensors.items.filter(s => s.valveId === id);
  if (!sensors.length) return null;
  const sum = sensors.reduce((total, s) => total + s.moisture, 0);
  debugger
  return Math.floor(sum / sensors.length);
}

export function getVisibleValves(state) {
  const valves = getValves(state);
  switch (getVisibilityFilter(state)) {
    case OPEN:
      return valves.filter(v => v.isOpen);
    case CLOSED:
      return valves.filter(v => !v.isOpen);
    case ALL:
    default:
      return valves;
  }
}

const initialState = {
  items: [],
  loading: false,
  error: null,
  visibilityFilter: ALL,
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, visibilityFilter: action.filter };
    case BEGIN_LOAD:
      return { ...state, loading: true, error: null };
    case BEGIN_UPDATE:
      return { ...state, updating: true, error: null, updatingId: action.id };
    case BEGIN_CREATE:
      return { ...state, creating: true };
    case LOAD_FAIL:
      return { ...state, loading: false, error: action.valves, items: [] };
    case LOAD_SUCCESS:
      return { ...state, loading: false, error: null, items: action.valves };
    case CREATE:
      return { ...state, creating: false, error: null, items: [...state.items, action.valve] };
    case CREATE_FAIL:
      return { ...state, creating: false, error: action.error };
    case UPDATE:
      return { ...state, updating: false, error: null, items: [...state.items.filter(v => v.id !== action.valve.id), action.valve] };
    case LOGOUT:
      return initialState;
    default: return state;
  }
}

// Action Creators
function createValveSuccess(valve) {
  return { type: CREATE, valve };
}

function updateValveSuccess(valve) {
  return { type: UPDATE, valve };
}

export function removeValve(id) {
  return { type: REMOVE, id };
}

export function setVisibilityFilter(filter) {
  return { type: SET_FILTER, filter };
}

// Side effects
export function createValve({ name, serial }) {
  return (dispatch, getState) => {
    dispatch({ type: BEGIN_CREATE });
    // API call
    const token = localStorage.getItem('token');
    const headers = { authorization: `Bearer ${token}`, 'X-Key-Inflection': 'camel' };
    const valve = { name, serial };
    return axios
      .post(`${API_URL}/valves`, { valve }, { headers })
      .then(({ data }) => dispatch(createValveSuccess(data)))
      .catch(error => dispatch({ type: CREATE_FAIL, error }));
  }
}

export function toggleValve({ id, isOpen }) {
  return (dispatch, getState) => {
    dispatch({ type: BEGIN_UPDATE, id });
    // API call
    const target = getState().valves.items.find(v => v.id === id);
    const updatedValve = { ...target, isOpen };
    // success
    setTimeout(() => dispatch(updateValveSuccess(updatedValve)), 500);
  }
}
