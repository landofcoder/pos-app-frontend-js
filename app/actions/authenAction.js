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

export function checkLoginBackground() {
  return {
    type: types.CHECK_LOGIN_BACKGROUND
  };
}

export function getAppByToken(payload) {
  return {
    type: types.GET_APP_BY_TOKEN,
    payload
  };
}

export function validateLicense() {
  return {
    type: types.VALIDATE_LICENSE
  };
}
