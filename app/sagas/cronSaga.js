import { takeEvery, put, select, call } from 'redux-saga/effects';
import * as types from '../constants/authen';
import {
  SYNC_CLIENT_DATA,
  GET_SYNC_DATA_FROM_LOCAL,
  GET_SYNC_STATUS_FROM_LOCAL,
  CRON_JOBS_ACTION,
  SYNC_DATA_TYPE_WITH_ID
} from '../constants/root.json';
import {
  getGeneralConfigFromLocal,
  updateGeneralConfigFromLocal
} from './services/settings-service';
import {
  syncCustomProductAPI,
  getAllProductFromLocal
} from './services/product-service';
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

const cashierInfo = state => state.authenRd.cashierInfo;
const detailOutlet = state => state.mainRd.generalConfig.detail_outlet;

function* getSyncDataFromLocal() {
  // // get all product in local db
  // const payloadResultAllProduct = yield getAllProductFromLocal();
  // yield put({
  //   type: types.RECEIVED_DATA_SYNC_ALL_PRODUCT,
  //   payload: payloadResultAllProduct
  // });
  // // get all order in local db
  // const payloadResultOrder = yield getAllOrders();
  // yield put({
  //   type: types.RECEIVED_DATA_SYNC_ORDER,
  //   payload: payloadResultOrder
  // });
  // // get all custom product in local db
  // const payloadResultCustomProduct = yield getAllTblCustomProduct();
  // yield put({
  //   type: types.RECEIVED_DATA_SYNC_CUSTOM_PRODUCT,
  //   payload: payloadResultCustomProduct
  // });
  // // get all customer in local db
  // const payloadResultCustomer = yield getAllTbl();
  // yield put({
  //   type: types.RECEIVED_DATA_SYNC_CUSTOMER,
  //   payload: payloadResultCustomer
  // });
  // // get all config in local db
  // const payloadResultGeneralConfig = yield getGeneralConfigFromLocal();
  // yield put({
  //   type: types.RECEIVED_DATA_SYNC_GENERAL_CONFIG,
  //   payload: payloadResultGeneralConfig
  // });
}

function* getSyncStatusFromLocal() {
  // const productSyncStatus = yield call(
  //   getServiceByName,
  //   types.ALL_PRODUCT_SYNC
  // );
  // const customerSyncStatus = yield call(getServiceByName, types.CUSTOMERS_SYNC);
  // const customProductSyncStatus = yield call(
  //   getServiceByName,
  //   types.CUSTOM_PRODUCT_SYNC
  // );
  // const configSyncStatus = yield call(
  //   getServiceByName,
  //   types.GENERAL_CONFIG_SYNC
  // );
  // const orderSyncStatus = yield call(getServiceByName, types.SYNC_ORDER_LIST);
  // // order sync
  // yield put({
  //   type: types.RECEIVED_STATUS_SYNC_ORDER,
  //   payload: orderSyncStatus
  // });
  // // customer sync
  // yield put({
  //   type: types.RECEIVED_STATUS_SYNC_CUSTOMER,
  //   payload: customerSyncStatus
  // });
  // // custom product sync
  // yield put({
  //   type: types.RECEIVED_STATUS_SYNC_CUSTOM_PRODUCT,
  //   payload: customProductSyncStatus
  // });
  // // general config sync
  // yield put({
  //   type: types.RECEIVED_STATUS_SYNC_GENERAL_CONFIG,
  //   payload: configSyncStatus
  // });
  // // all product sync
  // yield put({
  //   type: types.RECEIVED_STATUS_SYNC_ALL_PRODUCT,
  //   payload: productSyncStatus
  // });
}

const syncManager = state => state.authenRd.syncManager;

function* syncCustomer(customerID) {
  const timeAccept = yield getTimeToAcceptSyncing(types.CUSTOMERS_SYNC);
  if (!customerID && !timeAccept) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.CUSTOMERS_SYNC, status: true }
  });

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

function* syncCustomProduct(customProductID) {
  const timeAccept = yield getTimeToAcceptSyncing(types.CUSTOM_PRODUCT_SYNC);
  if (!customProductID && !timeAccept) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.CUSTOM_PRODUCT_SYNC, status: true }
  });

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
      message: 'Cannot create customer',
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

