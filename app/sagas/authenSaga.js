// @flow
import { takeEvery, call } from 'redux-saga/effects';
import * as types from '../constants/authen';
import AuthenService from './services/AuthenService';

function* loginAction() {
  const data = yield call(AuthenService);
  console.log(data);
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
}

export default authenSaga;
