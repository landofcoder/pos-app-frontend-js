// @flow
import { takeEvery, takeLatest, call, put, select } from 'redux-saga/effects';
import * as types from '../constants/authen';
import * as typeRoots from '../constants/root.json';
import { AuthenService, getInfoCashierService } from './services/AuthenService';
import { RECEIVED_DETAIL_OUTLET } from '../constants/root';
import { getDetailOutletService } from './services/CommonService';
import { setMainUrlKey } from '../reducers/db/settings';
import { checkValidateUrlLink } from '../common/settings';

const adminToken = state => state.authenRd.token;

function* loginAction(payload) {
  // Start loading
  yield put({ type: types.START_LOADING });
  try {
    const data = yield call(AuthenService, payload);
    if (data.ok === true) {
      // Set to local storage
      localStorage.setItem(
        types.POS_LOGIN_STORAGE,
        JSON.stringify({ info: payload.payload, token: payload.data })
      );
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

function* logoutAction() {
  yield put({ type: types.LOGOUT_AUTHEN_ACTION });
  yield put({ type: typeRoots.LOGOUT_POS_ACTION });
}

function* takeLatestToken() {
  const adminTokenResult = yield select(adminToken);
  console.log('run to take latest');

  // const cashierInfo = yield call(getInfoCashierService, adminTokenResult);
  // yield put({ type: types.RECEIVED_CASHIER_INFO, payload: cashierInfo });
  //
  // const outletId = cashierInfo.outlet_id;
  //
  // const detailOutlet = yield call(getDetailOutletService, outletId);
  // yield put({ type: RECEIVED_DETAIL_OUTLET, payload: detailOutlet });
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
      payload:
        'Invalid URL Please check the URL for proper spelling and capitalization'
    });
  }
  yield put({ type: types.STOP_LOADING_WORKPLACE });
}

function* getMainUrl() {
  console.log('get url in saga');
}
function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeLatest(types.RECEIVED_TOKEN, takeLatestToken);
  yield takeLatest(types.SET_MAIN_URL, setMainUrl);
  yield takeEvery(types.GET_MAIN_URL, getMainUrl);
}

export default authenSaga;
