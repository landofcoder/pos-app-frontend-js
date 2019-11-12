import * as types from '../constants/authen';

export function logout() {
  return {
    type: types.LOGOUT_ACTON
  };
}

export function login(payload) {
  return {
    type: types.LOGIN_ACTION,
    payload
  };
}
