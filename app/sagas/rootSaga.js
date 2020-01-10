import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { differenceInMinutes } from 'date-fns';
import * as types from '../constants/root';
import {
  addProductToQuote,
  addShippingInformationService,
  createGuestCartService,
  createInvoiceService,
  createShipmentService,
  getDiscountForQuoteService,
  placeCashOrderService,
  createOrderLocal
} from './services/CartService';
import {
  getDetailProductBundleService,
  getDetailProductConfigurableService,
  getDetailProductGroupedService,
  getProductByCategoryService,
  searchProductService,
  syncAllProducts
} from './services/ProductService';
import {
  getCustomerCartTokenService,
  searchCustomer,
  signUpCustomerService
} from './services/CustomerService';
import { createCustomerCartService } from './services/CustomerCartService';
import {
  getAllCategoriesService,
  getCustomReceiptService,
  getDetailOutletService,
  getOrderHistoryService,
  getOrderHistoryServiceDetails,
  getShopInfoService,
  getSystemConfigService
} from './services/CommonService';
import {
  createSyncAllDataFlag,
  haveToSyncAllData,
  updateSyncAllDataFlag
} from './services/SettingsService';
import {
  getInfoCashierService,
  getLoggedDb,
  getMainUrlKey
} from './services/LoginService';

import {
  handleProductType,
  reformatConfigurableProduct
} from '../common/product';
import {
  getDefaultPaymentMethod,
  getDefaultShippingMethod
} from './common/orderSaga';
import { calcPrice } from '../common/productPrice';
import { BUNDLE, CONFIGURABLE, GROUPED } from '../constants/product-types';
import {
  CHECK_LOGIN_BACKGROUND,
  RECEIVED_TOKEN,
  RECEIVED_MAIN_URL
} from '../constants/authen';
import { syncCategories } from '../reducers/db/categories';
import { syncCustomers } from '../reducers/db/customers';
import { signUpCustomer } from '../reducers/db/sync_customers';
import { getOfflineMode } from '../common/settings';
import { CHILDREN, LOGIN_FORM } from '../constants/main-panel-types';

const cartCurrent = state => state.mainRd.cartCurrent.data;
const cartCurrentToken = state => state.mainRd.cartCurrent.customerToken;
const cartId = state => state.mainRd.cartCurrent.cartId;
const cartIsGuestCustomer = state => state.mainRd.cartCurrent.isGuestCustomer;
const optionValue = state => state.mainRd.productOption.optionValue;
const customer = state => state.mainRd.cartCurrent.customer;
const shopInfoConfig = state => state.mainRd.shopInfoConfig;
const posSystemConfig = state => state.mainRd.posSystemConfig;
const cashierInfo = state => state.authenRd.cashierInfo;

/**
 * Create quote
 */
function* cashCheckout() {
  // Show cash modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: true });

  // Show cash loading pre order
  yield put({ type: types.UPDATE_CASH_LOADING_PREPARING_ORDER, payload: true });

  const offlineMode = yield getOfflineMode();
  const cartCurrentResult = yield select(cartCurrent);

  if (offlineMode === 1) {
    // Nothing todo yet
    console.info('Show cash with offline mode');
  } else {
    // Handles for online mode
    const posSystemConfigResult = yield select(posSystemConfig);
    const posSystemConfigGuestCustomer = posSystemConfigResult[3];
    const defaultShippingMethod = yield getDefaultShippingMethod();

    const {
      cartId,
      isGuestCustomer,
      customerToken
    } = yield getCustomerCartToken();

    yield all(
      cartCurrentResult.map(item =>
        call(addProductToQuote, cartId, item, {
          isGuestCustomer,
          customerToken
        })
      )
    );

    // Add shipping and get detail order
    const response = yield call(addShippingInformationService, cartId, {
      isGuestCustomer,
      customerToken,
      defaultShippingMethod,
      posSystemConfigGuestCustomer
    });

    yield put({
      type: types.RECEIVED_ORDER_PREPARING_CHECKOUT,
      payload: response
    });
  }

  // Hide cash loading pre order
  yield put({
    type: types.UPDATE_CASH_LOADING_PREPARING_ORDER,
    payload: false
  });
}

