import { takeEvery, call, put } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { SYNC_CLIENT_DATA, GET_LIST_SYNC_ORDER } from '../constants/root.json';
import { LOGIN_FORM } from '../constants/main-panel-types.json';
import {
  deleteLoggedDb,
  getAppInfoService,
  writeAppInfoToLocal,
  writeLastTimeLogoutToLocal
} from './services/login-service';
import {
  getTimeSyncConstant,
  resetTimeSyncConstant
} from './services/settings-service';
import { setAppInfoToGlobal } from '../common/settings';
import { syncCustomProductService } from './services/product-service';
import { getAllTbl, deleteByKey } from '../reducers/db/sync_customers';
import { getAllTblCustomProduct } from '../reducers/db/sync_custom_product';
import { getAllOrders, deleteOrder } from '../reducers/db/sync_orders';
import { signUpCustomerService } from './services/customer-service';
import { syncOrderService } from './services/cart-service';
import {
  setupFetchingAppInfo,
  setupSyncCategoriesAndProducts,
  getDefaultDataFromLocal
} from './rootSaga';
function* logoutAction() {
  // Update view to login_form
  yield put({ type: types.UPDATE_SWITCHING_MODE, payload: LOGIN_FORM });
  yield writeLastTimeLogoutToLocal();
  yield deleteLoggedDb();
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
      if (dataResult.status === true) {
        console.log('completed sync orders');
        yield deleteOrder(data[i].id);
      } else {
        console.log(dataResult);
      }
    }
  }
}
/**
 * sync all data from state to server can bind with payload
 * @param {*} payload
 */
function* syncClientData(payload) {
  const payloadType = payload.payload;
  const dbTime = yield getTimeSyncConstant();
  const nowTime = Date.now();
  console.log(payloadType);
  switch (payloadType) {
    case types.ALL_PRODUCT_SYNC:
      console.log('sync all product service');
      try {
        yield setupSyncCategoriesAndProducts();
      } catch (e) {
        console.log(e);
      }
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      console.log('sync custom product service');
      try {
        yield syncCustomProduct();
      } catch (e) {
        console.log(e);
      }
      break;
    case types.CUSTOMERS_SYNC:
      console.log('sync customers product service');
      try {
        yield syncCustomer();
      } catch (e) {
        console.log(e);
      }
      break;
    case types.GENERAL_CONFIG_SYNC:
      console.log('sync config service');
      try {
        yield setupFetchingAppInfo();
      } catch (e) {
        console.log(e);
      }
      break;
    case types.SYNC_ORDER_LIST:
      console.log('sync order list service');
      break;
    default:
      if (nowTime - dbTime > 1200000 || payloadType === true) {
        yield put({ type: types.STATUS_SYNC, payload: true });
        yield resetTimeSyncConstant();
        yield syncCustomProduct();
        yield syncCustomer();
        yield syncOrder();
        yield put({ type: types.STATUS_SYNC, payload: false });
        yield put({ type: GET_LIST_SYNC_ORDER });
      }
  }
}

function* getListSyncOrder() {
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

/**
 * get all data from localdb to state
 * @param {*} payloadParams
 */
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
      payload: 'Invalid Token, please try again.'
    });
  }

  yield put({ type: types.STOP_LOADING_GET_APP_INFO });
}

function* authenSaga() {
  yield takeEvery(types.LOGOUT_ACTION, logoutAction);
  yield takeEvery(SYNC_CLIENT_DATA, syncClientData);
  yield takeEvery(GET_LIST_SYNC_ORDER, getListSyncOrder);
  yield takeEvery(types.GET_APP_BY_TOKEN, getAppByTokenSg);
}

export default authenSaga;
