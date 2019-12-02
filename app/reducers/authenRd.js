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
        draft.loading = true;
        break;
      case typesAuthen.STOPLOADING:
        draft.loading = false;
        break;
      case typesAuthen.ACCESS_TOKEN:
        draft.token = action.payload;
        localStorage.setItem('posAppData', action.payload);
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
