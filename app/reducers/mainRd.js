// @flow
import produce from 'immer';
import * as types from '../constants/root';

const initialState = {
  productList: [
    { id: 2028, sku: 'MT07-XS-Gray' },
    { id: 2027, sku: 'WSH11-29-Blue' },
    { id: 2026, sku: 'WSH11-28-Red' },
    { id: 2025, sku: 'WSH11-28-Orange' }
  ],
  cartCurrent: {
    data: []
  },
  cartHoldList: [],
  orderPreparingCheckout: {} // Detail order for preparing to checkout
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
      default:
        break;
    }
  });

export default mainRd;
