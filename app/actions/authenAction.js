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

export function signInWorkplace(payload){
  return {
    type: types.SIGN_IN_WORKPLACE_ACTION,
    payload
  }
}
