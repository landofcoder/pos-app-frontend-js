import { call, put, select, takeEvery } from 'redux-saga/effects';
import { getDevices, UsbScanner } from 'usb-barcode-scanner-brainos';
import { differenceInMinutes } from 'date-fns';
import * as types from '../constants/root';
import * as typesAuthen from '../constants/authen.json';
import {
  getDiscountForQuoteService,
  createOrderLocal,
  noteOrderActionService
} from './services/cart-service';
import { stripeMakePayment } from './services/payments/stripe-payment';
import { authorizeMakePayment } from './services/payments/authorize-payment';
import {
  getProductByCategoryService,
  getProductBySkuFromScanner,
  searchProductService,
  writeProductsToLocal
} from './services/product-service';
import {
  searchCustomer,
  searchCustomerByName,
  searchCustomerDbService,
  signUpCustomerService,
  signUpCustomerServiceDb
} from './services/customer-service';
import {
  cancelOrderService,
  getAllCategoriesService,
  getOrderHistoryService,
  getOrderHistoryServiceDetails,
  getShopInfoService
} from './services/common-service';
import {
  createConnectedDeviceSettings,
  removeScannerDeviceConnected
} from './services/settings-service';
import {
  getAppInfoFromLocal,
  getGeneralFromLocal,
  readLoggedDbFromLocal,
  loginService,
  writeGeneralConfigToLocal,
  writeLoggedInfoToLocal,
  readLastTimeLogoutFromLocal
} from './services/login-service';

import {
  handleProductType,
  reformatConfigurableProduct
} from '../common/product';
import { calcPrice } from '../common/product-price';
import { BUNDLE } from '../constants/product-types';
import {
  getCategoriesFromLocal,
  writeCategoriesToLocal
} from '../reducers/db/categories';
import { syncCustomers } from '../reducers/db/customers';
import { getAllOrders } from '../reducers/db/sync_orders';
import {
  getOfflineMode,
  setAppInfoToGlobal,
  setTokenGlobal
} from '../common/settings';
import { createProduct } from '../reducers/db/sync_custom_product';
import { successLoadService } from '../reducers/db/sync_data_manager';
import {
  CHILDREN,
  LOGIN_FORM,
  SYNC_SCREEN,
  WORK_PLACE_FORM
} from '../constants/main-panel-types';
import {
  QUERY_GET_PRODUCT_BY_CATEGORY,
  QUERY_SEARCH_PRODUCT
} from '../constants/product-query';
import { SUCCESS_CHARGE } from '../constants/payment';
import { sumCartTotalPrice } from '../common/cart';

const cartCurrent = state => state.mainRd.cartCurrent;
const optionValue = state => state.mainRd.productOption.optionValue;
const customer = state => state.mainRd.cartCurrent.customer;
const posSystemConfig = state => state.mainRd.generalConfig.common_config;
export const timeSyncConfig = state =>
  state.mainRd.generalConfig.common_config.time_synchronized_for_modules;
const itemCartEditing = state => state.mainRd.itemCartEditing;
const currentPosCommand = state => state.mainRd.currentPosCommand;
const orderPreparingCheckoutState = state =>
  state.mainRd.checkout.orderPreparingCheckout;
const guestInfo = state =>
  state.mainRd.generalConfig.common_config.default_guest_checkout;
const allDevices = state => state.mainRd.hidDevice.allDevices;
const orderDetailLocalDb = state => state.mainRd.orderHistoryDetailOffline;
const orderDetailOnline = state => state.mainRd.orderHistoryDetail;
const cardPayment = state => state.mainRd.checkout.cardPayment;
const orderList = state => state.mainRd.orderHistory;
const detailOutlet = state => state.mainRd.generalConfig.detail_outlet;
const isOpenDetailOrderOnline = state => state.mainRd.isOpenDetailOrder;
const isOpenDetailOrderOffline = state => state.mainRd.isOpenDetailOrderOffline;
const internetConnected = state => state.mainRd.internetConnected;

/**
 * Check login background
 * @returns void
 */
