import produce from 'immer';
import * as typesAuthen from '../constants/authen';

const initialState = {
  token: '',
  authenticate: '',
  loading: false
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
        break;
      default:
        break;
    }
  });

export default authenRd;
