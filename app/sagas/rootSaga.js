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
  getDetailProductConfigurableService
} from './services/ProductService';
import { handleProductType, findUsedConfigurable } from '../common/product';

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

  // Create quote
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
  const productResult = response.items ? response.items : [];
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
  // Start loading for get product detail and option
  yield put({ type: types.UPDATE_IS_LOADING_PRODUCT_OPTION, payload: true });

  const productDetail = yield call(
    getDetailProductConfigurableService,
    payload
  );

  const productDetailSingle = productDetail.data.products.items[0];
  const productDetailReFormat = yield handleProductType(productDetailSingle);

  // Set product detail to productOption->optionValue
  yield put({
    type: types.UPDATE_PRODUCT_OPTION_VALUE,
    payload: productDetailReFormat
  });

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
  yield put({ type: types.UPDATE_CONFIGURABLE_PRODUCT_OPTION, payload });

  // Update change to reducer
  const optionValueRd = yield select(optionValue);
  console.log('product option:', optionValueRd);
  const { value } = payload.payload.event.target;
  const productDetailReFormat = yield findUsedConfigurable(
    optionValueRd,
    false,
    value
  );
  console.log('reassign:', productDetailReFormat);
  // console.log('product detail reformat:', productDetailReFormat);
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
}

export default rootSaga;
