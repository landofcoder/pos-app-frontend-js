import { takeEvery, put, select, call } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { SYNC_CLIENT_DATA, GET_LIST_SYNC_ORDER } from '../constants/root.json';
import { syncCustomProductAPI } from './services/product-service';
import { getAllTbl, deleteByKey } from '../reducers/db/sync_customers';
import {
  getAllOrders,
  deleteOrder,
  getOrderById,
  updateOrder
} from '../reducers/db/sync_orders';
import {
  successLoadService,
  failedLoadService,
  getServiceByName,
  getLastUpdateTime
} from '../reducers/db/sync_data_manager';
import { readLoggedDbFromLocal } from './services/login-service';
import { signUpCustomerService } from './services/customer-service';
import { syncOrderService } from './services/cart-service';
import {
  setupFetchingGeneralConfig,
  setupSyncCategoriesAndProducts,
  reloadTokenFromLoggedLocalDB
} from './rootSaga';
import { getAllTblCustomProduct } from '../reducers/db/sync_custom_product';

import { serviceTypeGroupManager } from '../common/sync-group-manager';

const posSystemConfig = state => state.mainRd.generalConfig.common_config;
const cashierInfo = state => state.authenRd.cashierInfo;
const detailOutlet = state => state.mainRd.generalConfig.detail_outlet;

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
const syncManager = state => state.authenRd.syncManager;

function* syncCustomer() {
  const customers = yield getAllTbl();
  let checkAllSync = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const customer of customers) {
    const result = yield call(signUpCustomerService, customer);

    if (result.ok === true) {
      yield deleteByKey(customer.id);
    } else {
      checkAllSync = false;
    }
  }
  if (checkAllSync) {
    yield call(successLoadService, types.CUSTOMERS_SYNC);
  }
}

function* syncCustomProduct() {
  const products = yield call(getAllTblCustomProduct);
  const cashierInfoResult = yield select(cashierInfo);
  const detailOutletResult = yield select(detailOutlet);
  let checkAllSync = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const product of products) {
    const status = yield call(syncCustomProductAPI, {
      cashierInfo: cashierInfoResult,
      product,
      detailOutlet: detailOutletResult
    });
    if (status) {
      // eslint-disable-next-line no-await-in-loop
      yield call(deleteByKey, { name: product.name }); // ? delete or not ?
    } else {
      checkAllSync = false;
    }
  }
  if (checkAllSync) {
    // Add Sync manager success
    yield call(successLoadService, types.CUSTOM_PRODUCT_SYNC);
  }
}

function* syncOrder(id) {
  // if syncOrder call with haven't id means sync all
  if (id) {
    const order = yield getOrderById(id);
    const dataResult = yield call(syncOrderService, order);
    if (dataResult.status === true) {
      yield deleteOrder(order.id);
    } else {
      yield updateOrder(order);
      yield failedLoadService(
        serviceTypeGroupManager(types.SYNC_ORDER_LIST, dataResult)
      );
    }
  } else {
    const orders = yield getAllOrders();
    let checkAllSync = true;
    // eslint-disable-next-line no-restricted-syntax
    for (const order of orders) {
      const dataResult = yield call(syncOrderService, order);

      if (dataResult.status === true) {
        yield deleteOrder(order.id);
      } else {
        checkAllSync = false;
        yield failedLoadService(
          serviceTypeGroupManager(types.SYNC_ORDER_LIST, dataResult)
        );
      }
    }
    if (checkAllSync) {
      yield call(successLoadService, types.SYNC_ORDER_LIST);
    }
  }
}

function* syncAllProduct() {
  yield setupSyncCategoriesAndProducts(); // added sync manager success
  yield call(successLoadService, types.SYNC_ORDER_LIST);
}

function* syncGeneralConfig() {
  yield setupFetchingGeneralConfig();
  // Add Sync manager success
  yield call(successLoadService, types.GENERAL_CONFIG_SYNC);
}

function* getSyncDataFromLocal() {
  const productSyncStatus = yield call(
    getServiceByName,
    types.ALL_PRODUCT_SYNC
  );
  const customerSyncStatus = yield call(getServiceByName, types.CUSTOMERS_SYNC);
  const customProductSyncStatus = yield call(
    getServiceByName,
    types.CUSTOM_PRODUCT_SYNC
  );
  const configSyncStatus = yield call(
    getServiceByName,
    types.GENERAL_CONFIG_SYNC
  );
  const orderSyncStatus = yield call(getServiceByName, types.SYNC_ORDER_LIST);

  // order sync
  yield put({
    type: types.RECEIVED_LIST_SYNC_ORDER,
    payload: orderSyncStatus
  });
  // customer sync
  yield put({
    type: types.RECEIVED_LIST_SYNC_CUSTOMER,
    payload: customerSyncStatus
  });
  // custom product sync
  yield put({
    type: types.RECEIVED_LIST_SYNC_CUSTOM_PRODUCT,
    payload: customProductSyncStatus
  });
  // general config sync
  yield put({
    type: types.RECEIVED_LIST_SYNC_GENERAL_CONFIG,
    payload: configSyncStatus
  });
  // all product sync
  yield put({
    type: types.RECEIVED_LIST_SYNC_ALL_PRODUCT,
    payload: productSyncStatus
  });
}