/**
 * Create cart token for guest or customer user
 * @returns {Generator<any, {isGuestCustomer: *, customerToken: *, cardId: *}>}
 */
function* getCustomerCartToken() {
  const customerRdResult = yield select(customer);
  let isGuestCustomer = true;
  if (customerRdResult !== null) {
    // Customer logged
    isGuestCustomer = false;
  }

  let cartId;
  let customerToken;

  // Update isGuestCustomer to reducer
  yield updateIsGuestCustomer(isGuestCustomer);

  if (isGuestCustomer) {
    // Get guest cart customer
    cartId = yield call(createGuestCartService);
  } else {
    // Create customer cart
    const customerId = customerRdResult.id;
    customerToken = yield call(getCustomerCartTokenService, customerId);
    cartId = yield call(createCustomerCartService, customerToken);
  }

  // Update cartId to reducer
  yield put({ type: types.UPDATE_CART_ID_TO_CURRENT_CART, payload: cartId });

  // Update cart token to current quote
  yield put({
    type: types.UPDATE_CART_TOKEN_TO_CURRENT_CART,
    payload: customerToken
  });

  return {
    cartId,
    isGuestCustomer,
    customerToken
  };
}

/**
 * Update isGuestCustomer to reducer
 * @returns void
 */
function* updateIsGuestCustomer(isGuestCustomer) {
  yield put({
    type: types.UPDATE_IS_GUEST_CUSTOMER_CURRENT_CART,
    payload: isGuestCustomer
  });
}

/**
 * Get default product
 * @returns void
 */
function* getDefaultProduct() {
  // Start loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: true });

  // Set empty if want get default response from magento2
  const searchValue = '';

  const offlineMode = yield getOfflineMode();
  const response = yield call(searchProductService, {
    searchValue,
    offlineMode
  });

  const productResult = response.length > 0 ? response : [];
  yield put({ type: types.RECEIVED_PRODUCT_RESULT, payload: productResult });

  // Stop loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: false });
}

/**
 * Cash place order
 * @returns void
 */
function* cashCheckoutPlaceOrder() {
  // Start cash place order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: true });

  // Get offline mode
  const offlineMode = yield getOfflineMode();

  if (offlineMode === 1) {
    const cartCurrentResult = yield select(cartCurrent);
    yield createOrderLocal(cartCurrentResult);
  } else {
    const cartCurrentTokenResult = yield select(cartCurrentToken);
    const isGuestCustomer = yield select(cartIsGuestCustomer);
    const cartIdResult = yield select(cartId);
    const posSystemConfigResult = yield select(posSystemConfig);
    const posSystemConfigCustomer = posSystemConfigResult[3];

    const defaultShippingMethod = yield getDefaultShippingMethod();

    // Default payment
    const defaultPaymentMethod = yield getDefaultPaymentMethod();

    const cashierInfoResult = yield select(cashierInfo);

    // Step 1: Create order
    const orderId = yield call(placeCashOrderService, cartCurrentTokenResult, {
      cartIdResult,
      isGuestCustomer,
      customerToken: cartCurrentTokenResult,
      defaultShippingMethod,
      defaultPaymentMethod,
      posSystemConfigCustomer,
      cashierInfo: cashierInfoResult
    });

    // Step 2: Create invoice
    yield call(createInvoiceService, orderId);

    // Step 3: Create shipment
    yield call(createShipmentService, orderId);

    // Place order success, let show receipt and copy current cart to cartForReceipt
    yield put({ type: types.PLACE_ORDER_SUCCESS, orderId });
  }

  // Stop cash loading order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: false });

  // Close cash place order modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: false });

  // Step 4: Open receipt modal
  yield put({ type: types.OPEN_RECEIPT_MODAL });
}

/**
 * Search action
 * @returns void
 * @param payload
 */
