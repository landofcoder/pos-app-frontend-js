// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import type { counterStateType } from '../reducers/types';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(sagaMiddleware, router);

function configureStore(initialState?: counterStateType) {
  const Store = createStore<*, counterStateType, *>(
    rootReducer,
    initialState,
    enhancer
  );
  sagaMiddleware.run(rootSaga);
  return Store;
}

export default { configureStore, history };
