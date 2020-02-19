import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { differenceInMinutes } from 'date-fns';
import { getDevices, UsbScanner } from 'usb-barcode-scanner-brainos';
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
  syncAllProducts,
  getProductBySkuFromScanner
} from './services/ProductService';
import {
  getCustomerCartTokenService,
  searchCustomer,
  searchCustomerByName,
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
  createConnectedDeviceSettings,
  createSyncAllDataFlag,
  haveToSyncAllData,
  getConnectedDeviceSettings,
  removeScannerDeviceConnected
} from './services/SettingsService';
import {
  getInfoCashierService,
  getLoggedDb,
  getMainUrlKey
} from './services/LoginService';
import { sumCartTotalPrice } from '../common/cart';

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
  RECEIVED_MAIN_URL,
  STOP_LOADING
} from '../constants/authen';
import { syncCategories } from '../reducers/db/categories';
import { syncCustomers } from '../reducers/db/customers';
import { signUpCustomer } from '../reducers/db/sync_customers';
import { getAllOrders } from '../reducers/db/sync_orders';
import { counterProduct, getProductBySku } from '../reducers/db/products';
import { getOfflineMode } from '../common/settings';
import {
  CHILDREN,
  LOGIN_FORM,
  SYNC_SCREEN,
  LINK_CASHIER_TO_ADMIN_REQUIRE
} from '../constants/main-panel-types';
import {
  QUERY_GET_PRODUCT_BY_CATEGORY,
  QUERY_SEARCH_PRODUCT
} from '../constants/product-query';

const cartCurrent = state => state.mainRd.cartCurrent.data;
const cartCurrentObj = state => state.mainRd.cartCurrent;
const cartCurrentToken = state => state.mainRd.cartCurrent.customerToken;
const cartId = state => state.mainRd.cartCurrent.cartId;
const cartIsGuestCustomer = state => state.mainRd.cartCurrent.isGuestCustomer;
const optionValue = state => state.mainRd.productOption.optionValue;
const customer = state => state.mainRd.cartCurrent.customer;
const posSystemConfig = state => state.mainRd.posSystemConfig;
const cashierInfo = state => state.authenRd.cashierInfo;
const itemCartEditing = state => state.mainRd.itemCartEditing;
const currentPosCommand = state => state.mainRd.currentPosCommand;
const orderPreparingCheckout = state =>
  state.mainRd.checkout.orderPreparingCheckout;
const allDevices = state => state.mainRd.hidDevice.allDevices;

/**
 * Create quote and show cash model
 */
