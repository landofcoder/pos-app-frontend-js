import { takeEvery, put, select, call } from 'redux-saga/effects';
import * as types from '../constants/authen';
import { CUSTOM } from '../../app/constants/product-types.json';
import {
  SYNC_DATA_TYPE,
  GET_SYNC_STATUS_FROM_LOCAL,
  GET_SYNC_DATA_WITH_TYPE,
  CRON_JOBS_ACTION
} from '../constants/root.json';
import {
  getGeneralConfigFromLocal,
  updateGeneralConfigFromLocal
} from './services/settings-service';
import {
  syncCustomProductAPI,
  getAllProductFromLocal
} from './services/product-service';
import {
  getAllTblCustomer,
  getAllTblCustomerByPaginate,
  getCustomerByName,
  updateCustomerById,
  replaceCustomerById,
  getCustomerById,
  updateCustomerOrderListById
} from '../reducers/db/sync_customers';
import {
  getAllTblCustomProduct,
  updateCustomProductById,
  getCustomProductById,
  getAllTblCustomProductByPaginate
} from '../reducers/db/sync_custom_product';
import {
  getAllOrders,
  getOrderById,
  updateOrderById,
  getAllOrdersByPaginate
} from '../reducers/db/sync_orders';
import {
  successLoadService,
  failedLoadService,
  getServiceByName,
  getLastUpdateTime,
  getAllSyncService
} from '../reducers/db/sync_data_manager';
import { signUpCustomerService } from './services/customer-service';
import { syncOrderService } from './services/cart-service';
import {
  setupFetchingGeneralConfig,
  setupSyncCategoriesAndProducts,
  reloadTokenFromLoggedLocalDB
} from './rootSaga';

import {
  conditionForSyncing,
  serviceTypeGroupManager
} from '../common/sync-group-manager';
const cashierInfo = state => state.authenRd.cashierInfo;
const detailOutlet = state => state.mainRd.generalConfig.detail_outlet;
const loadingSyncManager = state => state.authenRd.loadingSyncManager;

function* resolveCustomerIdForOrder(customer) {
  const customerResult = yield call(getCustomerById, customer.id);
  const { orderList } = customerResult;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of orderList) {
    const orderResult = yield getOrderById(item.orderId);
    const order = orderResult[0];
    order.items.cartCurrentResult.customer = customerResult.payload.customer;
    // update order with no change time
    yield updateOrderById(order, true);
  }
  yield updateCustomerOrderListById(customer);
}

function* checkExistingFailedCustomProduct(order) {
  const listItem = order.items.cartCurrentResult.data;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of listItem) {
    if (item.type_id === CUSTOM) {
      const customProductDb = yield call(getCustomProductById, item.id);
      if (!customProductDb || !customProductDb.status) {
        // eslint-disable-next-line no-throw-literal
        throw {
          message:
            customProductDb.message ||
            'Cannot sync order cause custom product can not create'
        };
      }
    }
  }
}

function* getSyncAllProduct(step, stepAt) {
  // get all custom product in local db
  const payloadResultAllProduct = yield getAllProductFromLocal(step, stepAt);
  return payloadResultAllProduct;
}

function* getSyncAllCustomProduct(step, stepAt) {
  // get all custom product in local db
  const payloadResultCustomProduct = yield getAllTblCustomProductByPaginate(
    step,
    stepAt
  );
  return payloadResultCustomProduct;
}

function* getSyncAllCustomer(step, stepAt) {
  // get all customer in local db
  const payloadResultCustomer = yield getAllTblCustomerByPaginate(step, stepAt);
  return payloadResultCustomer;
}

function* getSyncAllOrder(step, stepAt) {
  // get all order in local db
  const payloadResultOrder = yield getAllOrdersByPaginate(step, stepAt);
  return payloadResultOrder;
}

function* getSyncStatusFromLocal() {
  const allStatusService = yield getAllSyncService();
  yield put({
    type: types.RECEIVED_STATUS_SYNC,
    payload: allStatusService
  });
}

