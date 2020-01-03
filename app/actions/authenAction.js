import * as types from '../constants/authen';

export function logout() {
  return {
    type: types.LOGOUT_ACTION
  };
}

export function login(payload) {
  return {
    type: types.LOGIN_ACTION,
    payload
  };
}

export function updateSwitchingMode(payload) {
  return {
    type: types.UPDATE_SWITCHING_MODE,
    payload
  };
}
