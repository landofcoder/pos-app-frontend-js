// @flow
import { takeEvery, put, call, select, all } from 'redux-saga/effects';
import * as types from '../constants/root';
import {
  createGuestCartService,
  addProductToQuote,
  addShippingInformationService,
  getProductsService,
  placeCashOrderService
} from './services/GuestCartService';
import {
  searchProductService,
  getDetailProductConfigurableService,
  getDetailProductBundleService,
  getDetailProductGroupedService
} from './services/ProductService';
import { searchCustomer } from './services/CustomerService';
import {
  handleProductType,
  reformatConfigurableProduct
} from '../common/product';

const cartCurrent = state => state.mainRd.cartCurrent.data;
const cartCurrentToken = state => state.mainRd.cartCurrent.token;
const optionValue = state => state.mainRd.productOption.optionValue;

/**
 * Get list product
 * @returns {IterableIterator<*>}
 */
function* getListProduct() {
  yield put({ type: types.RECEIVED_LIST_PRODUCT });
}

/**
 * Create quote function
 * @returns {IterableIterator<*>}
 */
function* cashCheckout() {
  // Show cash loading pre order
  yield put({ type: types.UPDATE_CASH_LOADING_PREPARING_ORDER, payload: true });

  // Get cart customer
  const cartToken = yield call(createGuestCartService);

  // Update cart token to current quote
  yield put({
    type: types.UPDATE_CART_TOKEN_TO_CURRENT_CART,
    payload: cartToken
  });

  // Add product item to cart
  const cartCurrentResult = yield select(cartCurrent);
  yield all(
    cartCurrentResult.map(item => call(addProductToQuote, cartToken, item.sku))
  );
  // Add shipping and get detail order
  const response = yield call(addShippingInformationService, cartToken);
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
 * Get default product
 * @returns {Generator<*, *>}
 */
function* getDefaultProduct() {
  const response = yield call(getProductsService);
  const productResult = response.data ? response.data.products.items : [];
  yield put({ type: types.RECEIVED_PRODUCT_RESULT, payload: productResult });
}

/**
 * Cash place order
 * @returns {Generator<<"CALL", CallEffectDescriptor<RT>>, *>}
 */
function* cashCheckoutPlaceOrder() {
  const cartCurrentTokenResult = yield select(cartCurrentToken);
  const response = yield call(placeCashOrderService, cartCurrentTokenResult);
  console.log('place order response:', response);
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
  yield put({ type: types.UPDATE_IS_SHOWING_PRODUCT_OPTION, payload: true });
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
 * Default root saga
 * @returns {Generator<<"FORK", ForkEffectDescriptor<RT>>, *>}
 */
function* rootSaga() {
  yield takeEvery(types.FETCH_LIST_PRODUCT, getListProduct);
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
}

export default rootSaga;
