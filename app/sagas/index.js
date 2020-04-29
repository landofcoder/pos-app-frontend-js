import { all } from 'redux-saga/effects';
import rootSaga from './rootSaga';
import authenSaga from './authenSaga';
import cronSaga from './cronSaga';

function* saga() {
  yield all([rootSaga(), authenSaga(), cronSaga()]);
}

export default saga;