function* getSyncDataWithTypeFromLocal(payload) {
  const { id, step, stepAt } = payload;
  let listData = [];
  let statusData = {};
  statusData = yield getServiceByName(id);
  switch (id) {
    case types.ALL_PRODUCT_SYNC:
      listData = yield call(getSyncAllProduct, step, stepAt);
      break;
    case types.CUSTOM_PRODUCT_SYNC:
      listData = yield call(getSyncAllCustomProduct, step, stepAt);
      break;
    case types.CUSTOMERS_SYNC:
      listData = yield call(getSyncAllCustomer, step, stepAt);
      break;
    case types.SYNC_ORDER_LIST:
      listData = yield call(getSyncAllOrder, step, stepAt);
      break;
    case types.GENERAL_CONFIG_SYNC:
      break;
    default:
      break;
  }
  yield put({
    type: types.RECEIVED_DATA_SYNC,
    payload: listData,
    statusData,
    id,
    step,
    stepAt
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
        const newCustomerId = result.data.data.createCustomer.customer.id;
        customer.status = true;
        // update customerid
        yield replaceCustomerById(customer, newCustomerId);
        // update customerid in order checkout with this customer
        yield resolveCustomerIdForOrder(customer);
      } else {
        // eslint-disable-next-line no-throw-literal
        throw { message: result.message || 'Cannot create customer' };
      }
    } catch (e) {
      checkAllSync += 1;
      // cap nhat trang thai tren table customers
      customer.status = false;
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
      product.status = false;
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
      yield checkExistingFailedCustomProduct(order); // will throw if order existing failed custom product
      const result = yield call(syncOrderService, order);

      if (!result.status || result.message || result.errors) {
        checkAllSync += 1;
        // eslint-disable-next-line no-throw-literal
        throw {
          message: result.message || 'Cannot sync order',
          data: result.data || result.errors || result
        };
      } else {
        order.status = true;
        order.success = true;
        yield updateOrderById(order);
      }
    } catch (e) {
      order.status = false;
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
  // last time
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
  const loadingSyncManagerResult = yield select(loadingSyncManager);

  // truong hop sync dang hoat dong va chua duoc hoan tat, ham check sync khong nen chay them ham sync them lan nua

  switch (typeID) {
    case types.ALL_PRODUCT_SYNC:
      syncTimeAllProduct = yield getLastUpdateTime(types.ALL_PRODUCT_SYNC);
      return conditionForSyncing(
        syncTimeAllProduct,
        allProducts,
        loadingSyncManagerResult[typeID]
      );
    case types.CUSTOM_PRODUCT_SYNC:
      syncTimeCustomProduct = yield getLastUpdateTime(
        types.CUSTOM_PRODUCT_SYNC
      );
      return conditionForSyncing(
        syncTimeCustomProduct,
        allCustomProduct,
        loadingSyncManagerResult[typeID]
      );
    case types.CUSTOMERS_SYNC:
      syncTimeCustomer = yield getLastUpdateTime(types.CUSTOMERS_SYNC);
      return conditionForSyncing(
        syncTimeCustomer,
        allCustomersSync,
        loadingSyncManagerResult[typeID]
      );
    case types.GENERAL_CONFIG_SYNC:
      syncTimeGeneralConfig = yield getLastUpdateTime(
        types.GENERAL_CONFIG_SYNC
      );
      return conditionForSyncing(
        syncTimeGeneralConfig,
        generalConfigSync,
        loadingSyncManagerResult[typeID]
      );
    case types.SYNC_ORDER_LIST:
      syncTimeAllOrder = yield getLastUpdateTime(types.SYNC_ORDER_LIST);
      return conditionForSyncing(
        syncTimeAllOrder,
        allOrdersSync,
        loadingSyncManagerResult[typeID]
      );
    default:
      return false;
  }
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

/**
 * there are 2 payload in param id mean if you want sync with special id(orderid,customerid,productid,...) with payloadType
 * another you want to sync all of payloadType use syncAllNow = 1
 * @param payload
 * @returns {Generator<Generator<Generator<Promise<*>|<"SELECT", SelectEffectDescriptor>|Promise<*|undefined>|Promise<*|undefined>, boolean, *>|<"PUT", PutEffectDescriptor<{payload: {type: string, status: boolean}, type: string}>>, null, *>|Generator<Generator<Promise<*>|<"SELECT", SelectEffectDescriptor>|Promise<*|undefined>|Promise<*|undefined>, boolean, *>|<"PUT", PutEffectDescriptor<{payload: {type: string, status: boolean}, type: string}>>, null, *>, void, *>}
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
  yield takeEvery(GET_SYNC_DATA_WITH_TYPE, getSyncDataWithTypeFromLocal);
}

export default cronSaga;
