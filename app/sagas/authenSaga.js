// @flow
import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { AuthenService } from './services/AuthenService';
import { getInfoCashierService } from './services/AuthenService';

function* loginAction(payload) {
  // start
  yield put({ type: types.STARTLOADING });
  try {
    const data = yield call(AuthenService, payload);
    if (typeof data === 'string') {
      let info = yield call(getInfoCashierService, data);
      yield put({ type: types.ACCESS_TOKEN, payload: data });
      yield put({ type: types.SUCCESS_LOGIN });
      yield put({ type: types.CASHIER_INFO, payload: info });
    } else {
      yield put({ type: types.ERROR_LOGIN });
    }
  } catch (err) {
    console.log(err);
  }
  yield put({ type: types.STOPLOADING });
  // stop
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
}

export default authenSaga;
