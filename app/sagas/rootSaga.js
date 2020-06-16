import { call, put, select, takeEvery } from 'redux-saga/effects';
import { getDevices, UsbScanner } from 'usb-barcode-scanner-brainos';
import { differenceInMinutes } from 'date-fns';
import * as types from '../constants/root';
import * as typesAuthen from '../constants/authen.json';
import {
  getDiscountForQuoteService,
  createOrderLocal,
  getRewardPointService,
  getActionOrder,
  setActionOrder
} from './services/cart-service';
import { stripeMakePayment } from './services/payments/stripe-payment';
import { authorizeMakePayment } from './services/payments/authorize-payment';
import {
  getProductByCategoryService,
  getProductByBarcodeFromScanner,
  searchProductService,
  writeProductsToLocal,
  fetchingAndWriteProductBarCodeInventory,
  fetchingAndWriteProductInventory
} from './services/product-service';
import {
  searchCustomer,
  searchCustomerByName,
  searchCustomerDbService,
  signUpCustomerServiceDb
} from './services/customer-service';
import {
  getAllCategoriesService,
  getShopInfoService,
  getAllCategoriesByParentIdService
} from './services/common-service';
import {
  createConnectedDeviceSettings,
  removeScannerDeviceConnected,
  getConnectedDeviceSettings
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
  getRootCategoriesFromLocal,
  writeCategoriesToLocal
} from '../reducers/db/categories';
import { syncCustomers } from '../reducers/db/customers';
import { setAppInfoToGlobal, setTokenGlobal } from '../common/settings';
import { createProductDb } from '../reducers/db/sync_custom_product';
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
    // Auto connect scanner
    yield autoConnectScannerDevice();
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
  let shippingAddress = yield select(detailOutlet);
  if (!shippingAddress) {
    console.error('shipping address is null');
    shippingAddress = null;
  }

  const posSystemConfigResult = yield select(posSystemConfig);
  const detailOutletResult = yield select(detailOutlet);
  const cartCurrentObjResult = yield select(cartCurrent);
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

