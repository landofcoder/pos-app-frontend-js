import { all } from 'redux-saga/effects';
import rootSaga from './rootSaga';
import authenSaga from './authenSaga';

function* saga() {
  yield all([rootSaga(), authenSaga()]);
}

export default saga;
