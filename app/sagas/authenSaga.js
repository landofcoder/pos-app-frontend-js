// @flow
import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { AuthenService, getInfoCashierService } from './services/AuthenService';

function* loginAction(payload) {
  // start
  yield put({ type: types.START_LOADING });
  try {
    const data = yield call(AuthenService, payload);
    if (data.ok === true) {
      yield put({ type: types.RECEIVED_TOKEN, payload: data.data });
      yield put({ type: types.SUCCESS_LOGIN });
      const info = yield call(getInfoCashierService, data);
      yield put({ type: types.RECEIVED_CASHIER_INFO, payload: info });
    } else {
      yield put({ type: types.ERROR_LOGIN });
    }
  } catch (err) {
    console.log(err);
  }
  yield put({ type: types.STOP_LOADING });
  // stop
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
}

export default authenSaga;