function* runSyncWithSettingTime() {
  const nowTime = new Date();
  const payload = { payload: null };
  const syncTimeAllProduct = yield getLastUpdateTime(types.ALL_PRODUCT_SYNC);
  const syncTimeCustomProduct = yield getLastUpdateTime(
    types.CUSTOM_PRODUCT_SYNC
  );
  const syncTimeCustomer = yield getLastUpdateTime(types.CUSTOMERS_SYNC);
  const syncTimeGeneralConfig = yield getLastUpdateTime(
    types.GENERAL_CONFIG_SYNC
  );
  const posSystemConfigResult = yield select(posSystemConfig);
  const { time_synchronized_for_modules } = posSystemConfigResult;

  const syncManagerResult = yield select(syncManager);

  // truong hop sync dang hoat dong va chua duoc hoan tat, ham check sync khong nen chay them ham sync them lan nua
  const {
    loadingSyncAllProduct,
    loadingSyncConfig,
    loadingSyncCustomProducts,
    loadingSyncCustomer
  } = syncManagerResult;
  const {
    all_products,
    all_custom_product,
    all_customers_sync,
    general_config_sync
  } = time_synchronized_for_modules;
  if (
    nowTime - syncTimeAllProduct > all_products * 60000 &&
    !loadingSyncAllProduct
  ) {
    console.log('go  auto sync all product');
    payload.payload = types.ALL_PRODUCT_SYNC;
    yield syncClientData(payload);
  }
  if (
    nowTime - syncTimeCustomProduct > all_custom_product * 60000 &&
    !loadingSyncCustomProducts
  ) {
    console.log('go auto sync custom product');
    payload.payload = types.CUSTOM_PRODUCT_SYNC;
    yield syncClientData(payload);
  }
  if (
    nowTime - syncTimeCustomer > all_customers_sync * 60000 &&
    !loadingSyncCustomer
  ) {
    console.log('go  auto sync customer');
    payload.payload = types.CUSTOMERS_SYNC;
    yield syncClientData(payload);
  }
  if (
    nowTime - syncTimeGeneralConfig > general_config_sync * 60000 &&
    !loadingSyncConfig
  ) {
    console.log('go auto sync general config');
    payload.payload = types.GENERAL_CONFIG_SYNC;
    yield syncClientData(payload);
  }
}

/**
 * sync all data from state to server can bind with payload
 * @param {*} payload
 */

function* syncClientData(payload) {
  const isLogged = yield readLoggedDbFromLocal();
  if (!isLogged) return null;
  const payloadType = payload.payload;

  if (payloadType) {
    yield reloadTokenFromLoggedLocalDB();
  }

  switch (payloadType) {
    case types.ALL_PRODUCT_SYNC:
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.ALL_PRODUCT_SYNC, status: true }
      });
      try {
        yield syncAllProduct();
      } catch (e) {
        console.log(e);
        yield failedLoadService(
          serviceTypeGroupManager(types.ALL_PRODUCT_SYNC, e)
        );
      }
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.ALL_PRODUCT_SYNC, status: false }
      });
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.CUSTOM_PRODUCT_SYNC, status: true }
      });
      try {
        yield syncCustomProduct(); // added sync manager success
      } catch (e) {
        console.log(e);
        yield failedLoadService(
          serviceTypeGroupManager(types.CUSTOM_PRODUCT_SYNC, e)
        );
      }
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.CUSTOM_PRODUCT_SYNC, status: false }
      });
      break;
    case types.CUSTOMERS_SYNC:
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.CUSTOMERS_SYNC, status: true }
      });
      try {
        yield syncCustomer(); // added sync manager success
      } catch (e) {
        console.log(e);
        yield failedLoadService(
          serviceTypeGroupManager(types.CUSTOMERS_SYNC, e)
        );
      }
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.CUSTOMERS_SYNC, status: false }
      });
      break;
    case types.GENERAL_CONFIG_SYNC:
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.GENERAL_CONFIG_SYNC, status: true }
      });
      try {
        yield syncGeneralConfig();
      } catch (e) {
        console.log(e);
        yield failedLoadService(
          serviceTypeGroupManager(types.GENERAL_CONFIG_SYNC, e)
        );
      }
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.GENERAL_CONFIG_SYNC, status: false }
      });
      break;
    case types.SYNC_ORDER_LIST:
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.SYNC_ORDER_LIST, status: true }
      });
      try {
        yield syncOrder(payload.id); // added sync manager success
      } catch (e) {
        console.log(e);
        yield failedLoadService(
          serviceTypeGroupManager(types.SYNC_ORDER_LIST, e)
        );
      }
      yield put({
        type: types.LOADING_SYNC_ACTION,
        payload: { type: types.SYNC_ORDER_LIST, status: false }
      });
      break;
    default:
      yield runSyncWithSettingTime();
      break;
  }

  // reupdate sync manager from localdb to reducer
  if (payloadType) {
    yield getSyncDataFromLocal();
  }
}

function* cronSaga() {
  yield takeEvery(SYNC_CLIENT_DATA, syncClientData);
  yield takeEvery(types.GET_SYNC_DATA_FROM_LOCAL, getSyncDataFromLocal);
  yield takeEvery(GET_LIST_SYNC_ORDER, getListSyncOrder);
}

export default cronSaga;
