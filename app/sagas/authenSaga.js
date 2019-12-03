// @flow
import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import AuthenService from './services/AuthenService';

function* loginAction(payload) {
  // start
  yield put({ type: types.STARTLOADING });
  try {
    console.log('step 0.1');
    const data = yield call(AuthenService, payload);
    console.log('step 10');
    if (typeof data === 'string') {
      console.log('got token');
      console.log(data);
      yield put({ type: types.ACCESS_TOKEN, payload: data });
      yield put({ type: types.SUCCESS_LOGIN });
    } else {
      console.log('wrong pass word or user name');
      console.log(data);
      yield put({ type: types.ERROR_LOGIN });
    }
  } catch (err) {
    console.log('ERROR');
    console.log(err);
  }
  yield put({ type: types.STOPLOADING });
  // stop
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
}

export default authenSaga;
