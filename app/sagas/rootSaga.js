// @flow
import { takeEvery, put, call, select, all } from 'redux-saga/effects';
import * as types from '../constants/root';
import {
  addProductToQuote,
  placeCashOrderService,
  createGuestCartService,
  addShippingInformationService,
  createInvoiceService,
  createShipmentService
} from './services/CartService';
import {
  searchProductService,
  getDetailProductConfigurableService,
  getDetailProductBundleService,
  getDetailProductGroupedService,
  getProductsService
} from './services/ProductService';
import {
  searchCustomer,
  getCustomerCartTokenService
} from './services/CustomerService';
import { createCustomerCartService } from './services/CustomerCartService';
import {
  handleProductType,
  reformatConfigurableProduct
} from '../common/product';
import { adminToken } from '../params';

const cartCurrent = state => state.mainRd.cartCurrent.data;
const cartCurrentToken = state => state.mainRd.cartCurrent.customerToken;
const cartId = state => state.mainRd.cartCurrent.cartId;
const cartIsGuestCustomer = state => state.mainRd.cartCurrent.isGuestCustomer;
const optionValue = state => state.mainRd.productOption.optionValue;
const customer = state => state.mainRd.cartCurrent.customer;

/**
 * Create quote function
 * @returns {IterableIterator<*>}
 */
function* cashCheckout() {
  // Show cash modal
  yield put({ type: types.UPDATE_SHOW_CASH_MODAL, payload: true });

  // Show cash loading pre order
  yield put({ type: types.UPDATE_CASH_LOADING_PREPARING_ORDER, payload: true });

  const {
    cartId,
    isGuestCustomer,
    customerToken
  } = yield getCustomerCartToken();

  // Add product item to cart
  const cartCurrentResult = yield select(cartCurrent);
  yield all(
    cartCurrentResult.map(item =>
      call(addProductToQuote, cartId, item.sku, {
        isGuestCustomer,
        customerToken
      })
    )
  );

  // Add shipping and get detail order
  const response = yield call(addShippingInformationService, cartId, {
    isGuestCustomer,
    customerToken
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

  const response = yield call(getProductsService);
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

  const orderId = yield call(placeCashOrderService, cartCurrentTokenResult, {
    cartIdResult,
    isGuestCustomer,
    customerToken: cartCurrentTokenResult
  });

  // Create invoice
  yield call(createInvoiceService, adminToken, orderId);

  // Create shipment
  const responseShipment = yield call(
    createShipmentService,
    adminToken,
    orderId
  );

  // Stop cash loading order loading
  yield put({ type: types.UPDATE_CASH_PLACE_ORDER_LOADING, payload: false });

  console.log('res invoice:', responseShipment);
}

/**
 * Search action
 * @param searchValue
 * @returns {Generator<<"CALL", CallEffectDescriptor<RT>>, *>}
 */
function* search(searchValue) {
  const searchResult = yield call(searchProductService, searchValue);
  console.log('search result:', searchResult);
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
  const productSku = payload.payload.sku;

  let found = 0;
  let foundItem = null;
  let foundIndex = 0;

  for (let i = 0; i < listCartCurrent.length; i += 1) {
    const item = listCartCurrent[i];

    if (item.sku === productSku) {
      foundIndex = i;
      found = 1;
      foundItem = item;
    }
  }

  if (found === 1) {
    // Edit
    yield put({
      type: types.UPDATE_ITEM_CART,
      payload: { index: foundIndex, item: foundItem }
    });
  } else {
    // Add new
    yield put({ type: types.ADD_ITEM_TO_CART, payload });
  }
}

/**
 * Default root saga
 * @returns {Generator<<"FORK", ForkEffectDescriptor<RT>>, *>}
 */
function* rootSaga() {
  yield takeEvery(types.CASH_CHECKOUT_ACTION, cashCheckout);
  yield takeEvery(types.SEARCH_ACTION, search);
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
}

export default rootSaga;
