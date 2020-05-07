import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { LOGIN_FORM } from '../constants/main-panel-types.json';
import {
  deleteLoggedDb,
  getAppInfoService,
  writeAppInfoToLocal,
  writeLastTimeLogoutToLocal
} from './services/login-service';
import { setAppInfoToGlobal } from '../common/settings';

function* logoutAction() {
  // Update view to login_form
  yield put({ type: types.UPDATE_SWITCHING_MODE, payload: LOGIN_FORM });
  yield writeLastTimeLogoutToLocal();
  yield deleteLoggedDb();
}

/**
 * get all data from localdb to state
 * @param {*} payloadParams
 */
function* getAppByTokenSg(payloadParams) {
  yield put({ type: types.START_LOADING_GET_APP_INFO });

  const { payload } = payloadParams;
  const result = yield call(getAppInfoService, payload);
  if (!result.message) {
    const { getApp } = result.data;
    yield put({
      type: types.RECEIVED_APP_INFO,
      payload: getApp
    });

    // Set app info to global
    yield setAppInfoToGlobal(getApp);

    // Write app info to local
    yield writeAppInfoToLocal(getApp);

    // Update view to login_form
    yield put({ type: types.UPDATE_SWITCHING_MODE, payload: LOGIN_FORM });
  } else {
    yield put({
      type: types.GET_APP_INFO_FAILURE,
      payload: 'Invalid Token, please try again.'
    });
  }

  yield put({ type: types.STOP_LOADING_GET_APP_INFO });
}

function* authenSaga() {
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeEvery(types.GET_APP_BY_TOKEN, getAppByTokenSg);
}

export default authenSaga;
