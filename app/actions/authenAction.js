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

export function checkLogin(localState, token) {
  if (
    localState.getItem('loginAvailable') === '' ||
    localState.getItem('loginAvailable') === null
  ) {
    if (token !== '') {
      console.log('have token');
      console.log(token);
      localStorage.setItem('loginAvailable', token);
      return false;
    }
    return true;
  }
  return false;
}