function* searchProduct(payload) {
  console.log('search action:', payload);
  // Start loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_HANDLE, payload: true });

  const offlineMode = yield getOfflineMode();
  const searchResult = yield call(searchProductService, {
    searchValue: payload.payload,
    offlineMode
  });
  const productResult = searchResult.length > 0 ? searchResult : [];

  // If have no product result => update showSearchEmptyResult = 1
  if (productResult.length === 0) {
    // If search value have no empty
    if (payload !== '') {
      yield put({
        type: types.UPDATE_IS_SHOW_HAVE_NO_SEARCH_RESULT_FOUND,
        payload: true
      });
    }
  } else {
    yield put({
      type: types.UPDATE_IS_SHOW_HAVE_NO_SEARCH_RESULT_FOUND,
      payload: false
    });
  }

  console.log('product result:', productResult);

  yield put({ type: types.RECEIVED_PRODUCT_RESULT, payload: productResult });

  // Stop loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_HANDLE, payload: false });
}

/**
 * Get detail product configurable
 * @param payload
 * @returns void
 */
function* getDetailProductConfigurable(payload) {
  yield startLoadingProductOption();

  const productDetailSingle = yield getDetailProductOfflineMode(
    payload.payload.item,
    CONFIGURABLE
  );

  const productDetailReFormat = yield handleProductType(productDetailSingle);
  yield receivedProductOptionValue(productDetailReFormat);

  yield getDetailProductEndTask();
}

/**
 * Get detail bundle product
 * @returns void
 */
function* getDetailBundleProduct(payload) {
  yield startLoadingProductOption();

  const productDetailSingle = yield getDetailProductOfflineMode(
    payload.payload.item,
    BUNDLE
  );

  const productDetailReFormat = yield handleProductType(productDetailSingle);
  yield receivedProductOptionValue(productDetailReFormat);

  yield getDetailProductEndTask();
}

/**
 * Get detail grouped product
 * @returns void
 */
function* getDetailGroupedProduct(payload) {
  yield startLoadingProductOption();

  const products = yield getDetailProductOfflineMode(
    payload.payload.item,
    GROUPED
  );

  yield receivedProductOptionValue(products);

  yield getDetailProductEndTask();
}

/**
 * Clone object without prototype, to avoid object is not extensible error
 * @param detailProduct
 * @returns array
 */
function cloneDetailProduct(detailProduct) {
  return JSON.parse(JSON.stringify(detailProduct));
}

/**
 * Get detail product
 * @param detailProduct
 * @param type
 * @returns product
 */
function* getDetailProductOfflineMode(detailProduct, type) {
  // Check offline mode
  const offlineMode = getOfflineMode();
  if (offlineMode === 1) {
    return cloneDetailProduct(detailProduct);
  }

  let productDetail;
  switch (type) {
    case BUNDLE:
      productDetail = yield call(
        getDetailProductBundleService,
        detailProduct.sku
      );
      return productDetail.data.products.items[0];
    case CONFIGURABLE:
      productDetail = yield call(
        getDetailProductConfigurableService,
        detailProduct.sku
      );
      return productDetail.data.products.items[0];
    case GROUPED:
      productDetail = yield call(
        getDetailProductGroupedService,
        detailProduct.sku
      );
      return productDetail.data.products.items[0];
    default:
      break;
  }
}

/**
 *
 * @returns void
 */
function* startLoadingProductOption() {
  // Start loading for get product detail and option
  yield put({ type: types.UPDATE_IS_LOADING_PRODUCT_OPTION, payload: true });
}

/**
 *
 * @returns void
 */
function* getDetailProductEndTask() {
  // Set showProductOption to true
  // yield put({ type: types.UPDATE_IS_SHOWING_PRODUCT_OPTION, payload: true });

  // Stop loading
  yield put({ type: types.UPDATE_IS_LOADING_PRODUCT_OPTION, payload: false });
}

/**
 * On config select on change
 * @returns {Generator<*, *>}
 */
