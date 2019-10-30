import { all } from 'redux-saga/effects';
import rootSaga from './rootSaga';

function* saga() {
  yield all([rootSaga()]);
}

export default saga;
