import produce from 'immer';
import * as typesAuthen from '../constants/authen';

const initialState = {
  loading: false,
  message: '',
  messageErrorWorkPlace: '',
  cashierInfo: {},
  loadingWorkPlace: false,
  appInfo: {},
  moduleInstalled: {},
  syncManager: {
    syncCustomProduct: [],
    syncCustomer: [],
    syncOrder: [],
    syncStatus: [],
    syncConfig: [],
    syncAllProduct: [],
    loadingSyncCustomProducts: false,
    loadingSyncCustomer: false,
    loadingSyncOrder: false,
    loadingSyncStatus: false,
    loadingSyncConfig: false,
    loadingSyncAllProduct: false
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
        draft.message = action.payload;
        break;
      case typesAuthen.SUCCESS_LOGIN:
        draft.message = 'SUCCESS';
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
      case typesAuthen.RECEIVED_LIST_SYNC_GENERAL_CONFIG:
        draft.syncManager.syncConfig = action.payload;
        break;
      case typesAuthen.RECEIVED_LIST_SYNC_ALL_PRODUCT:
        draft.syncManager.syncAllProduct = action.payload;
        break;
      case typesAuthen.STATUS_SYNC:
        draft.syncManager.syncStatus = action.payload;
        break;
      case typesAuthen.RECEIVED_APP_INFO:
        draft.appInfo = action.payload;
        break;
      case typesAuthen.LOADING_SYNC_ACTION:
        switch (action.payload.type) {
          case typesAuthen.ALL_PRODUCT_SYNC:
            draft.syncManager.loadingSyncAllProduct = action.payload.status;
            break;
          case typesAuthen.CUSTOM_PRODUCT_SYNC:
            draft.syncManager.loadingSyncCustomProducts = action.payload.status;
            break;
          case typesAuthen.CUSTOMERS_SYNC:
            draft.syncManager.loadingSyncCustomer = action.payload.status;
            break;
          case typesAuthen.GENERAL_CONFIG_SYNC:
            draft.syncManager.loadingSyncConfig = action.payload.status;
            break;
        }
        break;
      default:
    }
  });

export default authenRd;
