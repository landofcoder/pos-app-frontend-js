// @flow
import { takeEvery, takeLatest, call, put, select } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { AuthenService, getInfoCashierService } from './services/AuthenService';
import { RECEIVED_DETAIL_OUTLET } from '../constants/root';
import { getDetailOutletService } from './services/CommonService';

const adminToken = state => state.authenRd.token;

function* loginAction(payload) {
  // Start loading
  yield put({ type: types.START_LOADING });
  try {
    const data = yield call(AuthenService, payload);
    if (data.ok === true) {
      yield put({ type: types.RECEIVED_TOKEN, payload: data.data });
      yield put({ type: types.SUCCESS_LOGIN });
    } else {
      yield put({ type: types.ERROR_LOGIN });
    }
  } catch (err) {
    console.log(err);
  }
  yield put({ type: types.STOP_LOADING });
  // stop
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
  yield takeLatest(types.RECEIVED_TOKEN, takeLatestToken);
}

export default authenSaga;
