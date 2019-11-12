import produce from 'immer';
import * as types from '../constants/root';

const initialState = {
  token: '',
  authenticate: ''
};
/* eslint-disable default-case, no-param-reassign */
const authenRd = (state = initialState, action) => {
  produce(state, draft => {
    switch (action.type) {
      case types.ACCESS_TOKEN_VALUE_LOGIN:
        draft.token = action.token;
        draft.authenticate = action.authenticate;
        break;
      case types.LOGOUT_ACTION:
        draft.token = '';
        draft.authenticate = '';
        break;
      default:
        break;
    }
  });
};

export default authenRd;
