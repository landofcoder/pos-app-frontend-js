// @flow
import produce from 'immer';
import * as types from '../constants/root';
import { HOME_DEFAULT_PRODUCT_LIST } from '../constants/main-panel-types';

const initialState = {
  mainPanelType: HOME_DEFAULT_PRODUCT_LIST, // Main panel type for switching all main panel
  productList: [],
  cartCurrent: {
    token: '',
    data: []
  },
  cartHoldList: [],
  orderPreparingCheckout: {}, // Detail order for preparing to checkout
  cashLoadingPreparingOrder: false // Status cash loading for preparing to show cash payment form
};

/* eslint-disable default-case, no-param-reassign */
const mainRd = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case types.ADD_TO_CART:
        draft.cartCurrent.data.push(action.payload);
        break;
      case types.RECEIVED_ORDER_PREPARING_CHECKOUT:
        draft.orderPreparingCheckout = action.payload;
        break;
      case types.RECEIVED_PRODUCT_RESULT:
        draft.productList = action.payload;
        break;
      case types.UPDATE_CASH_LOADING_PREPARING_ORDER:
        draft.cashLoadingPreparingOrder = action.payload;
        break;
      case types.UPDATE_MAIN_PANEL_TYPE:
        draft.mainPanelType = action.payload;
        break;
      case types.UPDATE_CART_TOKEN_TO_CURRENT_CART:
        draft.cartCurrent.token = action.payload;
        break;
      default:
        break;
    }
  });

export default mainRd;
