import axios from 'axios';

import { API_URL } from './index';

// action types
const BEGIN_LOAD = 'BEGIN_LOAD';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_FAIL = 'LOAD_FAIL';
const BEGIN_CREATE = 'sensors/BEGIN_CREATE';
const BEGIN_UPDATE = 'sensors/BEGIN_UPDATE';
const CREATE = 'sensors/CREATE';
const CREATE_FAIL = 'valves/CREATE_FAIL';
const UPDATE = 'sensors/UPDATE';
const REMOVE = 'sensors/REMOVE';
const UPDATE_MOISTURE = 'sensors/UPDATE_MOISTURE';
const LOGOUT = 'auth/LOGOUT';

// selectors
export function getSensors(state, valveId) {
  if (!valveId) return state.sensors.items;
  return state.sensors.items.filter(s => s.valveId === valveId);
}

export function getSensor(state, id) {
  return state.sensors.items.find(s => s.id === id);
}

export function getAverage(state, valveId) {
  const sensors = getSensors(state, valveId);
  if (!sensors.length) return null;
  const sum = sensors.reduce((acc, s) => acc + s.moisture, 0);
  return Math.floor(sum / sensors.length);
};

// Action Creators
export function createSensorSuccess(sensor) {
  return { type: CREATE, sensor };
}

export function updateSensorSuccess(sensor) {
  return { type: UPDATE, sensor };
}

export function removeSensor(id) {
  return { type: REMOVE, id };
}

// Side effects
export function createSensor({ name, serial }) {
  return (dispatch, getState) => {
    dispatch({ type: BEGIN_CREATE });
    // API call
    const token = localStorage.getItem('token');
    const headers = { authorization: `Bearer ${token}`, 'X-Key-Inflection': 'camel' };
    const sensor = { name, serial };
    return axios
      .post(`${API_URL}/sensors`, { sensor }, { headers })
      .then(({ data }) => dispatch(createSensorSuccess(data)))
      .catch(error => dispatch({ type: CREATE_FAIL, error }));
  }
}

export function updateSensor({ id, valveId }) {
  return (dispatch, getState) => {
    dispatch({ type: BEGIN_UPDATE });
    // API call
    const target = getState().sensors.items.find(s => s.id === id);
    const updatedSensor = { ...target, valveId };
    // add new valve to state
    setTimeout(() => dispatch(updateSensorSuccess(updatedSensor)), 500);
  }
}

export function updateMoisture({ id, moisture, timestamp }) {
  return (dispatch, getState) => {
    if (getSensor(getState(), id).timestamp === timestamp) return;
    dispatch({ type: UPDATE_MOISTURE, id, moisture, timestamp });
  }
}

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case BEGIN_LOAD:
      return { ...state, loading: true, error: null };
    case BEGIN_CREATE:
      return { ...state, creating: true };
    case BEGIN_UPDATE:
      return { ...state, updating: true };
    case LOAD_FAIL:
      return { ...state, loading: false, error: action.sensors, items: [] };
    case LOAD_SUCCESS:
      return { ...state, loading: false, error: null, items: action.sensors };
    case CREATE:
      return { ...state, creating: false, error: null, items: [...state.items, action.sensor] };
    case CREATE_FAIL:
      return { ...state, creating: false, error: action.error };
    case UPDATE:
      return { ...state, updating: false, error: null, items: [...state.items.filter(s => s.id !== action.sensor.id), action.sensor] };
    case UPDATE_MOISTURE:
      const target = state.items.find(s => s.id === action.id);
      const updatedSensor = { ...target, moisture: action.moisture, timestamp: action.timestamp };
      return { ...state, items: [...state.items.filter(s => s.id !== action.id), updatedSensor] };
    case LOGOUT:
      return initialState;
    default: return state;
  }
}
