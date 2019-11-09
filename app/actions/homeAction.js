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

export function searchAction(payload) {
  return {
    type: types.SEARCH_ACTION,
    payload
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

export function getDetailProductConfigurable(payload) {
  return {
    type: types.GET_DETAIL_PRODUCT_CONFIGURABLE,
    payload
  };
}
