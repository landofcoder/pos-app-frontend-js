// @flow
import { takeEvery, takeLatest, call, put, select } from 'redux-saga/effects';
import * as types from '../constants/authen';
import {
  LOGOUT_POS_ACTION,
  RECEIVED_DETAIL_OUTLET,
  UPDATE_SWITCHING_MODE,
  BOOTSTRAP_APPLICATION
} from '../constants/root.json';
import {
  loginService,
  getInfoCashierService,
  createLoggedDb
} from './services/LoginService';
import { getDetailOutletService } from './services/CommonService';

const adminToken = state => state.authenRd.token;

function* loginAction(payload) {
  // Start loading
  yield put({ type: types.START_LOADING });
  try {
    const data = yield call(loginService, payload);
    if (data !== '') {
      yield createLoggedDb({ info: payload.payload, token: data });

      // Call bootstrap application after login
      yield put({ type: BOOTSTRAP_APPLICATION });
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

function* takeLatestToken() {
  const adminTokenResult = yield select(adminToken);

  const cashierInfo = yield call(getInfoCashierService, adminTokenResult);
  yield put({ type: types.RECEIVED_CASHIER_INFO, payload: cashierInfo });

  const outletId = cashierInfo.outlet_id;

  const detailOutlet = yield call(getDetailOutletService, outletId);
  yield put({ type: RECEIVED_DETAIL_OUTLET, payload: detailOutlet });
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeLatest(types.RECEIVED_TOKEN, takeLatestToken);
}

export default authenSaga;
