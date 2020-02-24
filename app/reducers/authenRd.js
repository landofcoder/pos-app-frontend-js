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
  mainUrl: '',
  urlInput: '',
  changeInput: false,
  defaultProtocol: 'http://',
  moduleInstalled: {},
  errorServiceModuleInstalled: false,
  senseUrl: '',
  toModuleInstalled: false,
  trialInfo: {
    isExpired: 0, // 0 = default, true = is expired, false = in trial time
    daysRemaining: '' // Days remaining text
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
        draft.message = 'The email or password not found';
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
      case typesAuthen.RECEIVED_MAIN_URL:
        window.mainUrl = action.payload;
        draft.mainUrl = action.payload;
        break;
      case typesAuthen.ERROR_URL_WORKPLACE:
        draft.messageErrorWorkPlace = action.payload;
        break;
      case typesAuthen.CHANGE_URL_INPUT_WORKPLACE:
        draft.urlInput = action.payload;
        draft.changeInput = true;
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
      case typesAuthen.ERROR_SERVICE_MODULES_INSTALLED:
        draft.errorServiceModuleInstalled = action.payload;
        break;
      case typesAuthen.CHANGE_SENSE_URL:
        draft.senseUrl = action.payload;
        break;
      case typesAuthen.CHANGE_STATUS_TO_MODULE_INSTALLED:
        draft.toModuleInstalled = action.payload;
        break;
      case typesAuthen.UPDATE_TRIAL_INFO:
        draft.trialInfo.isExpired = action.payload.isExpired;
        draft.trialInfo.daysRemaining = action.payload.daysRemaining;
        break;
      default:
    }
  });

export default authenRd;