function* checkLoginBackgroundSaga() {
  const loggedDb = yield readLoggedDbFromLocal();
  console.info('login background is checking');

  // Load appInfo to reducer
  const appInfo = yield getAppInfoFromLocal();
  if (appInfo) {
    yield put({ type: typesAuthen.RECEIVED_APP_INFO, payload: appInfo });
    yield setAppInfoToGlobal(appInfo);
  }

  // Logged
  if (loggedDb !== false) {
    yield getDefaultDataFromLocal();
    yield put({ type: types.UPDATE_SWITCHING_MODE, payload: CHILDREN });
  } else {
    // If appInfo is exists, then show login form, else show work_place form
    console.log('not logged yet!');
    if (appInfo) {
      yield put({ type: types.UPDATE_SWITCHING_MODE, payload: LOGIN_FORM });
    } else {
      yield put({
        type: types.UPDATE_SWITCHING_MODE,
        payload: WORK_PLACE_FORM
      });
    }
  }
}

/**
 * Call this function first in all feature related to gateway api, this function
 * will re-login and set new liveToken
 * @returns void
 */
export function* reloadTokenFromLoggedLocalDB() {
  const loggedDb = yield readLoggedDbFromLocal();
  const lastTime = loggedDb.last_time;
  const dateLastTime = new Date(lastTime);
  const diffMinutes = differenceInMinutes(new Date(), dateLastTime);
  // Re-login to get new live token
  if (diffMinutes > 60) {
    const payload = loggedDb.login;
    yield singleLoginAction(payload);
  } else {
    setTokenGlobal(loggedDb.token);
  }
}

/**
 * Received shopInfo to set to reducer and settings all variables needed
 * @param payload
 * @returns void
 */
function* receivedGeneralConfig(payload) {
  yield put({
    type: types.RECEIVED_GENERAL_CONFIG,
    payload
  });
  window.enableOffline =
    payload.common_config.general_configuration.enable_offline_mode;
  window.currency = payload.currency_code;
}

function* startCashCheckoutActionSg(payload) {
  // Show cash modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: true });

  // Checkout action handling
  if (payload.payload !== true) yield checkoutActionSg();
}

/**
 * Apply customer info and shipping info to order preparing checkout
 * @returns void
 */
function* applyCustomerOrQuestAndShippingCheckout() {
  const defaultOutletShippingAddressResult = yield select(detailOutlet);
  let shippingAddress = null;
  if (!defaultOutletShippingAddressResult) {
    console.error('shipping address is null');
  } else {
    shippingAddress = defaultOutletShippingAddressResult.data;
  }

  const posSystemConfigResult = yield select(posSystemConfig);
  const detailOutletData = yield select(detailOutlet);
  const cartCurrentObjResult = yield select(cartCurrent);
  const detailOutletResult = detailOutletData.data;
  // Get customer info
  let customerInfo;
  if (cartCurrentObjResult.isGuestCustomer === true) {
    customerInfo = yield select(guestInfo);
  } else {
    // Get customer in cartCurrent
    const cartCurrentObjResult = yield select(cartCurrent);
    customerInfo = cartCurrentObjResult.customer;
  }
  yield put({
    type: types.UPDATE_CUSTOMER_INFO_AND_SHIPPING_ADDRESS_PREPARING_CHECKOUT,
    payload: {
      customer: customerInfo,
      shippingAddress,
      posSystemConfigResult,
      detailOutletResult
    }
  });
}

/**
 * Create quote and show cash model
 */
function* checkoutActionSg() {
  // Show loading pre order
  yield put({ type: types.UPDATE_LOADING_PREPARING_ORDER, payload: true });

  yield applyCustomerOrQuestAndShippingCheckout();
  // refresh input discount code
  // yield put({ type: types.REFRESH_DISCOUNT_CODE });

  yield getDiscountForCheckoutSaga();

  // Hide cash loading pre order
  yield put({
    type: types.UPDATE_LOADING_PREPARING_ORDER,
    payload: false
  });
}

/**
 * Get default product
 * @returns void
 */
function* getDefaultProductsFromLocal() {
  // Get default products
  const searchValue = '';
  const response = yield call(searchProductService, {
    searchValue,
    currentPage: 1
  });

  const productResult = response.length > 0 ? response : [];
  yield put({ type: types.RECEIVED_PRODUCT_RESULT, payload: productResult });
}

