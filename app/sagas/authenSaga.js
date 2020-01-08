// @flow
import { takeEvery, call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../constants/authen';
import {
  LOGOUT_POS_ACTION,
  UPDATE_SWITCHING_MODE,
  UPDATE_FLAG_SWITCHING_MODE
} from '../constants/root.json';
import {
  loginService,
  createLoggedDb,
  setMainUrlKey,
  getMainUrlKey
} from './services/LoginService';
import { checkValidateUrlLink } from '../common/settings';

function* loginAction(payload) {
  // Start loading
  yield put({ type: types.START_LOADING });
  try {
    const data = yield call(loginService, payload);
    if (data !== '') {
      yield createLoggedDb({ info: payload.payload, token: data });
      // Update flag login to make App reload and background check
      yield put({ type: UPDATE_FLAG_SWITCHING_MODE });
    } else {
      yield put({ type: types.ERROR_LOGIN });
    }
  } catch (err) {
    console.log(err);
  }
  yield put({ type: types.STOP_LOADING });
  // stop
}

function* logoutAction() {
  yield put({ type: UPDATE_SWITCHING_MODE, payload: 'LoginForm' });
  yield put({ type: types.LOGOUT_AUTHEN_ACTION });
  yield put({ type: LOGOUT_POS_ACTION });
}

function* setMainUrl(payload) {
  const validUrl = checkValidateUrlLink(payload.payload);
  yield put({ type: types.START_LOADING_WORKPLACE });
  if (validUrl) {
    const url = yield call(setMainUrlKey, payload);
    yield put({ type: types.RECEIVED_MAIN_URL, payload: url });
  } else {
    yield put({
      type: types.ERROR_URL_WORKPLACE,
      payload: 'Invalid URL, please try again!'
    });
  }
  yield put({ type: types.STOP_LOADING_WORKPLACE });
}

function* getMainUrl() {
  const data = yield call(getMainUrlKey);
  if (data.status) {
    yield put({ type: types.RECEIVED_MAIN_URL, payload: data.payload.url });
  }
}

function cleanUrlWorkplace() {}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeLatest(types.SET_MAIN_URL, setMainUrl);
  yield takeEvery(types.GET_MAIN_URL, getMainUrl);
  yield takeEvery(types.CLEAN_URL_WORKPLACE, cleanUrlWorkplace);
}

export default authenSaga;