function* syncOrder(orderId) {
  const timeAccept = yield getTimeToAcceptSyncing(types.ALL_ORDER_SYNC);
  if (!orderId && !timeAccept) {
    return null;
  }
  yield put({
    type: types.LOADING_SYNC_ACTION,
    payload: { type: types.SYNC_ORDER_LIST, status: true }
  });

  // if syncOrder call with haven't id means sync all
  const payload = {};
  // step 1: sync custom product first
  yield syncCustomProduct();
  // step 2: sync customer second
  yield syncCustomer();
  // step 3: next step

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

function* syncAllProduct(ProductID) {
  const timeAccept = yield getTimeToAcceptSyncing(types.ALL_PRODUCT_SYNC);
  if (!ProductID && !timeAccept) {
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

function* syncGeneralConfig(configName) {
  const timeAccept = yield getTimeToAcceptSyncing(types.GENERAL_CONFIG_SYNC);
  if (!configName && !timeAccept) {
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

function* getTimeToAcceptSyncing(typeID) {
  const nowTime = Date.now();
  const syncTimeAllProduct = yield getLastUpdateTime(types.ALL_PRODUCT_SYNC);
  const syncTimeCustomProduct = yield getLastUpdateTime(
    types.CUSTOM_PRODUCT_SYNC
  );
  const syncTimeCustomer = yield getLastUpdateTime(types.CUSTOMERS_SYNC);
  const syncTimeGeneralConfig = yield getLastUpdateTime(
    types.GENERAL_CONFIG_SYNC
  );
  const config = yield getGeneralConfigFromLocal();
  let timeConfig;
  // default time
  let allProducts = 5;
  let allCustomProduct = 5;
  let allCustomersSync = 5;
  let generalConfigSync = 5;
  let allOrdersSync = 5;
  try {
    timeConfig = config[0].value.common_config.time_synchronized_for_modules;
    console.log(timeConfig);
    allProducts = timeConfig.all_products || 5;
    allCustomProduct = timeConfig.all_custom_product || 5;
    allCustomersSync = timeConfig.all_customers_sync || 5;
    generalConfigSync = timeConfig.general_config_sync || 5;
    allOrdersSync = timeConfig.all_orders_sync || 5;
  } catch (e) {
    timeConfig = null;
  }
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
      if (
        nowTime - syncTimeAllProduct > allProducts * 60000 &&
        !loadingSyncAllProduct
      ) {
        return true;
      }
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      if (
        nowTime - syncTimeCustomProduct > allCustomProduct * 60000 &&
        !loadingSyncCustomProducts
      ) {
        return true;
      }
      break;
    case types.CUSTOMERS_SYNC:
      if (
        nowTime - syncTimeCustomer > allCustomersSync * 60000 &&
        !loadingSyncCustomer
      ) {
        return true;
      }
      break;
    case types.GENERAL_CONFIG_SYNC:
      if (
        nowTime - syncTimeGeneralConfig > generalConfigSync * 60000 &&
        !loadingSyncConfig
      ) {
        return true;
      }
      break;
    case types.ALL_ORDER_SYNC:
      if (
        nowTime - syncTimeGeneralConfig > allOrdersSync * 60000 &&
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
  const { id } = payload;
  switch (payloadType) {
    case types.ALL_PRODUCT_SYNC:
      yield syncAllProduct(id);
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      yield syncCustomProduct(id);
      break;
    case types.CUSTOMERS_SYNC:
      yield syncCustomer(id);
      break;
    case types.GENERAL_CONFIG_SYNC:
      yield syncGeneralConfig(id);
      break;
    case types.SYNC_ORDER_LIST:
      yield syncOrder(id);
      break;
    default:
      break;
  }
}

function* cronSaga() {
  yield takeEvery(CRON_JOBS_ACTION, cronJobs);
  yield takeEvery(SYNC_DATA_TYPE_WITH_ID, syncTypeDataWithID);
  yield takeEvery(GET_SYNC_STATUS_FROM_LOCAL, getSyncStatusFromLocal);
  yield takeEvery(GET_SYNC_DATA_FROM_LOCAL, getSyncDataFromLocal);
}

export default cronSaga;
