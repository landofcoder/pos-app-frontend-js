// @flow
import * as types from '../constants/root';

export function addToCart(payload) {
  return {
    type: types.ADD_TO_CART,
    payload
  };
}

export function checkoutAction() {
  return {
    type: types.CHECK_OUT_ACTION
  };
}
