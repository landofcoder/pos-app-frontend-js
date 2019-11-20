import * as types from '../constants/authen';

export function logout() {
  return {
    type: types.LOGOUT_ACTION
  };
}

export function login(payload) {
  console.log('in action:');
  console.log(payload);
  return {
    type: types.LOGIN_ACTION,
    payload
  };
}