function* onConfigurableSelectOnChange(payload) {
  // Update change to reducer
  yield put({ type: types.UPDATE_CONFIGURABLE_PRODUCT_OPTION, payload });

  const optionValueRd = yield select(optionValue);
  const productDetailReFormat = yield reformatConfigurableProduct(
    optionValueRd,
    false
  );
  yield receivedProductOptionValue(productDetailReFormat);
}

/**
 * Received product option value
 * @param productDetailReFormat
 * @returns void
 */
function* receivedProductOptionValue(productDetailReFormat) {
  // Set product detail to productOption->optionValue
  yield put({
    type: types.UPDATE_PRODUCT_OPTION_VALUE,
    payload: productDetailReFormat
  });
}

/**
 * Search customer action
 * @param payload
 * @returns void
 */
function* getSearchCustomer(payload) {
  // Start search loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_CUSTOMER, payload: true });

  const searchResult = yield call(searchCustomer, payload);

  yield put({
    type: types.RECEIVED_CUSTOMER_SEARCH_RESULT,
    searchResult
  });

  // Stop search loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_CUSTOMER, payload: false });

  // Sync customers
  yield call(syncCustomers, searchResult.items);
}

/**
 * Add to cart function
 * @param payload
 * @returns void
 */
function* addToCart(payload) {
  // Find sky if exits sku, then increment qty
  const listCartCurrent = yield select(cartCurrent);
  let currencyCode = yield select(shopInfoConfig);
  // eslint-disable-next-line prefer-destructuring
  currencyCode = currencyCode[0];

  const product = Object.assign({}, payload.payload);
  const productSku = product.sku;
  const typeId = product.type_id;

  // Add default pos_qty, if it does not exists
  // pos_qty always NULL because passed from product list
  if (!product.pos_qty) {
    product.pos_qty = 1;
  }

  let found = 0;
  let foundItem = null;
  let foundIndex = 0;
  // Just update qty with type is not bundle type
  if (typeId !== BUNDLE) {
    // Find exists product to update qty
    for (let i = 0; i < listCartCurrent.length; i += 1) {
      const item = listCartCurrent[i];

      // Update exists product with qty increment
      if (item.sku === productSku) {
        foundIndex = i;
        found = 1;
        foundItem = item;
      }
    }
  }

  // Update qty if exists
  if (found === 1) {
    foundItem = yield updateQtyProduct(foundItem);

    const productAssign = yield calcPrice(foundItem, currencyCode);
    yield put({
      type: types.UPDATE_ITEM_CART,
      payload: { index: foundIndex, item: productAssign }
    });
  } else {
    // Update product price
    const productAssign = yield calcPrice(product, currencyCode);

    // Add new
    yield put({ type: types.ADD_ITEM_TO_CART, payload: productAssign });
  }
}

/**
 * Update qty of product
 * @param product
 * @returns {*}
 */
function updateQtyProduct(product) {
  const productAssign = Object.assign({}, product);
  productAssign.pos_qty = productAssign.pos_qty += 1;
  return productAssign;
}

/**
 * Get pos general config
 * @returns void
 */
function* getPostConfigGeneralConfig() {
  // Start loading
  // yield put({ type: types.UPDATE_IS_LOADING_SYSTEM_CONFIG, payload: true });

  // Get system config settings
  const configGeneralResponse = yield call(getSystemConfigService);

  // Get shop info
  const shopInfoResponse = yield call(getShopInfoService);

  // Get all cashier info
  const cashierInfo = yield call(getInfoCashierService);
  yield put({ type: types.RECEIVED_CASHIER_INFO, payload: cashierInfo });

  const outletId = cashierInfo.outlet_id;
  const detailOutlet = yield call(getDetailOutletService, outletId);
  yield put({ type: types.RECEIVED_DETAIL_OUTLET, payload: detailOutlet });

  yield put({
    type: types.RECEIVED_POST_GENERAL_CONFIG,
    payload: configGeneralResponse
  });

  yield put({
    type: types.RECEIVED_SHOP_INFO_CONFIG,
    payload: shopInfoResponse
  });

  // Get all categories
  const allCategories = yield call(getAllCategoriesService);
  yield put({ type: types.RECEIVED_ALL_CATEGORIES, payload: allCategories });

  // Get default products
  yield getDefaultProduct();

  // Stop loading
  // yield put({ type: types.UPDATE_IS_LOADING_SYSTEM_CONFIG, payload: false });
}