function* getAllCategoriesFromLocal() {
  const allCategories = yield getRootCategoriesFromLocal();
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
  yield reloadTokenFromLoggedLocalDB();
  // Start search loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_CUSTOMER, payload: true });
  console.log(payload);
  const searchResult = yield call(searchCustomer, payload);

  const searchResultByName = yield call(searchCustomerByName, payload);
  let searchDbResult = yield call(searchCustomerDbService, payload);
  searchDbResult = searchDbResult.map(item => item.payload.customer);
  const mergeArray = searchResult.items.concat(
    searchResultByName.items,
    searchDbResult
  );
  searchResult.items = mergeArray;
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
 * @returns void
 * @param payloadParams
 */
function* addToCart(payloadParams) {
  const payload = payloadParams;
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
    for (let i = 0; i < listCartCurrent.data.length; i += 1) {
      const item = listCartCurrent.data[i];

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


function* signUpAction(payload) {
  yield put({ type: types.CHANGE_SIGN_UP_LOADING_CUSTOMER, payload: true });
  // signUp action
  try {
    const res = yield call(signUpCustomerServiceDb, payload);
    if (!res.message) {
      const { firstname, email } = payload.payload.customer;
      const paramPayload = {
        email,
        first_name: firstname,
        synced: false,
        password: payload.payload.password,
        payload: payload.payload
      };
      yield put({
        type: types.SELECT_CUSTOMER_FOR_CURRENT_CART,
        payload: paramPayload
      });
      // Hide sign up customer
      yield put({ type: types.TOGGLE_MODAL_SIGN_UP_CUSTOMER, payload: false });

      // Show choose customer
      yield put({ type: types.TOGGLE_MODAL_CUSTOMER, payload: true });
    } else {
      // eslint-disable-next-line no-throw-literal
      throw { message: res.message };
    }
  } catch (e) {
    yield put({
      type: types.MESSAGE_SIGN_UP_CUSTOMER,
      payload: e
    });
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
  const listGiftCard =
    orderPreparingCheckoutStateResult.totals.listGiftCard_code;
  let result;
  let customerId;
  try {
    customerId = cartCurrentObjResult.customer.id;
  } catch (e) {
    customerId = posSystemConfigResult.default_guest_checkout.customer_id;
  }
  // const typeOfResult = typeof result;
  // If json type returned, that mean get discount success
  if (internetConnectedResult) {
    try {
      result = yield call(getDiscountForQuoteService, {
        cart: cartCurrentObjResult.data,
        customerId,
        discountCode,
        listGiftCard
      });
    } catch (e) {
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
  } else {
    console.log('internet not connected');
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

  const categoryMain = allCategories.main;
  // Sync products by categories
  yield call(writeProductsToLocal, categoryMain);
}

export function* writeProductBarCodeInventoryToLocal() {
  yield fetchingAndWriteProductBarCodeInventory();
  // Update done step 3
  yield put({
    type: types.SETUP_UPDATE_STATE_SYNC_PRODUCT_BAR_CODE_INVENTORY,
    payload: 1
  });
}

export function* syncProductInventoryToLocal() {
  yield fetchingAndWriteProductInventory();
  // Update done step 4
  yield put({
    type: types.SETUP_UPDATE_STATE_SYNC_PRODUCT_INVENTORY,
    payload: 1
  });
}

function* createCustomizeProduct(payload) {
  yield call(createProductDb, payload.payload);
  yield put({ type: types.ADD_TO_CART, payload: payload.payload });
}

function* showAllDevicesSaga() {
  const allDevices = yield getDevices();
  // Add default select
  allDevices.unshift({ product: '--Please select--' });
  yield put({ type: types.RECEIVED_ALL_DEVICES, payload: allDevices });
}

function* autoConnectScannerDevice() {
  const scannerConnectedSettings = yield getConnectedDeviceSettings();
  if (scannerConnectedSettings) {
    const { vendorId, productId } = scannerConnectedSettings;
    yield connectHIDScanner(vendorId, productId, scannerConnectedSettings);
  }
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
    console.info('error when connect scanner device:', e);
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
function* getProductByBarcodeFromScannerSaga(payload) {
  const productResult = yield getProductByBarcodeFromScanner(payload.payload);
  if (productResult) {
    // Pass this product to POS component
    yield put({
      type: types.TRIGGER_ADD_ITEM_TO_CART_FROM_SCANNER_BAR_CODE,
      payload: { product: productResult.product, qty: productResult.qty }
    });
  }
}

function* noteOrderAction(payload) {
  console.log(payload);
  const id = payload.data.entity_id;
  console.log(id);
  if (payload.synced) {
    // get id and call service
  } else {
    // set in local db
  }
  yield put({ type: types.TOGGLE_MODAL_ACTION_ORDER, payload: false });
}

function* reorderAction(payload) {
  console.log(payload);
  const itemList = payload.data.items.cartCurrentResult.data;
  // check cart current is holding product or not
  const cartCurrentResult = yield select(cartCurrent);
  if (cartCurrentResult.data.length > 0) {
    // hold cart current
    yield put({ type: types.HOLD_ACTION });
  }

  // if order in not sync yet will reuse order with param suit for checkout
  for (let i = 0; i < itemList.length; i += 1) {
    yield put({ type: types.ADD_TO_CART, payload: itemList[i] });
  }
  // close toggle
  yield put({ type: types.CLOSE_TOGGLE_MODAL_DETAIL_ORDER });
}

function* getOrderActionOffline(payload) {
  const orderDetail = yield select(orderDetailLocalDb);
  console.log(orderDetail);
  const { orderId } = orderDetail.items.syncData;
  const params = { data: { orderId }, type: payload.action };
  let dataActionOrder;
  switch (payload.action) {
    case types.CANCEL_ACTION_ORDER:
      break;
    case types.REORDER_ACTION_ORDER:
      break;
    case types.ADD_NOTE_ACTION_ORDER:
      break;
    case types.REFUND_ACTION_ORDER:
      dataActionOrder = yield call(getActionOrder, params);
      break;
    default:
      break;
  }
  yield put({
    type: types.RECEIVED_GET_ACTION_ORDER,
    payload: { type: payload.action, data: dataActionOrder }
  });
}

function* setOrderActionOffline(payload) {
  const orderDetail = yield select(orderDetailLocalDb);
  let orderId;
  let items;
  let params;
  let resultActionOrder;
  switch (payload.action) {
    case types.CANCEL_ACTION_ORDER:
      break;
    case types.REORDER_ACTION_ORDER:
      console.log('reorder');
      yield reorderAction({ data: orderDetail, synced: true });
      break;
    case types.ADD_NOTE_ACTION_ORDER:
      break;
    case types.REFUND_ACTION_ORDER:
      ({ orderId } = orderDetail.items.syncData);
      ({ items } = payload.payload);
      params = {
        data: { orderId, ...payload.payload },
        type: payload.action
      };
      params.data.items = items.filter(item => item);
      resultActionOrder = yield call(setActionOrder, params);
      console.log(resultActionOrder);
      if (resultActionOrder.status) {
        // do something
        yield put({ type: types.TOGGLE_MODAL_ACTION_ORDER, payload: false });
      }
      break;
    default:
      break;
  }
  // yield put({
  //   type: types.RECEIVED_GET_ACTION_ORDER,
  //   payload: { type: payload.action, data: dataActionOrder }
  // });
}

function* orderActionOnline(payload) {
  const data = yield select(orderDetailOnline);
  switch (payload.action) {
    case types.REORDER_ACTION_ORDER:
      yield reorderAction({ data, synced: true });
      break;
    case types.ADD_NOTE_ACTION_ORDER:
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

/**
 * set order action used for submitting query message data
 * @param {*} params
 */
function* setOrderAction(params) {
  const { action, payload } = params.payload;
  const typeOf = yield selectTypeOrderAction();
  yield put({ type: types.LOADING_SET_ACTION_ORDER, payload: true });
  console.log(typeOf);
  switch (typeOf) {
    case types.DETAIL_ORDER_OFFLINE:
      yield setOrderActionOffline({ action, payload });
      break;
    case types.DETAIL_ORDER_ONLINE:
      yield orderActionOnline({ action, payload });
      break;
    default:
  }
  yield put({ type: types.LOADING_SET_ACTION_ORDER, payload: false });
}

/**
 * get order action used for getting query message data
 * @param {*} params
 */
function* getOrderAction(params) {
  const { action, payload } = params.payload;
  const typeOf = yield selectTypeOrderAction();
  yield put({ type: types.LOADING_GET_ACTION_ORDER, payload: true });
  switch (typeOf) {
    case types.DETAIL_ORDER_OFFLINE:
      yield getOrderActionOffline({ action, payload });
      break;
    case types.DETAIL_ORDER_ONLINE:
      yield orderActionOnline({ action, payload });
      break;
    default:
  }
  yield put({ type: types.LOADING_GET_ACTION_ORDER, payload: false });
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
      // Step 1: Get general config
      yield setupFetchingGeneralConfig();

      // Step 2: Start setup
      yield setupSyncCategoriesAndProducts();

      // Step 3: Sync product barcode to local
      yield writeProductBarCodeInventoryToLocal();

      // Step 4: Sync product inventory to local
      yield syncProductInventoryToLocal();

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
      payload: resultLogin
    });
  }

  // Stop loading
  yield put({ type: typesAuthen.STOP_LOADING });
}

/**
 * Bootstrap application and load all config
 * @returns void
 */
export function* setupFetchingGeneralConfig() {
  const shopInfoResponse = yield call(getShopInfoService);
  // Write appInfo to local and update fetching appInfo to done
  yield writeGeneralConfigToLocal(shopInfoResponse);
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
  yield getProductByCategory({ payload: 0 });
}

function* fetchRewardPointConditionSg() {
  // Check customer is selected from cartCurrent
  const cartCurrentResult = yield select(cartCurrent);
  const customerId = cartCurrentResult.customer
    ? cartCurrentResult.customer.id
    : null;
  if (customerId) {
    // Show reward point box and start loading
    yield put({ type: types.UPDATE_REWARD_POINT_BOX_LOADING, payload: true });
    const rewardPointResult = yield call(getRewardPointService, { customerId });

    // Received reward info and stop loading
    yield put({
      type: types.RECEIVED_REWARD_POINT_INFO,
      payload: rewardPointResult
    });
  } else {
    // Turn off reward point
  }
}

function* findChildCategoryParentIdSg(payload) {
  const cateId = payload.payload;
  const result = yield call(getAllCategoriesByParentIdService, cateId);
  // Update all categories
  yield put({ type: types.RECEIVED_ALL_CATEGORIES, payload: result });
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
  yield takeEvery(types.GET_PRODUCT_BY_CATEGORY, getProductByCategory);
  yield takeEvery(types.SIGN_UP_CUSTOMER, signUpAction);
  yield takeEvery(typesAuthen.CHECK_LOGIN_BACKGROUND, checkLoginBackgroundSaga);
  yield takeEvery(types.UPDATE_QTY_CART_ITEM, updateQtyCartItemSaga);
  yield takeEvery(types.RE_CHECK_REQUIRE_STEP, reCheckRequireStepSaga);
  yield takeEvery(types.LOAD_PRODUCT_PAGING, loadProductPagingSaga);
  yield takeEvery(types.CREATE_CUSTOMIZE_PRODUCT, createCustomizeProduct);
  yield takeEvery(types.SHOW_ALL_DEVICES, showAllDevicesSaga);
  yield takeEvery(types.CONNECT_TO_SCANNER_DEVICE, connectToScannerDeviceSaga);
  yield takeEvery(types.CHANGE_SCANNER_DEVICE, changeScannerDeviceSaga);
  yield takeEvery(
    types.GET_PRODUCT_BY_BARCODE_FROM_SCANNER,
    getProductByBarcodeFromScannerSaga
  );

  yield takeEvery(types.SET_ORDER_ACTION, setOrderAction);
  yield takeEvery(types.GET_ORDER_ACTION, getOrderAction);
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
  yield takeEvery(
    types.FETCH_REWARD_POINT_CONDITION,
    fetchRewardPointConditionSg
  );
  yield takeEvery(
    types.FIND_CHILD_CATEGORY_BY_PARENT_ID,
    findChildCategoryParentIdSg
  );
}

export default rootSaga;
