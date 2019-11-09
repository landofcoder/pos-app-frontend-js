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

const cartCurrent = state => state.mainRd.cartCurrent.data;
const cartCurrentToken = state => state.mainRd.cartCurrent.token;

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
  console.log('product result:', productResult);
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

  // Set showProductOption to true
  yield put({ type: types.UPDATE_IS_SHOWING_PRODUCT_OPTION, payload: true });
  console.log('product detail:', productDetail);

  // Stop loading
  yield put({ type: types.UPDATE_IS_LOADING_PRODUCT_OPTION, payload: false });
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
}

export default rootSaga;
