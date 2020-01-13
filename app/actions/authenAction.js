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

export function signInWorkplace(payload) {
  return {
    type: types.SIGN_IN_WORKPLACE_ACTION,
    payload
  };
}

export function updateSwitchingMode(payload) {
  return {
    type: types.UPDATE_SWITCHING_MODE,
    payload
  };
}

export function getMainUrlWorkPlace() {
  return {
    type: types.GET_MAIN_URL
  };
}

export function setMainUrlWorkPlace(payload) {
  return {
    type: types.SET_MAIN_URL,
    payload
  };
}

export function learnUrlWorkPlace() {
  return {
    type: types.CLEAN_URL_WORKPLACE
  };
}

export function checkLoginBackground() {
  return {
    type: types.CHECK_LOGIN_BACKGROUND
  };
}

export function errorSignInWorkPlaceMessage(payload) {
  return {
    type: types.ERROR_URL_WORKPLACE,
    payload
  };
}

export function changeUrlInputWorkplace(payload) {
  return {
    type: types.CHANGE_URL_INPUT_WORKPLACE,
    payload
  };
}

export function setDefaultProtocolWorkplace(payload) {
  return {
    type: types.SET_DEFAULT_PROTOCOL_WORKPLACE,
    payload
  };
}

export function getModuleInstalled() {
  return {
    type: types.GET_MODULE_INSTALLED
  };
}