function* getAllCategoriesFromLocal() {
  const allCategories = yield getCategoriesFromLocal();
  yield put({ type: types.RECEIVED_ALL_CATEGORIES, payload: allCategories });
}

/**
 * Cash place order
 * @returns void
 */
function* cashCheckoutPlaceOrder() {
  // Start cash place order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: true });

  const cartCurrentResult = yield select(cartCurrent);
  const orderPreparingCheckoutResult = yield select(
    orderPreparingCheckoutState
  );
  yield createOrderLocal({
    cartCurrentResult,
    orderPreparingCheckoutResult
  });

  // Copy cart current to cart in receipt
  yield put({ type: types.COPY_CART_CURRENT_TO_RECEIPT });

  // Stop cash loading order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: false });

  // Close cash place order modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: false });

  yield finalCheckoutStep();
}

function* finalCheckoutStep() {
  // Open receipt modal
  yield put({ type: types.OPEN_RECEIPT_MODAL });

  // Clean cart current
  yield put({ type: types.CLEAN_CART_CURRENT });
}

/**
 * Search action
 * @returns void
 * @param payload
 */
function* searchProduct(payload) {
  // Start loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_HANDLE, payload: true });

  const searchResult = yield call(searchProductService, {
    searchValue: payload.payload,
    currentPage: 1
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
  yield put({ type: types.RECEIVED_PRODUCT_RESULT, payload: productResult });
  // Stop loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_HANDLE, payload: false });
}

function* searchProductLazy(searchValue, currentPage) {
  const searchResult = yield call(searchProductService, {
    searchValue,
    currentPage
  });
  if (searchResult.length > 0) {
    // Join product result
    yield put({ type: types.JOIN_PRODUCT_RESULT, payload: searchResult });
    return true;
  }
  return false;
}

/**
 * Get detail product configurable
 * @param payload
 * @returns void
 */
function* getDetailProductConfigurable(payload) {
  yield startLoadingProductOption();
  const productDetailSingle = yield cloneDetailProduct(payload.payload.item);

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

  const productDetailSingle = yield cloneDetailProduct(payload.payload.item);

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

  const products = yield cloneDetailProduct(payload.payload.item);

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
  console.log(payload);
  const searchResult = yield call(searchCustomer, payload);

  const searchResultByName = yield call(searchCustomerByName, payload);
  const searchDbResult = yield call(searchCustomerDbService, payload);
  const mergeArray = searchResult.items.concat(
    searchResultByName.items,
    searchDbResult
  );
  searchResult.items = mergeArray;
  console.log('search in customer in db');
  console.log(searchDbResult);

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
  console.log('add to cart');
  console.log(payload);
  // Find sky if exits sku, then increment qty
  const listCartCurrent = yield select(cartCurrent);
  const cartCustomerResult = yield select(customer);

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

  // Update qty
  if (found === 1) {
    foundItem = yield updateQtyProduct(foundItem);
    const productAssign = yield calcPrice(foundItem, cartCustomerResult);
    yield put({
      type: types.UPDATE_ITEM_CART,
      payload: { index: foundIndex, item: productAssign }
    });
  } else {
    // Add new product
    const productAssign = yield calcPrice(product, cartCustomerResult);
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
 * Get product by category
 * @param payload
 * @returns void
 */
function* getProductByCategory(payload) {
  // Start loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: true });

  const categoryId = payload.payload;

  const productByCategory = yield call(getProductByCategoryService, {
    categoryId
  });
  yield put({
    type: types.RECEIVED_PRODUCT_RESULT,
    payload: productByCategory
  });

  // Stop loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: false });
}

/**
 * Get product by category with lazy loading
 * @param categoryId
 * @param currentPage
 * @returns void
 */
function* getProductByCategoryLazyLoad(categoryId, currentPage) {
  const productByCategory = yield call(getProductByCategoryService, {
    categoryId,
    currentPage
  });
  // If have no product returned
  if (productByCategory.length > 0) {
    // Join product result
    yield put({ type: types.JOIN_PRODUCT_RESULT, payload: productByCategory });
    return true;
  }

  return false;
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

  // Get orders from local db
  const allOrders = yield getAllOrders();
  // console.log('all orders:', JSON.stringify(allOrders));

  yield put({
    type: types.RECEIVED_ORDER_HISTORY_ACTION,
    payload: data.items,
    syncOrders: allOrders
  });
  yield put({ type: types.TURN_OFF_LOADING_ORDER_HISTORY });
}

function* signUpAction(payload) {
  yield put({ type: types.CHANGE_SIGN_UP_LOADING_CUSTOMER, payload: true });
  const offlineMode = yield getOfflineMode();

  if (offlineMode === 1) {
    const res = yield call(signUpCustomerServiceDb, payload);

    if (res.success)
      yield put({ type: types.TOGGLE_MODAL_SIGN_UP_CUSTOMER, payload: false });
    else
      yield put({
        type: types.MESSAGE_SIGN_UP_CUSTOMER,
        payload: res.message
      });
  } else {
    const res = yield call(signUpCustomerService, payload);

    if (res.success) {
      yield put({ type: types.TOGGLE_MODAL_SIGN_UP_CUSTOMER, payload: false });
    } else {
      yield put({
        type: types.MESSAGE_SIGN_UP_CUSTOMER,
        payload: res.data.errors[0].message
      });
    }
  }
  yield put({ type: types.CHANGE_SIGN_UP_LOADING_CUSTOMER, payload: false });
}

/**
 * Get discount when show cash checkout for offline mode
 * @returns void
 */
function* getDiscountForCheckoutSaga() {
  // Reload token first
  const internetConnectedResult = yield select(internetConnected);
  yield reloadTokenFromLoggedLocalDB();

  const cartCurrentObjResult = yield select(cartCurrent);
  // Handles for offline mode
  const posSystemConfigResult = yield select(posSystemConfig);

  const orderPreparingCheckoutStateResult = yield select(
    orderPreparingCheckoutState
  );
  const discountCode = orderPreparingCheckoutStateResult.totals.discount_code;

  let result;
  // const typeOfResult = typeof result;
  // If json type returned, that mean get discount success
  if (internetConnectedResult && typeof result !== 'string') {
    result = yield call(getDiscountForQuoteService, {
      cart: cartCurrentObjResult.data,
      config: posSystemConfigResult,
      discountCode
    });
  } else {
    console.log(cartCurrentObjResult);
    const sumTotalPriceResult = sumCartTotalPrice(cartCurrentObjResult);
    result = {
      cartTotals: {
        discount_amount: 0,
        base_grand_total: sumTotalPriceResult,
        base_subtotal: sumTotalPriceResult,
        tax_amount: 0
      }
    };
  }
  console.log('result get discount');
  console.log(result);
  yield put({
    type: types.RECEIVED_CHECKOUT_CART_INFO,
    payload: result
  });
}

function* reCheckRequireStepSaga() {
  // Start loading
  yield put({
    type: types.UPDATE_RE_CHECK_REQUIRE_STEP_LOADING,
    payload: true
  });

  yield checkLoginBackgroundSaga();

  // Stop loading
  yield put({
    type: types.UPDATE_RE_CHECK_REQUIRE_STEP_LOADING,
    payload: false
  });
}

/**
 * Load product paging
 * @returns void
 */
function* loadProductPagingSaga() {
  const currentPosCommandResult = yield select(currentPosCommand);
  const queryType = currentPosCommandResult.query.type;
  const { lockPagingForFetching, reachedLimit } = currentPosCommandResult;

  if (
    queryType !== '' &&
    lockPagingForFetching === false &&
    reachedLimit === false
  ) {
    // Reset commandPos first
    yield put({ type: types.RESET_CURRENT_POS_COMMAND });

    // Start loading
    yield put({
      type: types.UPDATE_POS_COMMAND_FETCHING_PRODUCT,
      payload: true
    });

    // Lock paging for fetching
    yield put({
      type: types.UPDATE_IS_LOCK_PAGING_FOR_FETCHING,
      payload: true
    });

    // Counter up current page
    let { currentPage } = currentPosCommandResult.query;
    currentPage += 1;

    // If next page success
    // If isNext = true => get new products for paging success
    // If isNext = false => get new products for paging failure
    let isNext = false;

    switch (queryType) {
      case QUERY_GET_PRODUCT_BY_CATEGORY:
        {
          const { categoryId } = currentPosCommandResult.query;
          isNext = yield getProductByCategoryLazyLoad(categoryId, currentPage);
        }
        break;
      case QUERY_SEARCH_PRODUCT:
        {
          const { searchValue } = currentPosCommandResult.query;
          isNext = yield searchProductLazy(searchValue, currentPage);
        }
        break;
      default:
        break;
    }

    // Update current page counted to commandPos
    if (isNext === true) {
      yield put({ type: types.UPDATE_POST_COMMAND_CURRENT_PAGE, currentPage });
    } else {
      // Update to reached limit
      yield put({ type: types.UPDATE_REACHED_LIMIT, payload: true });
    }

    // Stop loading
    yield put({
      type: types.UPDATE_POS_COMMAND_FETCHING_PRODUCT,
      payload: false
    });

    // Unlock paging for fetching
    yield put({
      type: types.UPDATE_IS_LOCK_PAGING_FOR_FETCHING,
      payload: false
    });
  }
}

/**
 * Update qty in cart
 * @param payload
 * @returns void
 */
function* updateQtyCartItemSaga(payload) {
  const qty = payload.payload;
  const cartEditingResult = yield select(itemCartEditing);
  const cartCustomerResult = yield select(customer);
  const { index } = cartEditingResult;

  const product = Object.assign({}, cartEditingResult.item);

  // Update qty
  product.pos_qty = qty;

  const productAssign = yield calcPrice(product, cartCustomerResult);
  yield put({
    type: types.UPDATE_ITEM_CART,
    payload: { index, item: productAssign }
  });

  // Reset itemCartEditing
  yield put({ type: types.RESET_ITEM_CART_EDITING });
}

/**
 * Sync all data
 * @returns void
 */
function* writeCategoriesAndProductsToLocal() {
  // Get all categories
  const allCategories = yield call(getAllCategoriesService);
  // Sync categories to local db
  yield call(writeCategoriesToLocal, allCategories);

  // Sync products by categories
  yield call(writeProductsToLocal, allCategories);

  // Add Sync manager success
  yield call(successLoadService, typesAuthen.ALL_PRODUCT_SYNC);
}

function* createCustomizeProduct(payload) {
  const offlineMode = yield getOfflineMode();
  if (offlineMode === 1) {
    const status = yield call(createProduct, payload.payload);
    if (status)
      yield put({ type: types.ADD_TO_CART, payload: payload.payload });
  } else {
    // create custom product to magento with graphql
    yield put({ type: types.ADD_TO_CART, payload: payload.payload });
  }
}

function* showAllDevicesSaga() {
  const allDevices = yield getDevices();

  // Add default select
  allDevices.unshift({ product: '--Please select--' });
  yield put({ type: types.RECEIVED_ALL_DEVICES, payload: allDevices });
}

function autoConnectScannerDevice() {
  // const scannerConnectedSettings = yield getConnectedDeviceSettings();
  // if (scannerConnectedSettings) {
  //   const { vendorId, productId } = scannerConnectedSettings;
  //   console.log('obj result:', scannerConnectedSettings);
  //   yield connectHIDScanner(vendorId, productId, scannerConnectedSettings);
  // }
  console.log('auto scan');
}

/**
 * Scanner HID connecting
 * @param payload
 * @returns void
 */
function* connectToScannerDeviceSaga(payload) {
  // Reset error when connect to new device
  yield put({ type: types.UPDATE_ERROR_CONNECT, payload: false });

  const index = payload.payload;
  const allDevicesResult = yield select(allDevices);
  const deviceSelected = allDevicesResult[index];

  const { vendorId, productId } = deviceSelected;

  yield connectHIDScanner(vendorId, productId, deviceSelected);
}

function* connectHIDScanner(vendorId, productId, deviceSelected) {
  try {
    const scanner = new UsbScanner({
      vendorId,
      productId
    });

    window.scanner = scanner;

    // Push data to reducers for POS listen detection
    yield put({
      type: types.SCANNER_WAITING_FOR_CONNECT_LISTENING,
      payload: { vendorId, productId }
    });

    // Update connected succeeded
    yield put({ type: types.CONNECT_DEVICE_SUCCESS, payload: deviceSelected });

    // Create to local storage
    yield createConnectedDeviceSettings(deviceSelected);
  } catch (e) {
    console.error('error when connect scanner device:', e);
    yield put({ type: types.UPDATE_ERROR_CONNECT, payload: true });
  }
}

function* changeScannerDeviceSaga() {
  try {
    // Remove scanner device
    yield removeScannerDeviceConnected();
  } catch (e) {
    console.error('change scanner device error:', e);
  }
}

/**
 * Get product by sku from scanner
 * @param payload
 * @returns void
 */
function* getProductBySkuFromScannerSaga(payload) {
  const productResult = yield getProductBySkuFromScanner(payload.payload);
  // Pass this product to POS component
  yield put({
    type: types.TRIGGER_ADD_ITEM_TO_CART_FROM_SCANNER_BAR_CODE,
    payload: productResult
  });
}

function* noteOrderAction(payload) {
  console.log('in noteOrderAction');
  console.log(payload);
  yield put({ type: types.LOADING_NOTE_ORDER_ACTION, payload: true });
  const id = payload.data.entity_id;
  console.log(id);
  if (payload.synced) {
    yield call(noteOrderActionService, { message: payload.message, id });
    // get id and call service
  } else {
    // set in localdb
  }
  yield put({ type: types.LOADING_NOTE_ORDER_ACTION, payload: false });
  yield put({ type: types.TOGGLE_ACTION_ORDER_ADD_NOTE, payload: false });
  // yield put({type: types.})
}

function* reorderAction(payload) {
  console.log(payload);
  const itemList = payload.data.items.cartCurrentResult;
  // check cart current has product
  const cartCurrentResult = yield select(cartCurrent);
  if (cartCurrentResult.length > 0) {
    // hold cart current
    yield put({ type: types.HOLD_ACTION });
  }

  // if order in not sync yet will reuse order with param suit for checkout

  if (!payload.synced) {
    for (let i = 0; i < itemList.length; i += 1) {
      yield put({ type: types.ADD_TO_CART, payload: itemList[i] });
    }
  }
}

function* orderActionOffline(payload) {
  const data = yield select(orderDetailLocalDb);
  const dataList = yield select(orderList);
  let index;
  for (let i = 0; i < dataList.length; i += 1) {
    if (dataList[i].id) {
      if (dataList[i].id === data.id) index = i;
    }
  }
  switch (payload.action) {
    case types.CANCEL_ACTION_ORDER:
      yield cancelOrderService(data.id); // delete in localdb
      yield put({ type: types.REMOVE_ORDER_LIST, payload: index });
      break;
    case types.REORDER_ACTION_ORDER:
      yield reorderAction({ data, synced: false });
      break;
    case types.NOTE_ORDER_ACTION:
      yield noteOrderAction({ data, synced: false, message: payload.payload });
      break;
    default:
      break;
  }
}

function* orderActionOnline(payload) {
  const data = yield select(orderDetailOnline);
  console.log(payload.action);
  switch (payload.action) {
    case types.REORDER_ACTION_ORDER:
      yield reorderAction({ data, synced: true });
      break;
    case types.NOTE_ORDER_ACTION:
      yield noteOrderAction({ data, synced: true, message: payload.payload });
      break;
    default:
      break;
  }
}

// type of order action to call in saga
function isShowingDetailOrder(orderHistoryDetail, isOpenDetailOrder) {
  // Object.entries(obj).length > 0 to check in object empty or not
  return Object.entries(orderHistoryDetail).length > 0 && isOpenDetailOrder;
}

function isShowingDetailOrderOffline(
  orderHistoryDetailOffline,
  isOpenDetailOrderOffline
) {
  return (
    Object.entries(orderHistoryDetailOffline).length > 0 &&
    isOpenDetailOrderOffline
  );
}

function* selectTypeOrderAction() {
  const orderHistoryDetailResult = yield select(orderDetailOnline);
  const orderHistoryDetailOfflineResult = yield select(orderDetailLocalDb);
  const isOpenDetailOrderOnlineResult = yield select(isOpenDetailOrderOnline);
  const isOpenDetailOrderOfflineResult = yield select(isOpenDetailOrderOffline);
  if (
    isShowingDetailOrder(
      orderHistoryDetailResult,
      isOpenDetailOrderOnlineResult
    )
  )
    return types.DETAIL_ORDER_ONLINE;
  if (
    isShowingDetailOrderOffline(
      orderHistoryDetailOfflineResult,
      isOpenDetailOrderOfflineResult
    )
  )
    return types.DETAIL_ORDER_OFFLINE;
}

function* orderAction(params) {
  const { action, payload } = params.payload;
  const typeOf = yield selectTypeOrderAction();
  console.log(typeOf);
  switch (typeOf) {
    case types.DETAIL_ORDER_OFFLINE:
      yield orderActionOffline({ action, payload });
      break;
    case types.DETAIL_ORDER_ONLINE:
      yield orderActionOnline({ action, payload });
      break;
    default:
  }
}

/**
 * Accept payment card
 * @returns void
 */
function* cardCheckoutPlaceOrderActionSg() {
  // Start button payment loading
  yield put({ type: types.START_CARD_PAYMENT_LOADING, payload: true });

  const cardPaymentResult = yield select(cardPayment);
  const orderPreparingCheckoutStateResult = yield select(
    orderPreparingCheckoutState
  );
  const ordersGrandTotal = orderPreparingCheckoutStateResult.totals.grand_total;
  const cardType = cardPaymentResult.type;
  // Get total amount in current cart

  let resultCode = 0;
  switch (cardType) {
    case 'stripe':
      resultCode = yield call(stripeMakePayment, ordersGrandTotal);
      break;
    case 'authorize':
      resultCode = yield call(authorizeMakePayment, ordersGrandTotal);
      break;
    default:
      break;
  }

  // Update result code
  yield put({ type: types.UPDATE_PAYMENT_RESULT_CODE, payload: resultCode });

  // Stop button payment loading
  yield put({ type: types.START_CARD_PAYMENT_LOADING, payload: false });

  if (resultCode === SUCCESS_CHARGE) {
    // Show receipt after charged
    yield finalCheckoutStep();
  }
}

/**
 * For auto login to get new token
 * @param _payload
 * @returns void
 */
function* singleLoginAction(_payload) {
  const payload = { payload: _payload };
  const resultLogin = yield call(loginService, payload);
  if (resultLogin.status) {
    // Write logged info to local
    yield writeLoggedInfoToLocal({
      login: payload.payload,
      token: resultLogin.data
    });

    // Write token to local
    const token = resultLogin.data;
    setTokenGlobal(token);
  }
}

function* loginAction(payload) {
  // Start loading
  yield put({ type: typesAuthen.START_LOADING });
  const resultLogin = yield call(loginService, payload);

  if (resultLogin && resultLogin.status) {
    const token = resultLogin.data;
    setTokenGlobal(token);
    // Kiểm tra key last_time_logout nếu có thì có nghĩa là đã đăng nhập và các
    // sản phẩm đã được sync rồi nên không cần thiết phải sync lại
    const lastTimeLogout = yield readLastTimeLogoutFromLocal();
    if (lastTimeLogout === false) {
      // Update to sync component
      yield put({
        type: typesAuthen.UPDATE_SWITCHING_MODE,
        payload: SYNC_SCREEN
      });
      // Start setup step 1
      yield setupFetchingAppInfo(); // added sync manager success

      // Start setup step 2
      yield setupSyncCategoriesAndProducts(); // added sync manager success

      // Get default data from local
      yield getDefaultDataFromLocal();
    } else {
      // Get default data from local
      yield getDefaultDataFromLocal();

      // Go to POS page
      yield put({
        type: typesAuthen.UPDATE_SWITCHING_MODE,
        payload: CHILDREN
      });
    }

    // Write logged info to local
    yield writeLoggedInfoToLocal({
      login: payload.payload,
      token: resultLogin.data
    });
    // Setup empty error message
    yield put({
      type: typesAuthen.ERROR_LOGIN,
      payload: ''
    });
  } else {
    yield put({
      type: typesAuthen.ERROR_LOGIN,
      payload: resultLogin.message
    });
  }

  // Stop loading
  yield put({ type: typesAuthen.STOP_LOADING });
}

/**
 * Bootstrap application and load all config
 * @returns void
 */
export function* setupFetchingAppInfo() {
  const shopInfoResponse = yield call(getShopInfoService);
  // Write appInfo to local and update fetching appInfo to done
  yield writeGeneralConfigToLocal(shopInfoResponse);

  // Add Sync manager success
  yield call(successLoadService, typesAuthen.GENERAL_CONFIG_SYNC);
  // Auto connect scanner device
  autoConnectScannerDevice();

  // Done step 1
  yield put({ type: types.SETUP_UPDATE_STATE_FETCHING_CONFIG, payload: 1 });
}

/**
 * Setup sync categories and products to local
 * @returns void
 */
export function* setupSyncCategoriesAndProducts() {
  // Write categories and products to local
  yield writeCategoriesAndProductsToLocal();

  yield getDefaultDataFromLocal();

  // Done step 2
  yield put({
    type: types.SETUP_UPDATE_STATE_SYNCHRONIZING_CATEGORIES_AND_PRODUCTS,
    payload: 1
  });
}

export function* getDefaultDataFromLocal() {
  // Get all categories from local
  yield getAllCategoriesFromLocal();

  // Get shopInfo from local
  const config = yield getGeneralFromLocal();
  yield receivedGeneralConfig(config);

  // Get default products from local
  yield getDefaultProductsFromLocal();
}

/**
 * Default root saga
 * @returns void
 */
function* rootSaga() {
  yield takeEvery(types.SEARCH_ACTION, searchProduct);
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
  yield takeEvery(types.GET_ORDER_HISTORY_ACTION, getOrderHistory);
  yield takeEvery(types.GET_PRODUCT_BY_CATEGORY, getProductByCategory);
  yield takeEvery(types.GET_DEFAULT_PRODUCT, getDefaultProductsFromLocal);
  yield takeEvery(types.SIGN_UP_CUSTOMER, signUpAction);
  yield takeEvery(types.GET_ORDER_HISTORY_DETAIL_ACTION, getOrderHistoryDetail);
  yield takeEvery(typesAuthen.CHECK_LOGIN_BACKGROUND, checkLoginBackgroundSaga);
  yield takeEvery(types.UPDATE_QTY_CART_ITEM, updateQtyCartItemSaga);
  yield takeEvery(types.RE_CHECK_REQUIRE_STEP, reCheckRequireStepSaga);
  yield takeEvery(types.LOAD_PRODUCT_PAGING, loadProductPagingSaga);
  yield takeEvery(types.CREATE_CUSTOMIZE_PRODUCT, createCustomizeProduct);
  yield takeEvery(types.SHOW_ALL_DEVICES, showAllDevicesSaga);
  yield takeEvery(types.CONNECT_TO_SCANNER_DEVICE, connectToScannerDeviceSaga);
  yield takeEvery(types.CHANGE_SCANNER_DEVICE, changeScannerDeviceSaga);
  yield takeEvery(
    types.GET_PRODUCT_BY_SKU_FROM_SCANNER,
    getProductBySkuFromScannerSaga
  );

  yield takeEvery(types.ORDER_ACTION, orderAction);

  yield takeEvery(
    types.CARD_CHECKOUT_PLACE_ORDER_ACTION,
    cardCheckoutPlaceOrderActionSg
  );
  yield takeEvery(types.CHECKOUT_ACTION, checkoutActionSg);
  yield takeEvery(types.START_CASH_CHECKOUT_ACTION, startCashCheckoutActionSg);
  yield takeEvery(
    types.CASH_CHECKOUT_PLACE_ORDER_ACTION,
    cashCheckoutPlaceOrder
  );
  yield takeEvery(typesAuthen.LOGIN_ACTION, loginAction);
}

export default rootSaga;
