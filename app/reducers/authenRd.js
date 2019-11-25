import produce from 'immer';
import * as typesAuthen from '../constants/authen';

const initialState = {
  token: '',
  authenticate: '',
  loading: false,
  message: ''
};
/*  eslint no-param-reassign: "error" */
const authenRd = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case typesAuthen.STARTLOADING:
        console.log('start loading');
        draft.loading = true;
        break;
      case typesAuthen.STOPLOADING:
        console.log('stop loading');
        draft.loading = false;
        break;
      case typesAuthen.ACCESS_TOKEN:
        draft.token = action.payload;
        localStorage.setItem('loginAvailable', action.payload);
        break;
      case typesAuthen.ERROR_LOGIN:
        draft.message =
          'The email or password did not match our records. Please try again.';
        break;
      case typesAuthen.SUCCESS_LOGIN:
        draft.message = 'SUCCESS';
        break;
      default:
        break;
    }
  });

export default authenRd;
