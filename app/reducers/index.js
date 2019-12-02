// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import mainRd from './mainRd';
import authenRd from './authenRd';

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    mainRd,
    authenRd
  });
}
