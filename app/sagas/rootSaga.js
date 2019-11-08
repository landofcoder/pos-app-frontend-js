// @flow
import { takeEvery, put, call, select, all } from 'redux-saga/effects';
import * as types from '../constants/root';
import {
  createGuestCartService,
  addProductToQuote,
  addShippingInformationService,
  searchProductService,
  getProductsService
} from './services/GuestCartService';

const cartCurrent = state => state.mainRd.cartCurrent.data;

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

function* search() {
  yield call(searchProductService);
}

function* rootSaga() {
  yield takeEvery(types.FETCH_LIST_PRODUCT, getListProduct);
  yield takeEvery(types.CASH_CHECKOUT_ACTION, cashCheckout);
  yield takeEvery(types.SEARCH_ACTION, search);
  yield takeEvery(types.GET_DEFAULT_PRODUCT, getDefaultProduct);
}

export default rootSaga;