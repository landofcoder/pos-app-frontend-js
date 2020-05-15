import { takeEvery, put, select, call } from 'redux-saga/effects';
import * as types from '../constants/authen';
import {
  SYNC_DATA_TYPE,
  GET_SYNC_STATUS_FROM_LOCAL,
  CRON_JOBS_ACTION,
  GET_SYNC_ALL_CUSTOM_PRODUCT_ERROR_FROM_LOCAL,
  GET_SYNC_ALL_CUSTOMER_ERROR_FROM_LOCAL,
  GET_SYNC_ALL_ORDER_ERROR_FROM_LOCAL
} from '../constants/root.json';
import {
  getGeneralConfigFromLocal,
  updateGeneralConfigFromLocal
} from './services/settings-service';
import { syncCustomProductAPI } from './services/product-service';
import {
  getAllTblCustomer,
  getCustomerByName,
  updateCustomerById
} from '../reducers/db/sync_customers';
import {
  getAllTblCustomProduct,
  updateCustomProductById,
  getCustomProductById
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
import { signUpCustomerService } from './services/customer-service';
import { syncOrderService } from './services/cart-service';
import {
  setupFetchingGeneralConfig,
  setupSyncCategoriesAndProducts,
  reloadTokenFromLoggedLocalDB
} from './rootSaga';

import { serviceTypeGroupManager } from '../common/sync-group-manager';

const cashierInfo = state => state.authenRd.cashierInfo;
const detailOutlet = state => state.mainRd.generalConfig.detail_outlet;
const syncManager = state => state.authenRd.syncManager;

function* getSyncAllCustomProductError() {
  // get all custom product in local db
  const payloadResultCustomProduct = yield getAllTblCustomProduct();
  const customFailed = payloadResultCustomProduct.filter(item => {
    return !item.success;
  });
  yield put({
    type: types.RECEIVED_DATA_SYNC_CUSTOM_PRODUCT,
    payload: customFailed
  });
}
function* getSyncAllCustomerError() {
  // get all customer in local db
  const payloadResultCustomer = yield getAllTblCustomer();
  const customerFailed = payloadResultCustomer.filter(item => {
    return !item.success;
  });
  yield put({
    type: types.RECEIVED_DATA_SYNC_CUSTOMER,
    payload: customerFailed
  });
}
function* getSyncAllOrderError() {
  // get all order in local db
  const payloadResultOrder = yield getAllOrders();
  const orderFailed = payloadResultOrder.filter(item => {
    return !item.success;
  });
  yield put({
    type: types.RECEIVED_DATA_SYNC_ORDER,
    payload: orderFailed
  });
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

function* syncCustomer(customerName, syncAllNow) {
  const timeAccept = yield checkTimeToAcceptSyncing(types.CUSTOMERS_SYNC);
  if (!customerName && !timeAccept && !syncAllNow) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.CUSTOMERS_SYNC, status: true }
  });

  let checkAllSync = 0;
  let customers = [];
  if (customerName && !syncAllNow) {
    customers = yield getCustomerByName(customerName);
  } else {
    customers = yield getAllTblCustomer();
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const customer of customers) {
    // eslint-disable-next-line no-continue
    if (customer.status) continue;

    // moi lan dong bo 1 customer neu bi loi van phai dong bo cac customer khac
    try {
      const result = yield call(signUpCustomerService, customer);
      if (result || result.status) {
        customer.success = true;
        yield updateCustomerById(customer);
      } else {
        // eslint-disable-next-line no-throw-literal
        throw { message: result.message || 'Cannot create customer' };
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
    const dataErrors = {
      message: 'Can not resolve sync all customer',
      errors: checkAllSync
    };
    yield failedLoadService(
      serviceTypeGroupManager(types.CUSTOMERS_SYNC, dataErrors)
    );
  }

  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.CUSTOMERS_SYNC, status: false }
  });
}

