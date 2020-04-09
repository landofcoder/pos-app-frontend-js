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

export function setPlatformWorkPlace(payload) {
  return {
    type: types.SET_PLATFORM,
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

export function changeWorkPlaceInput(payload) {
  return {
    type: types.CHANGE_TOKEN_INPUT_WORKPLACE,
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

export function getAppByToken(payload) {
  return {
    type: types.GET_APP_BY_TOKEN,
    payload
  };
}

export function getPlatformWorkPlace() {
  return {
    type: types.GET_PLATFORM
  };
}
