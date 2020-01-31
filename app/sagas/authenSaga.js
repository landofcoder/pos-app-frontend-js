// @flow
import { takeEvery, call, put, takeLatest, select } from 'redux-saga/effects';
import { differenceInMinutes } from 'date-fns';
import * as types from '../constants/authen';
import {
  LOGOUT_POS_ACTION,
  UPDATE_FLAG_SWITCHING_MODE
} from '../constants/root.json';
import {
  loginService,
  createLoggedDb,
  setMainUrlKey,
  getMainUrlKey,
  getModuleInstalledService,
  deleteLoggedDb,
  getLoggedDb
} from './services/LoginService';
import { updateLoggedToken } from '../reducers/db/settings';

const senseUrl = state => state.authenRd.senseUrl;

function* loginAction(payload) {
  // Start loading
  yield put({ type: types.START_LOADING });
  try {
    const data = yield call(loginService, payload);
    if (data !== '') {
      yield createLoggedDb({ info: payload.payload, token: data });
      yield put({ type: UPDATE_FLAG_SWITCHING_MODE }); // Update flag login to make App reload and background check
    } else {
      yield put({ type: types.ERROR_LOGIN });
    }
  } catch (err) {
    console.log(err);
  }
  yield put({ type: types.STOP_LOADING });
}

function* getNewTokenFromApi(payload) {
  const data = yield call(loginService, payload);
  return data;
}

function* logoutAction() {
  yield put({ type: types.LOGOUT_AUTHEN_ACTION });
  yield deleteLoggedDb({});
  yield put({ type: LOGOUT_POS_ACTION });
  yield put({ type: types.CHECK_LOGIN_BACKGROUND });
}

function* setMainUrl(payload) {
  yield put({ type: types.START_LOADING_WORKPLACE });
  const url = yield call(setMainUrlKey, payload);
  yield put({ type: types.RECEIVED_MAIN_URL, payload: url });
  yield put({ type: types.STOP_LOADING_WORKPLACE });
}

function* getMainUrl() {
  const data = yield call(getMainUrlKey);
  console.log(data);
  if (data.status) {
    yield put({
      type: types.RECEIVED_MAIN_URL,
      payload: data.payload.value.url
    });
  }
}

function* cleanUrlWorkplace() {
  yield put({ type: types.START_LOADING_WORKPLACE });
  yield call(setMainUrlKey, '');
  yield put({ type: types.STOP_LOADING_WORKPLACE });
}

/**
 * Get all module installed or not
 * @returns void
 */
function* getModuleInstalled() {
  // Start loading
  yield put({ type: types.LOADING_MODULE_COMPONENT, payload: true });

  const url = yield select(senseUrl);
  const data = yield call(getModuleInstalledService, url);
  if (data.error) {
    yield put({
      type: types.ERROR_SERVICE_MODULES_INSTALLED,
      payload: true
    });
    yield put({ type: types.RECEIVED_MODULE_INSTALLED, payload: [] });
  } else {
    yield put({
      type: types.ERROR_SERVICE_MODULES_INSTALLED,
      payload: false
    });
    yield put({ type: types.RECEIVED_MODULE_INSTALLED, payload: data.data[0] });
  }

  // Stop loading
  yield put({ type: types.LOADING_MODULE_COMPONENT, payload: false });
}

/**
 * Auto login to get new token
 * @returns void
 */
function* autoLoginToGetNewTokenSaga() {
  const logged = yield getLoggedDb();
  const lastTimeLogin = logged.update_at ? logged.update_at : logged.created_at;
  const minute = differenceInMinutes(new Date(), lastTimeLogin);
  // Auto get login if minute > 120 minutes equivalent 2 hours
  const { username, password } = logged.value.info;
  if (minute > 120) {
    const payload = {
      payload: {
        username,
        password
      }
    };
    const newToken = yield getNewTokenFromApi(payload);
    if (newToken) {
      // Update to new token & indexed db
      window.liveToken = newToken;
      logged.value.token = newToken; // Update before pass to function update
      yield updateLoggedToken(logged);
    }
  }
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeLatest(types.SET_MAIN_URL, setMainUrl);
  yield takeEvery(types.GET_MAIN_URL, getMainUrl);
  yield takeEvery(types.CLEAN_URL_WORKPLACE, cleanUrlWorkplace);
  yield takeLatest(types.GET_MODULE_INSTALLED, getModuleInstalled);
  yield takeEvery(
    types.AUTO_LOGIN_TO_GET_NEW_TOKEN,
    autoLoginToGetNewTokenSaga
  );
}

export default authenSaga;
