import { takeEvery, put } from 'redux-saga/effects';
import * as types from '../constants/root';

/**
 * Get list product
 * @returns {IterableIterator<*>}
 */
function* getListProduct() {
  yield put({ type: types.RECEIVED_LIST_PRODUCT });
}

function* rootSaga() {
  yield takeEvery(types.FETCH_LIST_PRODUCT, getListProduct);
}

export default rootSaga;
