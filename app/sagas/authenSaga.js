// @flow
import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import AuthenService from './services/AuthenService';

function* loginAction() {
  // start
  yield put({ type: types.STARTLOADING });

  const data = yield call(AuthenService);

  yield put({ type: types.ACCESS_TOKEN, payload: data });
  // stop
  yield put({ type: types.STOPLOADING });
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
}

export default authenSaga;
