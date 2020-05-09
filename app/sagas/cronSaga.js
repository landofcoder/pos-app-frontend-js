import { takeEvery, put, select, call } from 'redux-saga/effects';
import * as types from '../constants/authen';
import {
  SYNC_CLIENT_DATA,
  GET_SYNC_DATA_FROM_LOCAL,
  GET_SYNC_STATUS_FROM_LOCAL
} from '../constants/root.json';
import { syncCustomProductAPI } from './services/product-service';
import { getAllTbl, updateCustomerById } from '../reducers/db/sync_customers';
import {
  getAllTblCustomProduct,
  updateCustomProductById
} from '../reducers/db/sync_custom_product';

import {
  getAllOrders,
  getOrderById,
  updateOrderById
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

import { serviceTypeGroupManager } from '../common/sync-group-manager';

const posSystemConfig = state => state.mainRd.generalConfig.common_config;
const cashierInfo = state => state.authenRd.cashierInfo;
const detailOutlet = state => state.mainRd.generalConfig.detail_outlet;

function* getSyncDataFromLocal() {
  // get all order in local db
  const payloadResultOrder = yield getAllOrders();
  yield put({
    type: types.RECEIVED_DATA_SYNC_ORDER,
    payload: payloadResultOrder
  });
  // get all custom product in local db
  const payloadResultCustomProduct = yield getAllTblCustomProduct();
  yield put({
    type: types.RECEIVED_DATA_SYNC_CUSTOM_PRODUCT,
    payload: payloadResultCustomProduct
  });
  // get all customer in local db
  const payloadResultCustomer = yield getAllTbl();
  yield put({
    type: types.RECEIVED_DATA_SYNC_CUSTOMER,
    payload: payloadResultCustomer
  });
}
const syncManager = state => state.authenRd.syncManager;

function* syncCustomer() {
  let checkAllSync = 0;
  const customers = yield getAllTbl();
  // eslint-disable-next-line no-restricted-syntax
  for (const customer of customers) {
    // eslint-disable-next-line no-continue
    if (customer.status) continue;
    // moi lan dong bo 1 customer neu bi loi van phai dong bo cac customer khac
    try {
      const result = yield call(signUpCustomerService, customer);
      if (result || result.status) {
        // thay vi su dung delete thi su dung update
        customer.success = true;
        // yield deleteCustomerById(customer.id);
        yield updateCustomerById(customer);
      } else {
        // eslint-disable-next-line no-throw-literal
        throw { message: 'No response' };
      }
    } catch (e) {
      checkAllSync += 1;
      // cap nhat trang thai tren table customers
      customer.success = false;
      customer.message = e.message;
      customer.dataErrors = e.data;
      yield updateCustomerById(customer);
    }
  }
  if (!checkAllSync) {
    yield call(successLoadService, types.CUSTOMERS_SYNC);
  } else {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: 'Can not resolve sync all customer',
      errors: checkAllSync
    };
  }
}

function* syncCustomProduct() {
  const products = yield call(getAllTblCustomProduct);
  const cashierInfoResult = yield select(cashierInfo);
  const detailOutletResult = yield select(detailOutlet);
  let checkAllSync = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const product of products) {
    // eslint-disable-next-line no-continue
    if (product.status) continue;

    try {
      const result = yield call(syncCustomProductAPI, {
        cashierInfo: cashierInfoResult,
        product,
        detailOutlet: detailOutletResult
      });
      if (result || result.status) {
        product.status = true;
        yield updateCustomProductById(product);
      } else {
        // eslint-disable-next-line no-throw-literal
        throw { message: 'No response', errors: checkAllSync };
      }
    } catch (e) {
      checkAllSync += 1;
      // cap nhat trang thai tren table customers
      product.success = false;
      product.message = e.message;
      product.dataErrors = e.data;
      yield updateCustomProductById(product);
    }
  }
  if (!checkAllSync) {
    // Add Sync manager success
    yield call(successLoadService, types.CUSTOM_PRODUCT_SYNC);
  } else {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: 'Can not resolve sync all customer',
      errors: checkAllSync
    };
  }
}

