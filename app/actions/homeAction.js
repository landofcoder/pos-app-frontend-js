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

export function holdAction() {
  return {
    type: types.HOLD_ACTION
  };
}

export function cashCheckoutAction() {
  return {
    type: types.CASH_CHECKOUT_ACTION
  };
}

export function searchAction() {
  return {
    type: types.SEARCH_ACTION
  };
}

export function getDefaultProductAction() {
  return {
    type: types.GET_DEFAULT_PRODUCT
  };
}

export function updateMainPanelType(payload) {
  return {
    type: types.UPDATE_MAIN_PANEL_TYPE,
    payload
  };
}
