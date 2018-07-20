import { combineReducers } from 'redux';
import valves from './valves';
import sensors from './sensors';

let SENSORS = [
  { name: 'ss-1', id: 0, valveId: 0 },
  { name: 'esp8266', id: 1, valveId: 0 },
  // { name: 'Sensor 3', id: 2, valveId: 0 },
  // { name: 'Sensor 4', id: 3, valveId: 1 },
  // { name: 'Sensor 5', id: 4, valveId: 1 },
  // { name: 'Sensor 6', id: 5, valveId: 1 },
  // { name: 'Sensor 7', id: 6, valveId: 2 },
  // { name: 'Sensor 8', id: 7, valveId: 2 },
  // { name: 'Sensor 9', id: 8, valveId: 2 },
];

let VALVES = [
  { name: 'proto_valve', id: 0, isOpen: false },
  // { name: 'Valve 2', id: 1, isOpen: false },
  // { name: 'Valve 3', id: 2, isOpen: false },
];

const BEGIN_LOAD = 'BEGIN_LOAD';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
// const LOAD_FAIL = 'LOAD_FAIL';

const fetchBegin = _ => ({ type: BEGIN_LOAD });

const fetchSuccess = ({ sensors, valves }) => ({ type: LOAD_SUCCESS, sensors, valves });

// const fetchError = ({ sensors, valves }) => ({ type: LOAD_FAIL, sensors, valves });

export function hydrate() {
  return dispatch => {
    return new Promise((resolve) => {
      dispatch(fetchBegin());
      dispatch(fetchSuccess({ sensors: SENSORS, valves: VALVES }));
      setTimeout(() => resolve(), 1000);
    });
  }
}

export default combineReducers({ valves, sensors })
