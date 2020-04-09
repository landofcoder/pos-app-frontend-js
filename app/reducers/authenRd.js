import produce from 'immer';
import * as typesAuthen from '../constants/authen';

const initialState = {
  token: '',
  loading: false,
  message: '',
  messageErrorWorkPlace: '',
  cashierInfo: {},
  isReloadingToken: false,
  loadingWorkPlace: false,
  loadingModuleComponent: true,
  appInfo: {},
  isValidToken: '',
  moduleInstalled: {},
  errorServiceModuleInstalled: false,
  senseUrl: '',
  syncManager: {
    syncCustomProduct: null,
    syncCustomer: null,
    syncOrder: null,
    syncStatus: false
  },
  toModuleInstalled: false
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
      case typesAuthen.RECEIVED_CASHIER_INFO:
        draft.cashierInfo = action.payload;
        break;
      case typesAuthen.LOGOUT_AUTHEN_ACTION:
        draft.token = '';
        draft.message = '';
        draft.cashierInfo = {};
        break;
      case typesAuthen.SIGN_IN_WORKPLACE_ACTION:
        draft.loadingWorkPlace = action.payload;
        break;
      case typesAuthen.GET_APP_INFO_FAILURE:
        draft.messageErrorWorkPlace = action.payload;
        draft.isValidToken = false;
        break;
      case typesAuthen.CHANGE_TOKEN_INPUT_WORKPLACE:
        draft.tokenWorkPlace = action.payload;
        draft.messageErrorWorkPlace = '';
        if (action.payload) draft.isValidToken = true;
        break;
      case typesAuthen.SET_DEFAULT_PROTOCOL_WORKPLACE:
        draft.defaultProtocol = action.payload;
        break;
      case typesAuthen.LOADING_MODULE_COMPONENT:
        draft.loadingModuleComponent = action.payload;
        break;
      case typesAuthen.RECEIVED_MODULE_INSTALLED:
        draft.moduleInstalled = action.payload;
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
      case typesAuthen.ERROR_SERVICE_MODULES_INSTALLED:
        draft.errorServiceModuleInstalled = action.payload;
        break;
      case typesAuthen.CHANGE_SENSE_URL:
        draft.senseUrl = action.payload;
        break;
      case typesAuthen.CHANGE_STATUS_SYNC:
        draft.syncManager.syncStatus = action.payload;
        break;
      case typesAuthen.RECEIVED_APP_INFO:
        draft.appInfo = action.payload;
        break;
      default:
    }
  });

export default authenRd;