function* cashCheckout() {
  // Show cash modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: true });

  // Show cash loading pre order
  yield put({ type: types.UPDATE_CASH_LOADING_PREPARING_ORDER, payload: true });

  const offlineMode = yield getOfflineMode();
  const cartCurrentResultObj = yield select(cartCurrentObj);

  if (offlineMode === 1) {
    // eslint-disable-next-line prefer-destructuring
    const currencyCode = window.currency;
    const totalPrice = sumCartTotalPrice(
      cartCurrentResultObj,
      currencyCode,
      false
    );

    const fakeResponse = {
      payment_methods: [],
      totals: {
        base_subtotal: totalPrice,
        discount_amount: 0,
        base_shipping_amount: 0,
        grand_total: totalPrice
      }
    };
    yield put({
      type: types.RECEIVED_ORDER_PREPARING_CHECKOUT,
      payload: fakeResponse
    });
  } else {
    // Handles for online mode
    const posSystemConfigResult = yield select(posSystemConfig);
    const posSystemConfigGuestCustomer = posSystemConfigResult[3];
    const defaultShippingMethod = yield getDefaultShippingMethod();
    const cartCurrentResult = yield select(cartCurrent);

    const {
      cartId,
      isGuestCustomer,
      customerToken,
      defaultGuestCheckout
    } = yield getCustomerCart();

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
      posSystemConfigGuestCustomer,
      defaultGuestCheckout
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
 * @returns void
 */
function* getCustomerCart() {
  const customerRdResult = yield select(customer);
  const posSystemConfigResult = yield select(posSystemConfig);
  const defaultGuestCheckout = posSystemConfigResult.default_guest_checkout;

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
    customerToken,
    defaultGuestCheckout
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
  const response = yield call(searchProductService, {
    searchValue,
    currentPage: 1
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
    const orderPreparingCheckoutResult = yield select(orderPreparingCheckout);
    yield createOrderLocal({ cartCurrentResult, orderPreparingCheckoutResult });

    // Copy cart current to cart in receipt
    yield put({ type: types.COPY_CART_CURRENT_TO_RECEIPT });
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
  console.log(payload);
  const searchResult = yield call(searchCustomer, payload);
  const searchResultByName = yield call(searchCustomerByName, payload);
  const mergeArray = searchResult.items.concat(searchResultByName.items);
  searchResult.items = mergeArray;
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
    console.log('after cal price:', productAssign);
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

function* getCustomReceipt(outletId) {
  const customReceiptResult = yield call(getCustomReceiptService, outletId);
  if (customReceiptResult.length > 0) {
    const result = customReceiptResult[0];
    yield put({ type: types.RECEIVED_CUSTOM_RECEIPT, payload: result.data });
  }
}

/**
 * Get pos general config
 * @returns void
 */
function* getPostConfigGeneralConfig() {
  // Get shop info
  const shopInfoResponse = yield call(getShopInfoService);
  yield put({
    type: types.RECEIVED_SHOP_INFO_CONFIG,
    payload: shopInfoResponse
  });

  // eslint-disable-next-line prefer-destructuring
  window.currency = shopInfoResponse[0];

  // Get all cashier info
  const cashierInfo = yield call(getInfoCashierService);
  yield put({ type: types.RECEIVED_CASHIER_INFO, payload: cashierInfo });

  const outletId = cashierInfo.outlet_id;
  const detailOutlet = yield call(getDetailOutletService, outletId);
  yield put({ type: types.RECEIVED_DETAIL_OUTLET, payload: detailOutlet });

  // Get custom receipt
  yield getCustomReceipt(outletId);

  // Get all categories
  const allCategories = yield call(getAllCategoriesService);
  yield put({ type: types.RECEIVED_ALL_CATEGORIES, payload: allCategories });

  // Get default products
  yield getDefaultProduct();
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

  if (haveToSync.length === 0) {
    letSync = true;
  } else {
    const timePeriod = 15;
    const obj = haveToSync[0];
    const time = obj.update_at ? obj.update_at : obj.created_at;
    const distanceMinute = differenceInMinutes(new Date(), new Date(time));
    if (distanceMinute > timePeriod) {
      letSync = true;
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

      // Update time to flag sync
      yield createSyncAllDataFlag();

      // Update counterMode for recheck background
      yield put({ type: types.UPDATE_FLAG_SWITCHING_MODE });
    } else {
      console.warn(
        'offline mode not on, pls enable offline mode and connect to the internet'
      );
    }
  } else {
    console.info('not sync yet!');
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
 * Check login background
 * @returns void
 */
function* checkLoginBackgroundSaga() {
  const loggedDb = yield getLoggedDb();
  console.info('login background checking');
  // Logged
  if (loggedDb !== false) {
    // Get main url key
    const data = yield call(getMainUrlKey);
    if (data.status) {
      const { url } = data.payload.value;
      yield put({ type: RECEIVED_MAIN_URL, payload: url });
      window.mainUrl = url;
    }

    // Set token first
    const { token } = loggedDb.value;

    // Assign to global variables
    window.liveToken = token;

    // Set token to reducers
    yield put({ type: RECEIVED_TOKEN, payload: token });

    // Call get system config first
    const configGeneralResponse = yield call(getSystemConfigService);
    yield put({
      type: types.RECEIVED_POST_GENERAL_CONFIG,
      payload: configGeneralResponse
    });

    // eslint-disable-next-line prefer-destructuring
    window.config = configGeneralResponse[0];
    const offlineMode = yield getOfflineMode();
    const counterProductLocal = yield counterProduct();

    // Call cashier api
    const cashierInfo = yield call(getInfoCashierService);
    yield put({ type: types.RECEIVED_CASHIER_INFO, payload: cashierInfo });

    // If form invalid
    if (
      !cashierInfo.cashier_id ||
      (!cashierInfo.outlet_id || cashierInfo.outlet_id === 0) ||
      cashierInfo.active === false
    ) {
      // Show form please link cashier to outlet
      yield put({
        type: types.UPDATE_SWITCHING_MODE,
        payload: LINK_CASHIER_TO_ADMIN_REQUIRE
      });
    } else {
      // All it's ok
      yield bootstrapApplicationSaga();

      // If offline enabled and have no product sync => Show sync screen
      if (offlineMode === 1 && counterProductLocal === 0) {
        // Show screen sync
        yield put({ type: types.UPDATE_SWITCHING_MODE, payload: SYNC_SCREEN });
        yield syncData();
      } else {
        yield put({ type: types.UPDATE_SWITCHING_MODE, payload: CHILDREN });
        yield syncData();
      }

      // Stop login loading
      yield put({ type: STOP_LOADING });
    }
  } else {
    // Not login yet =
    yield put({ type: types.UPDATE_SWITCHING_MODE, payload: LOGIN_FORM });
  }
}

/**
 * Skip sync form and go to main POS
 * @returns void
 */
function* gotoChildrenPanelTriggerSaga() {
  yield getDefaultProduct();
  yield put({ type: types.UPDATE_SWITCHING_MODE, payload: CHILDREN });
  // Update counter for switch detect
  yield put({ type: types.UPDATE_FLAG_SWITCHING_MODE });
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
 * Bootstrap application and load all config
 * @returns void
 */
function* bootstrapApplicationSaga() {
  // Get all config
  yield getPostConfigGeneralConfig();

  // Auto connect scanner device
  yield autoConnectScannerDevice();

  // Apply all main settings
  const posSystemConfigResult = yield select(posSystemConfig);
  const generalConfig = posSystemConfigResult.general_configuration;
  const posTitle = generalConfig.pos_title;
  document.title = posTitle;
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
    console.log('obj result:', scannerConnectedSettings);
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
  console.log('product result:', productResult);
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
  yield takeEvery(types.GET_ORDER_HISTORY_ACTION, getOrderHistory);
  yield takeEvery(types.GET_PRODUCT_BY_CATEGORY, getProductByCategory);
  yield takeEvery(types.SIGN_UP_CUSTOMER, signUpAction);
  yield takeEvery(types.GET_ORDER_HISTORY_DETAIL_ACTION, getOrderHistoryDetail);
  yield takeEvery(
    types.GET_DISCOUNT_FOR_OFFLINE_CHECKOUT,
    getDiscountForOfflineCheckoutSaga
  );
  yield takeEvery(CHECK_LOGIN_BACKGROUND, checkLoginBackgroundSaga);
  yield takeEvery(types.UPDATE_QTY_CART_ITEM, updateQtyCartItemSaga);
  yield takeEvery(
    types.GO_TO_CHILDREN_PANEL_TRIGGER,
    gotoChildrenPanelTriggerSaga
  );
  yield takeEvery(types.RE_CHECK_REQUIRE_STEP, reCheckRequireStepSaga);
  yield takeEvery(types.LOAD_PRODUCT_PAGING, loadProductPagingSaga);
  yield takeEvery(types.SHOW_ALL_DEVICES, showAllDevicesSaga);
  yield takeEvery(types.CONNECT_TO_SCANNER_DEVICE, connectToScannerDeviceSaga);
  yield takeEvery(types.CHANGE_SCANNER_DEVICE, changeScannerDeviceSaga);
  yield takeEvery(
    types.GET_PRODUCT_BY_SKU_FROM_SCANNER,
    getProductBySkuFromScannerSaga
  );
}

export default rootSaga;
