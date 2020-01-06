import produce from 'immer';
import * as typesAuthen from '../constants/authen';
import { setMainUrl } from './db/settings';
const initialState = {
  token: '',
  authenticate: '',
  loading: false,
  message: '',
  messageErrorWorkPlace: '',
  cashierInfo: {},
  isReloadingToken: false,
  loadingWorkPlace: false,
  mainUrl: ''
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
      case typesAuthen.START_LOADING_WORKPLACE:
        draft.loadingWorkPlace = true;
        break;
      case typesAuthen.STOP_LOADING_WORKPLACE:
        draft.loadingWorkPlace = false;
        break;
      case typesAuthen.RECEIVED_TOKEN:
        draft.token = action.payload;
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
      case typesAuthen.LOGOUT_AUTHEN_ACTION:
        draft.token = '';
        draft.message = '';
        draft.cashierInfo = {};
        // localStorage.clear();
        break;
      case typesAuthen.SIGN_IN_WORKPLACE_ACTION:
        draft.loadingWorkPlace = action.payload;
        break;
      case typesAuthen.RECEIVED_MAIN_URL:
        draft.mainUrl = action.payload;
        break;
      case typesAuthen.ERROR_URL_WORKPLACE:
        draft.messageErrorWorkPlace = action.payload;
        break;
      default:
    }
  });

export default authenRd;