/**
 * Sync all data
 * @returns void
 */
function* syncData() {
  // Get all categories
  const allCategories = yield call(getAllCategoriesService);
  const haveToSync = yield haveToSyncAllData();
  let letSync = false;
  let syncUpdateId = false;

  if (haveToSync.length === 0) {
    letSync = true;
  } else {
    const timePeriod = 15;
    const obj = haveToSync[0];
    const time = obj.update_at ? obj.update_at : obj.created_at;
    const distanceMinute = differenceInMinutes(new Date(), new Date(time));
    if (distanceMinute > timePeriod) {
      letSync = true;
      syncUpdateId = obj.id;
    }
  }

  // Let sync
  if (letSync) {
    console.info('let sync!');
    // Get offline mode
    const offlineMode = yield getOfflineMode();

    if (offlineMode === 1) {
      // Sync categories to local db
      yield call(syncCategories, allCategories);

      // Sync products by categories
      yield call(syncAllProducts, allCategories);

      if (syncUpdateId !== false) {
        // Update flag to get current time as flag
        yield updateSyncAllDataFlag(syncUpdateId);
      } else {
        // Wait for sync completed and create last time sync for each period sync execution
        yield createSyncAllDataFlag();
      }
    } else {
      console.warn(
        'offline mode not on, pls enable offline mode and connect to the internet'
      );
    }
  } else {
    console.info('not sync yet!');
  }
}

function* getCustomReceipt() {
  const customReceiptResult = yield call(getCustomReceiptService);
  if (customReceiptResult.length > 0) {
    const result = customReceiptResult[0];
    yield put({ type: types.RECEIVED_CUSTOM_RECEIPT, payload: result.data });
  }
}

/**
 * Get product by category
 * @param payload
 * @returns void
 */
function* getProductByCategory(payload) {
  // Start loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: true });

  const categoryId = payload.payload;

  const offlineMode = yield getOfflineMode();

  const productByCategory = yield call(getProductByCategoryService, {
    categoryId,
    offlineMode
  });
  yield put({
    type: types.RECEIVED_PRODUCT_RESULT,
    payload: productByCategory
  });

  // Stop loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: false });
}

function* getOrderHistoryDetail(payload) {
  yield put({ type: types.TURN_ON_LOADING_ORDER_HISTORY_DETAIL });
  const data = yield call(getOrderHistoryServiceDetails, payload.payload);
  yield put({
    type: types.RECEIVED_ORDER_HISTORY_DETAIL_ACTION,
    payload: data
  });
  yield put({ type: types.TURN_OFF_LOADING_ORDER_HISTORY_DETAIL });
}

function* getOrderHistory() {
  yield put({ type: types.TURN_ON_LOADING_ORDER_HISTORY });
  const data = yield call(getOrderHistoryService);

  yield put({ type: types.RECEIVED_ORDER_HISTORY_ACTION, payload: data.items });
  yield put({ type: types.TURN_OFF_LOADING_ORDER_HISTORY });
}

function* signUpAction(payload) {
  console.log(payload);
  yield put({ type: types.CHANGE_SIGN_UP_LOADING_CUSTOMER, payload: true });
  const offlineMode = yield getOfflineMode();
  if (offlineMode === 1) {
    yield call(signUpCustomer, payload);
  }
  const res = yield call(signUpCustomerService, payload);
  yield put({
    type: types.MESSAGE_SIGN_UP_CUSTOMER,
    payload: res.data.message
  });
  if (res.ok) {
    yield put({ type: types.TOGGLE_MODAL_SIGN_UP_CUSTOMER, payload: false });
  }
  yield put({ type: types.CHANGE_SIGN_UP_LOADING_CUSTOMER, payload: false });
}

/**
 * Get discount when show cash checkout for offline mode
 * @returns void
 */