function* syncCustomProduct(customProductID, syncAllNow) {
  const timeAccept = yield checkTimeToAcceptSyncing(types.CUSTOM_PRODUCT_SYNC);
  if (!customProductID && !timeAccept && !syncAllNow) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.CUSTOM_PRODUCT_SYNC, status: true }
  });

  let products = [];
  if (customProductID && !syncAllNow) {
    products = yield call(getCustomProductById, customProductID);
  } else {
    products = yield call(getAllTblCustomProduct);
  }
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
        throw { message: result.message || 'Cannot create customer' };
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
    const dataErrors = {
      message: 'Cannot create all custom product',
      errors: checkAllSync
    };
    yield failedLoadService(
      serviceTypeGroupManager(types.CUSTOM_PRODUCT_SYNC, dataErrors)
    );
  }

  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.CUSTOM_PRODUCT_SYNC, status: false }
  });
}

function* syncOrder(orderId, syncAllNow) {
  const timeAccept = yield checkTimeToAcceptSyncing(types.SYNC_ORDER_LIST);
  if (!orderId && !timeAccept && !syncAllNow) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.SYNC_ORDER_LIST, status: true }
  });

  // step 1: sync custom product first
  yield syncCustomProduct();
  // step 2: sync customer second
  yield syncCustomer();
  // step 3: next step

  let orders;
  if (orderId && !syncAllNow) {
    orders = yield getOrderById(orderId);
  } else {
    orders = yield getAllOrders();
  }
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
    const dataErrors = {
      message: 'Cannot sync all order',
      errors: checkAllSync
    };
    yield failedLoadService(
      serviceTypeGroupManager(types.SYNC_ORDER_LIST, dataErrors)
    );
  }

  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.SYNC_ORDER_LIST, status: false }
  });
}

function* syncAllProduct(ProductID, syncAllNow) {
  const timeAccept = yield checkTimeToAcceptSyncing(types.ALL_PRODUCT_SYNC);
  if (!ProductID && !timeAccept && !syncAllNow) {
    return null;
  }

  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.ALL_PRODUCT_SYNC, status: true }
  });

  try {
    yield setupSyncCategoriesAndProducts();
    // Add Sync manager success
    yield call(successLoadService, types.ALL_PRODUCT_SYNC);
  } catch (e) {
    yield failedLoadService(serviceTypeGroupManager(types.ALL_PRODUCT_SYNC, e));
  }

  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.ALL_PRODUCT_SYNC, status: false }
  });
}

function* syncGeneralConfig(configName, syncAllNow) {
  const timeAccept = yield checkTimeToAcceptSyncing(types.GENERAL_CONFIG_SYNC);
  if (!configName && !timeAccept && !syncAllNow) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.GENERAL_CONFIG_SYNC, status: true }
  });

  try {
    yield setupFetchingGeneralConfig();
    // Add Sync manager success
    yield call(successLoadService, types.GENERAL_CONFIG_SYNC);
  } catch (e) {
    const dataErrors = {
      message: e.message || 'Cannot sync General Config',
      data: e.data
    };
    yield call(updateGeneralConfigFromLocal, dataErrors);
    yield failedLoadService(
      serviceTypeGroupManager(types.GENERAL_CONFIG_SYNC, dataErrors)
    );
  }

  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.GENERAL_CONFIG_SYNC, status: false }
  });
}

