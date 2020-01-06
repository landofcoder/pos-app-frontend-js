// @flow
import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import {
  LOGOUT_POS_ACTION,
  UPDATE_SWITCHING_MODE,
  UPDATE_FLAG_SWITCHING_MODE
} from '../constants/root.json';
import { loginService, createLoggedDb } from './services/LoginService';

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

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
}

export default authenSaga;