function* getDiscountForOfflineCheckoutSaga() {
  // Start loading
  yield put({
    type: types.UPDATE_IS_LOADING_GET_CHECKOUT_OFFLINE,
    payload: true
  });

  const cartCurrentResult = yield select(cartCurrent);
  // Handles for offline mode
  const posSystemConfigResult = yield select(posSystemConfig);
  const result = yield call(getDiscountForQuoteService, {
    cart: cartCurrentResult,
    config: posSystemConfigResult
  });
  const typeOfResult = typeof result;

  // If json type returned, that mean get discount success
  if (typeOfResult !== 'string') {
    yield put({
      type: types.RECEIVED_CHECKOUT_OFFLINE_CART_INFO,
      payload: result
    });
  }

  // Stop loading
  yield put({
    type: types.UPDATE_IS_LOADING_GET_CHECKOUT_OFFLINE,
    payload: false
  });
}

/**
 * Bootstrap application and load all config
 * @param loggedDb
 * @returns void
 */
function* bootstrapApplicationSaga(loggedDb) {
  // Set token first
  const { token } = loggedDb.value;

  // Assign to global variables
  window.liveToken = token;

  // Get main url key
  const data = yield call(getMainUrlKey);
  if (data.status) {
    const { url } = data.payload.value;
    yield put({ type: RECEIVED_MAIN_URL, payload: data.payload.url });
    window.mainUrl = url;
  }

  // Set token
  yield put({ type: RECEIVED_TOKEN, payload: token });

  // Get all config
  yield getPostConfigGeneralConfig();

  // Update switching mode
  yield put({ type: types.UPDATE_SWITCHING_MODE, payload: CHILDREN });

  // Sync
  yield syncData();
}

/**
 * Check login background
 * @returns void
 */
function* checkLoginBackgroundSaga() {
  const loggedDb = yield getLoggedDb();

  // Logged
  if (loggedDb !== false) {
    // If logged before => call bootstrapApplication
    yield bootstrapApplicationSaga(loggedDb);
  } else {
    // Not login yet =
    yield put({ type: types.UPDATE_SWITCHING_MODE, payload: LOGIN_FORM });
  }
}

/**
 * Default root saga
 * @returns void
 */
function* rootSaga() {
  yield takeEvery(types.CASH_CHECKOUT_ACTION, cashCheckout);
  yield takeEvery(types.SEARCH_ACTION, searchProduct);
  yield takeEvery(
    types.CASH_CHECKOUT_PLACE_ORDER_ACTION,
    cashCheckoutPlaceOrder
  );
  yield takeEvery(
    types.GET_DETAIL_PRODUCT_CONFIGURABLE,
    getDetailProductConfigurable
  );
  yield takeEvery(
    types.ON_CONFIGURABLE_SELECT_ONCHANGE,
    onConfigurableSelectOnChange
  );
  yield takeEvery(types.GET_DETAIL_PRODUCT_BUNDLE, getDetailBundleProduct);
  yield takeEvery(types.GET_DETAIL_PRODUCT_GROUPED, getDetailGroupedProduct);
  yield takeEvery(types.SEARCH_CUSTOMER, getSearchCustomer);
  yield takeEvery(types.ADD_TO_CART, addToCart);
  yield takeEvery(types.GET_CUSTOM_RECEIPT, getCustomReceipt);
  yield takeEvery(types.GET_ORDER_HISTORY_ACTION, getOrderHistory);
  yield takeEvery(types.GET_PRODUCT_BY_CATEGORY, getProductByCategory);
  yield takeEvery(types.SIGN_UP_CUSTOMER, signUpAction);
  yield takeEvery(types.GET_ORDER_HISTORY_DETAIL_ACTION, getOrderHistoryDetail);
  yield takeEvery(
    types.GET_DISCOUNT_FOR_OFFLINE_CHECKOUT,
    getDiscountForOfflineCheckoutSaga
  );
  yield takeEvery(CHECK_LOGIN_BACKGROUND, checkLoginBackgroundSaga);
}

export default rootSaga;
