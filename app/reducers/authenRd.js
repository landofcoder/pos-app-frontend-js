import produce from 'immer';
import * as typesAuthen from '../constants/authen';

const initialState = {
  token: '',
  authenticate: '',
  loading: false,
  message: '',
  cashierInfo: {}
};
/*  eslint no-param-reassign: "error" */
const authenRd = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case typesAuthen.START_LOADING:
        draft.loading = true;
        break;
      case typesAuthen.STOP_LOADING:
        draft.loading = false;
        break;
      case typesAuthen.RECEIVED_TOKEN:
        draft.token = action.payload;
        localStorage.setItem(typesAuthen.POS_LOGIN_STORAGE, action.payload);
        break;
      case typesAuthen.ERROR_LOGIN:
        draft.message =
          'The email or password did not match our records. Please try again.';
        break;
      case typesAuthen.SUCCESS_LOGIN:
        draft.message = 'SUCCESS';
        break;
      case typesAuthen.RECEIVED_CASHIER_INFO:
        draft.cashierInfo = action.payload;
        break;
      default:
    }
  });

export default authenRd;