function* checkTimeToAcceptSyncing(typeID) {
  const nowTime = Date.now();
  let syncTimeAllProduct;
  let syncTimeCustomProduct;
  let syncTimeCustomer;
  let syncTimeGeneralConfig;
  let syncTimeAllOrder;
  let timeConfig;
  // default time
  let allProducts = 5;
  let allCustomProduct = 5;
  let allCustomersSync = 5;
  let generalConfigSync = 5;
  let allOrdersSync = 5;
  // get config time from localdb
  const config = yield getGeneralConfigFromLocal();
  try {
    timeConfig = config[0].value.common_config.time_synchronized_for_modules;
    allProducts = timeConfig.all_products || 5;
    allCustomProduct = timeConfig.all_custom_product || 5;
    allCustomersSync = timeConfig.all_customers_sync || 5;
    generalConfigSync = timeConfig.general_config_sync || 5;
    allOrdersSync = timeConfig.all_orders_sync || 5;
  } catch (e) {}
  const syncManagerResult = yield select(syncManager);

  const {
    loadingSyncAllProduct,
    loadingSyncConfig,
    loadingSyncCustomProducts,
    loadingSyncCustomer,
    loadingSyncOrder
  } = syncManagerResult;

  // truong hop sync dang hoat dong va chua duoc hoan tat, ham check sync khong nen chay them ham sync them lan nua

  switch (typeID) {
    case types.ALL_PRODUCT_SYNC:
      syncTimeAllProduct = yield getLastUpdateTime(types.ALL_PRODUCT_SYNC);
      if (
        nowTime - syncTimeAllProduct > allProducts * 60000 &&
        !loadingSyncAllProduct
      ) {
        return true;
      }
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      syncTimeCustomProduct = yield getLastUpdateTime(
        types.CUSTOM_PRODUCT_SYNC
      );
      if (
        nowTime - syncTimeCustomProduct > allCustomProduct * 60000 &&
        !loadingSyncCustomProducts
      ) {
        return true;
      }
      break;
    case types.CUSTOMERS_SYNC:
      syncTimeCustomer = yield getLastUpdateTime(types.CUSTOMERS_SYNC);
      if (
        nowTime - syncTimeCustomer > allCustomersSync * 60000 &&
        !loadingSyncCustomer
      ) {
        return true;
      }
      break;
    case types.GENERAL_CONFIG_SYNC:
      syncTimeGeneralConfig = yield getLastUpdateTime(
        types.GENERAL_CONFIG_SYNC
      );
      if (
        nowTime - syncTimeGeneralConfig > generalConfigSync * 60000 &&
        !loadingSyncConfig
      ) {
        return true;
      }
      break;
    case types.SYNC_ORDER_LIST:
      syncTimeAllOrder = yield getLastUpdateTime(types.SYNC_ORDER_LIST);
      if (
        nowTime - syncTimeAllOrder > allOrdersSync * 60000 &&
        !loadingSyncOrder
      ) {
        return true;
      }
      break;
    default:
      break;
  }
  return false;
}

function* cronJobs() {
  // get token
  yield reloadTokenFromLoggedLocalDB();
  // run sync action
  yield syncAllProduct();
  yield syncCustomProduct();
  yield syncCustomer();
  yield syncGeneralConfig();
  yield syncOrder();
}

/**
 * sync all data from state to server can bind with payload
 * @param {*} payload
 */

function* syncTypeDataWithID(payload) {
  const payloadType = payload.payload;
  const { id, syncAllNow } = payload;
  switch (payloadType) {
    case types.ALL_PRODUCT_SYNC:
      yield syncAllProduct(id, syncAllNow);
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      yield syncCustomProduct(id, syncAllNow);
      break;
    case types.CUSTOMERS_SYNC:
      yield syncCustomer(id, syncAllNow);
      break;
    case types.GENERAL_CONFIG_SYNC:
      yield syncGeneralConfig(id, syncAllNow);
      break;
    case types.SYNC_ORDER_LIST:
      yield syncOrder(id, syncAllNow);
      break;
    default:
      break;
  }
}

function* cronSaga() {
  yield takeEvery(CRON_JOBS_ACTION, cronJobs);
  yield takeEvery(SYNC_DATA_TYPE, syncTypeDataWithID);
  yield takeEvery(GET_SYNC_STATUS_FROM_LOCAL, getSyncStatusFromLocal);
  yield takeEvery(
    GET_SYNC_ALL_CUSTOM_PRODUCT_ERROR_FROM_LOCAL,
    getSyncAllCustomProductError
  );
  yield takeEvery(
    GET_SYNC_ALL_CUSTOMER_ERROR_FROM_LOCAL,
    getSyncAllCustomerError
  );
  yield takeEvery(GET_SYNC_ALL_ORDER_ERROR_FROM_LOCAL, getSyncAllOrderError);
}

export default cronSaga;
