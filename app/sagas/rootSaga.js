// @flow
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import * as types from '../constants/root';
import {
  addProductToQuote,
  addShippingInformationService,
  createGuestCartService,
  createInvoiceService,
  createShipmentService,
  placeCashOrderService
} from './services/CartService';
import {
  getDetailProductBundleService,
  getDetailProductConfigurableService,
  getDetailProductGroupedService,
  searchProductService,
  getDefaultProductsService
} from './services/ProductService';
import {
  getCustomerCartTokenService,
  searchCustomer
} from './services/CustomerService';
import { createCustomerCartService } from './services/CustomerCartService';
import {
  getSystemConfigService,
  getShopInfoService
} from './services/CommonService';
import {
  handleProductType,
  reformatConfigurableProduct
} from '../common/product';
import { adminToken } from '../params';
import {
  getDefaultShippingMethod,
  getDefaultPaymentMethod
} from './common/orderSaga';
import { calcPrice } from '../common/productPrice';
import { BUNDLE } from '../constants/product-types';

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
 * Create quote function
 */
function* cashCheckout() {
  // Show cash modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: true });
  // Show cash loading pre order
  yield put({ type: types.UPDATE_CASH_LOADING_PREPARING_ORDER, payload: true });

  // Add product item to cart
  const cartCurrentResult = yield select(cartCurrent);
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
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: *, type: *}>>, *>}
 */
function* updateIsGuestCustomer(isGuestCustomer) {
  yield put({
    type: types.UPDATE_IS_GUEST_CUSTOMER_CURRENT_CART,
    payload: isGuestCustomer
  });
}

/**
 * Get default product
 * @returns {Generator<*, *>}
 */
function* getDefaultProduct() {
  // Start loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: true });

  // Set empty if want get default response from magento2
  const defaultProducts = '24-WG080';

  // const response = yield call(getDefaultProductsService);
  const response = yield call(searchProductService, {
    payload: defaultProducts
  });
  const productResult = response.data ? response.data.products.items : [];
  yield put({ type: types.RECEIVED_PRODUCT_RESULT, payload: productResult });

  // Stop loading
  yield put({ type: types.UPDATE_MAIN_PRODUCT_LOADING, payload: false });
}

/**
 * Cash place order
 * @returns {Generator<<"CALL", CallEffectDescriptor<RT>>, *>}
 */
function* cashCheckoutPlaceOrder() {
  // Start cash place order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: true });

  const cartCurrentTokenResult = yield select(cartCurrentToken);
  const isGuestCustomer = yield select(cartIsGuestCustomer);
  const cartIdResult = yield select(cartId);
  const posSystemConfigResult = yield select(posSystemConfig);
  const posSystemConfigCustomer = posSystemConfigResult[3];

  const defaultShippingMethod = yield getDefaultShippingMethod();

  // Default payment
  const defaultPaymentMethod = yield getDefaultPaymentMethod();

  const cashierInfo = yield select(cashierInfo);

  // Step 1: Create order
  const orderId = yield call(placeCashOrderService, cartCurrentTokenResult, {
    cartIdResult,
    isGuestCustomer,
    customerToken: cartCurrentTokenResult,
    defaultShippingMethod,
    defaultPaymentMethod,
    posSystemConfigCustomer,
    cashierInfo
  });

  // Step 2: Create invoice
  yield call(createInvoiceService, adminToken, orderId);

  // Step 3: Create shipment
  yield call(createShipmentService, adminToken, orderId);

  // Place order success, let show receipt and copy current cart to cartForReceipt
  yield put({ type: types.PLACE_ORDER_SUCCESS, orderId });

  // Stop cash loading order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: false });

  // Close cash place order modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: false });

  // Step 4: Open receipt modal
  yield put({ type: types.OPEN_RECEIPT_MODAL });
}

/**
 * Search action
 * @returns {Generator<<"CALL", CallEffectDescriptor<RT>>, *>}
 * @param payload
 */
