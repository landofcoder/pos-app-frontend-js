import produce from 'immer';
import * as typesAuthen from '../constants/authen';
import { RECEIVED_GENERAL_CONFIG } from '../constants/root';

const initialState = {
  loading: false,
  message: '',
  messageErrorWorkPlace: '',
  cashierInfo: {},
  loadingWorkPlace: false,
  appInfo: {},
  moduleInstalled: {},
  appLicense: {
    lock: false,
    plan: 'TRIAL',
    daysLeft: 0,
    data: {}
  },
  login: {
    loginResult: {
      data: '',
      status: true, // Default status login result is true will not show error messages
      listMessage: []
    }
  },
  syncDataManager: {
    // do du lieu ra ngoai voi step la so trang, stepAt la vi tri trang hien tai
    id: null,
    data: null,
    step: 10,
    stepAt: 1
  },
  syncManager: {},
  loadingSyncManager: {}
};

/*  eslint no-param-reassign: "error" */
const authenRd = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case RECEIVED_GENERAL_CONFIG:
        draft.cashierInfo = action.payload.cashier_info;
        break;
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
        draft.login.loginResult = action.payload;
        break;
      case typesAuthen.GET_APP_INFO_FAILURE:
        draft.messageErrorWorkPlace = action.payload;
        break;
      case typesAuthen.CHANGE_TOKEN_INPUT_WORKPLACE:
        draft.tokenWorkPlace = action.payload;
        draft.messageErrorWorkPlace = '';
        break;
      case typesAuthen.RECEIVED_STATUS_SYNC:
        draft.syncManager = action.payload;
        break;
      case typesAuthen.RECEIVED_DATA_SYNC:
        draft.syncDataManager.id = action.id;
        draft.syncDataManager.data = action.payload;
        draft.syncDataManager.statusData = action.statusData;
        draft.syncDataManager.step = action.step;
        draft.syncDataManager.stepAt = action.stepAt;
        break;
      case typesAuthen.RECEIVED_APP_INFO:
        draft.appInfo = action.payload;
        break;
      case typesAuthen.LOADING_SYNC_ACTION:
        draft.loadingSyncManager[action.payload.type] = action.payload.status;
        break;
      case typesAuthen.RECEIVED_APP_LICENSE:
        draft.appLicense = action.payload;
        break;
      default:
        break;
    }
  });

export default authenRd;
