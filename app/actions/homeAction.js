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

export function getDetailProductBundle(payload) {
  return {
    type: types.GET_DETAIL_PRODUCT_BUNDLE,
    payload
  };
}

export function updateIsShowingProductOption(payload) {
  return {
    type: types.UPDATE_IS_SHOWING_PRODUCT_OPTION,
    payload
  };
}

export function onConfigurableSelectOnChange(payload) {
  return {
    type: types.ON_CONFIGURABLE_SELECT_ONCHANGE,
    payload
  };
}

export function onBundleSelectedChange(payload) {
  return {
    type: types.ON_BUNDLE_SELECTED_RADIO_ONCHANGE,
    payload
  };
}

export function onBundleSelectedSelectChange(payload) {
  return {
    type: types.ON_BUNDLE_SELECTED_SELECT_ONCHANGE,
    payload
  };
}

export function onBundleCheckBoxOnChange(payload) {
  return {
    type: types.ON_BUNDLE_SELECTED_CHECKBOX_ONCHANGE,
    payload
  };
}

export function onBundleMultipleCheckboxOnChange(payload) {
  return {
    type: types.ON_BUNDLE_SELECTED_MULTIPLE_ONCHANGE,
    payload
  };
}

export function onBundleMultipleCheckboxRemoveItem(payload) {
  return {
    type: types.ON_BUNDLE_SELECTED_MULTIPLE_REMOVE_ITEM_ONCHANGE,
    payload
  };
}

export function onBundleMultipleCheckboxPushItem(payload) {
  return {
    type: types.ON_BUNDLE_SELECTED_MULTIPLE_PUSH_ITEM_ONCHANGE,
    payload
  };
}