function* syncOrder(orderId) {
  // if syncOrder call with haven't id means sync all
  const payload = {};
  // step 1: sync custom product first
  payload.payload = types.CUSTOM_PRODUCT_SYNC;
  yield syncClientData(payload);
  // step 2: sync customer second
  payload.payload = types.CUSTOMERS_SYNC;
  yield syncClientData(payload);
  // step 3: next step

  if (orderId) {
    const order = yield getOrderById(orderId);
    try {
      const orderResult = yield call(syncOrderService, order);
      if (orderResult.message || orderResult.errors || !orderResult.status) {
        // eslint-disable-next-line no-throw-literal
        throw {
          message: orderResult.message || 'Cannot sync order',
          data: orderResult.data
        };
      } else {
        // not delete the order
        order.success = true;
        yield updateOrderById(order);
      }
    } catch (e) {
      order.success = false;
      order.message = e.message;
      order.dataErrors = e.data;
      yield updateOrderById(order);
    }
  } else {
    const orders = yield getAllOrders();
    let checkAllSync = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const order of orders) {
      // eslint-disable-next-line no-continue
      if (order.status) continue;
      try {
        const result = yield call(syncOrderService, order);

        if (!result.status || result.message || result.errors) {
          checkAllSync += 1;
          // eslint-disable-next-line no-throw-literal
          throw {
            message: result.message || 'Cannot sync order',
            data: result.data || result.errors || result
          };
        } else {
          order.success = true;
          yield updateOrderById(order);
        }
      } catch (e) {
        order.success = false;
        order.message = e.message;
        order.dataErrors = e.data;
        yield updateOrderById(order);
      }
    }

    if (!checkAllSync) {
      yield call(successLoadService, types.SYNC_ORDER_LIST);
    } else {
      // eslint-disable-next-line no-throw-literal
      throw { message: 'Cannot sync all order', errors: checkAllSync };
    }
  }
}

function* syncAllProduct() {
  yield setupSyncCategoriesAndProducts(); // added sync manager success
  yield call(successLoadService, types.ALL_PRODUCT_SYNC);
}

function* syncGeneralConfig() {
  try {
    yield setupFetchingGeneralConfig();
  } catch (e) {
    // eslint-disable-next-line no-throw-literal
    throw { message: e.message || 'Server not Response', data: e.data };
  }
  // Add Sync manager success
  yield call(successLoadService, types.GENERAL_CONFIG_SYNC);
}

function* getSyncStatusFromLocal() {
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
    type: types.RECEIVED_STATUS_SYNC_ORDER,
    payload: orderSyncStatus
  });
  // customer sync
  yield put({
    type: types.RECEIVED_STATUS_SYNC_CUSTOMER,
    payload: customerSyncStatus
  });
  // custom product sync
  yield put({
    type: types.RECEIVED_STATUS_SYNC_CUSTOM_PRODUCT,
    payload: customProductSyncStatus
  });
  // general config sync
  yield put({
    type: types.RECEIVED_STATUS_SYNC_GENERAL_CONFIG,
    payload: configSyncStatus
  });
  // all product sync
  yield put({
    type: types.RECEIVED_STATUS_SYNC_ALL_PRODUCT,
    payload: productSyncStatus
  });
}

function* runSyncWithSettingTime() {
  const nowTime = Date.now();
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
    yield getSyncStatusFromLocal();
    yield getSyncDataFromLocal();
  }
}

function* cronSaga() {
  yield takeEvery(SYNC_CLIENT_DATA, syncClientData);
  yield takeEvery(GET_SYNC_STATUS_FROM_LOCAL, getSyncStatusFromLocal);
  yield takeEvery(GET_SYNC_DATA_FROM_LOCAL, getSyncDataFromLocal);
}

export default cronSaga;
