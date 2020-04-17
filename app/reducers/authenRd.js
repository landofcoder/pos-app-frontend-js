import produce from 'immer';
import * as typesAuthen from '../constants/authen';

const initialState = {
  token: '',
  loading: false,
  message: '',
  messageErrorWorkPlace: '',
  cashierInfo: {},
  loadingWorkPlace: false,
  appInfo: {},
  moduleInstalled: {},
  syncManager: {
    syncCustomProduct: null,
    syncCustomer: null,
    syncOrder: null,
    syncStatus: false
  }
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
      case typesAuthen.START_LOADING_GET_APP_INFO:
        draft.loadingWorkPlace = true;
        break;
      case typesAuthen.STOP_LOADING_GET_APP_INFO:
        draft.loadingWorkPlace = false;
        break;
      case typesAuthen.ERROR_LOGIN:
        draft.message = action.payload || "Your server didn't response";
        break;
      case typesAuthen.SUCCESS_LOGIN:
        draft.message = 'SUCCESS';
        break;
      case typesAuthen.LOGOUT_AUTHEN_ACTION:
        draft.token = '';
        draft.message = '';
        draft.cashierInfo = {};
        break;
      case typesAuthen.GET_APP_INFO_FAILURE:
        draft.messageErrorWorkPlace = action.payload;
        break;
      case typesAuthen.CHANGE_TOKEN_INPUT_WORKPLACE:
        draft.tokenWorkPlace = action.payload;
        draft.messageErrorWorkPlace = '';
        break;
      case typesAuthen.RECEIVED_LIST_SYNC_ORDER:
        draft.syncManager.syncOrder = action.payload;
        break;
      case typesAuthen.RECEIVED_LIST_SYNC_CUSTOM_PRODUCT:
        draft.syncManager.syncCustomProduct = action.payload;
        break;
      case typesAuthen.RECEIVED_LIST_SYNC_CUSTOMER:
        draft.syncManager.syncCustomer = action.payload;
        break;
      case typesAuthen.STATUS_SYNC:
        draft.syncManager.syncStatus = action.payload;
        break;
      case typesAuthen.RECEIVED_APP_INFO:
        draft.appInfo = action.payload;
        break;
      default:
    }
  });

export default authenRd;
