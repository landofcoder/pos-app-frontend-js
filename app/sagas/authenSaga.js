import { takeEvery, call, put, takeLatest, select } from 'redux-saga/effects';
import { differenceInMinutes } from 'date-fns';
import * as types from '../constants/authen';
import {
  LOGOUT_POS_ACTION,
  UPDATE_FLAG_SWITCHING_MODE,
  SYNC_CLIENT_DATA,
  GET_SYNC_MANAGER
} from '../constants/root.json';
import { LOGIN_FORM } from '../constants/main-panel-types.json';
import {
  loginService,
  writeLoggedInfoToLocal,
  setMainUrlKey,
  getModuleInstalledService,
  deleteLoggedDb,
  getLoggedDb,
  getAppInfoService,
  writeAppInfoToLocal
} from './services/login-service';
import {
  getTimeSyncConstant,
  resetTimeSyncConstant
} from './services/settings-service';
import { setAppInfoToGlobal, setTokenGlobal } from '../common/settings';
import { syncCustomProductService } from './services/product-service';
import { getAllTbl, deleteByKey } from '../reducers/db/sync_customers';
import { getAllTblCustomProduct } from '../reducers/db/sync_custom_product';
import { getAllOrders, deleteOrder } from '../reducers/db/sync_orders';
import { signUpCustomerService } from './services/customer-service';
import { updateLoggedToken } from '../reducers/db/settings';
import { syncOrderService } from './services/cart-service';

const urlTokenService = state => state.authenRd.urlTokenService;

function* loginAction(payload) {
  // Start loading
  yield put({ type: types.START_LOADING });
  try {
    const resultLogin = yield call(loginService, payload);
    console.log('result login:', resultLogin);
    const token = resultLogin.data;
    setTokenGlobal(token);

    if (resultLogin.status) {
      yield writeLoggedInfoToLocal({
        info: payload.payload,
        token: resultLogin.data
      });
      yield put({ type: UPDATE_FLAG_SWITCHING_MODE });
    } else {
      yield put({ type: types.ERROR_LOGIN, payload: resultLogin.message });
      // Set login button loading to false
      yield put({ type: types.STOP_LOADING });
    }
  } catch (err) {
    console.log(err);
  }
}

function* getNewTokenFromApi(payload) {
  const resultLogin = yield call(loginService, payload);
  return resultLogin.data;
}

function* logoutAction() {
  yield put({ type: types.LOGOUT_AUTHEN_ACTION });
  yield deleteLoggedDb({});
  yield put({ type: LOGOUT_POS_ACTION });
  yield put({ type: types.CHECK_LOGIN_BACKGROUND });
}

function* cleanUrlWorkplace() {
  yield put({ type: types.START_LOADING_GET_APP_INFO });
  yield call(setMainUrlKey, '');
  yield put({ type: types.RECEIVED_MODULE_INSTALLED, payload: {} });
  yield put({ type: types.STOP_LOADING_GET_APP_INFO });
}

/**
 * Get all module installed or not
 * @returns void
 */
function* getModuleInstalled() {
  // Start loading
  yield put({ type: types.LOADING_MODULE_COMPONENT, payload: true });
  const urlResult = yield select(urlTokenService);
  const data = yield call(getModuleInstalledService, urlResult);
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
export function* getNewToken() {
  const logged = yield getLoggedDb();
  if (logged) {
    const lastTimeLogin = logged.update_at
      ? logged.update_at
      : logged.created_at;
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
}

function* syncCustomer() {
  const data = yield getAllTbl();
  for (let i = 0; i < data.length; i += 1) {
    const result = yield call(signUpCustomerService, data[i]);
    if (result.ok === true) {
      yield deleteByKey(data[i].id);
    }
  }
}

function* syncCustomProduct() {
  yield call(syncCustomProductService);
}

function* syncOrder() {
  const data = yield getAllOrders();
  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const dataResult = yield call(syncOrderService, data[i]);
      if (!dataResult.errors && !dataResult.message) {
        console.log('completed sync orders');
        yield deleteOrder(data[i].id);
      } else {
        console.log(dataResult);
      }
    }
  }
}

function* syncClientData(payload) {
  const dbTime = yield getTimeSyncConstant();
  const nowTime = Date.now();
  if (nowTime - dbTime > 1200000 || payload.payload === true) {
    yield put({ type: types.CHANGE_STATUS_SYNC, payload: true });
    yield resetTimeSyncConstant();
    yield syncCustomProduct();
    yield syncCustomer();
    yield syncOrder();
    yield put({ type: types.CHANGE_STATUS_SYNC, payload: false });
    yield put({ type: GET_SYNC_MANAGER });
  }
}

function* autoLoginToGetNewTokenSaga() {
  yield getNewToken();
}

function* getListSyncManager() {
  // get all order in local db
  const payloadResultOrder = yield getAllOrders();
  yield put({
    type: types.RECEIVED_LIST_SYNC_ORDER,
    payload: payloadResultOrder
  });
  // get all custom product in local db
  const payloadResultCustomProduct = yield getAllTblCustomProduct();
  yield put({
    type: types.RECEIVED_LIST_SYNC_CUSTOM_PRODUCT,
    payload: payloadResultCustomProduct
  });
  // get all customer in local db
  const payloadResultCustomer = yield getAllTbl();
  yield put({
    type: types.RECEIVED_LIST_SYNC_CUSTOMER,
    payload: payloadResultCustomer
  });
}

function* getAppByTokenSg(payloadParams) {
  yield put({ type: types.START_LOADING_GET_APP_INFO });

  const { payload } = payloadParams;
  const result = yield call(getAppInfoService, payload);
  const getAppResult = result.data.getApp;
  if (getAppResult) {
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
      payload: 'Invalid Token, please try again!'
    });
  }

  yield put({ type: types.STOP_LOADING_GET_APP_INFO });
}

function* authenSaga() {
  yield takeEvery(types.LOGIN_ACTION, loginAction);
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeEvery(types.CLEAN_URL_WORKPLACE, cleanUrlWorkplace);
  yield takeLatest(types.GET_MODULE_INSTALLED, getModuleInstalled);
  yield takeEvery(
    types.AUTO_LOGIN_TO_GET_NEW_TOKEN,
    autoLoginToGetNewTokenSaga
  );
  yield takeEvery(SYNC_CLIENT_DATA, syncClientData);
  yield takeEvery(GET_SYNC_MANAGER, getListSyncManager);
  yield takeEvery(types.GET_APP_BY_TOKEN, getAppByTokenSg);
}

export default authenSaga;