function* searchProduct(payload) {
  // Start loading
  yield put({ type: types.UPDATE_IS_LOADING_SEARCH_HANDLE, payload: true });

  const searchResult = yield call(searchProductService, payload);
  const productResult = searchResult.data
    ? searchResult.data.products.items
    : [];

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

/**
 * Get detail product configurable
 * @param payload
 * @returns {Generator<<"CALL", CallEffectDescriptor<RT>>, *>}
 */
function* getDetailProductConfigurable(payload) {
  yield startLoadingProductOption();

  const productDetail = yield call(
    getDetailProductConfigurableService,
    payload
  );

  const productDetailSingle = productDetail.data.products.items[0];
  const productDetailReFormat = yield handleProductType(productDetailSingle);
  yield receivedProductOptionValue(productDetailReFormat);

  yield getDetailProductEndTask();
}

/**
 * Get detail bundle product
 * @returns {Generator<<"CALL", CallEffectDescriptor<RT>>, *>}
 */
function* getDetailBundleProduct(payload) {
  yield startLoadingProductOption();

  const productDetail = yield call(getDetailProductBundleService, payload);
  const productDetailSingle = productDetail.data.products.items[0];
  const productDetailReFormat = yield handleProductType(productDetailSingle);
  yield receivedProductOptionValue(productDetailReFormat);

  yield getDetailProductEndTask();
}

/**
 *
 * @returns {Generator<*, *>}
 */
function* getDetailGroupedProduct(payload) {
  yield startLoadingProductOption();

  const productDetail = yield call(getDetailProductGroupedService, payload);
  const products = productDetail.data.products.items[0];
  yield receivedProductOptionValue(products);

  yield getDetailProductEndTask();
}

/**
 *
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: boolean, type: *}>>, *>}
 */
function* startLoadingProductOption() {
  // Start loading for get product detail and option
  yield put({ type: types.UPDATE_IS_LOADING_PRODUCT_OPTION, payload: true });
}

/**
 *
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: boolean, type: *}>>, *>}
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
  // console.log('product detail reformat:', productDetailReFormat);
}

/**
 * Received product option value
 * @param productDetailReFormat
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: *, type: *}>>, *>}
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
 * @returns {Generator<<"CALL", CallEffectDescriptor>|<"PUT", PutEffectDescriptor<{payload: boolean, type: *}>>, *>}
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
}

/**
 * Add to cart function
 * @param payload
 * @returns {Generator<<"PUT", PutEffectDescriptor<{payload: *, type: *}>>|<"SELECT", SelectEffectDescriptor>, *>}
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
 * @returns {Generator<<"CALL", CallEffectDescriptor>, void, ?>}
 */
function* getPostConfigGeneralConfig() {
  // Start loading
  yield put({ type: types.UPDATE_IS_LOADING_SYSTEM_CONFIG, payload: true });

  // Get system config settings
  const configGeneralResponse = yield call(getSystemConfigService);

  // Get shop info
  const shopInfoResponse = yield call(getShopInfoService);

  yield put({
    type: types.RECEIVED_POST_GENERAL_CONFIG,
    payload: configGeneralResponse
  });

  yield put({
    type: types.RECEIVED_SHOP_INFO_CONFIG,
    payload: shopInfoResponse
  });

  // Stop loading
  yield put({ type: types.UPDATE_IS_LOADING_SYSTEM_CONFIG, payload: false });
}

/**
 * Default root saga
 * @returns {Generator<<"FORK", ForkEffectDescriptor<RT>>, *>}
 */
function* rootSaga() {
  yield takeEvery(types.CASH_CHECKOUT_ACTION, cashCheckout);
  yield takeEvery(types.SEARCH_ACTION, searchProduct);
  yield takeEvery(types.GET_DEFAULT_PRODUCT, getDefaultProduct);
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
  yield takeEvery(types.GET_POS_GENERAL_CONFIG, getPostConfigGeneralConfig);
}

export default rootSaga;
