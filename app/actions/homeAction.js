// @flow
import * as types from '../constants/root';
import * as typesAuthen from '../constants/authen.json';

export function addToCart(payload: any) {
  return {
    type: types.ADD_TO_CART,
    payload
  };
}

export function deleteItemCart(payload) {
  return {
    type: types.REMOVE_ITEM_OUT_CART,
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

export function switchToHoldItemCart(payload) {
  return {
    type: types.SWITCH_TO_HOLD_ITEM_CART,
    payload
  };
}

export function cashCheckoutAction() {
  return {
    type: types.CASH_CHECKOUT_ACTION
  };
}

export function searchProductAction(payload) {
  return {
    type: types.SEARCH_ACTION,
    payload
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

export function getDetailProductGrouped(payload) {
  return {
    type: types.GET_DETAIL_PRODUCT_GROUPED,
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

export function onGroupedChangeQty(payload) {
  return {
    type: types.ON_GROUPED_QTY_CHANGE,
    payload
  };
}

export function onBundleProductQtyOnChange(payload) {
  return {
    type: types.ON_BUNDLE_PRODUCT_QTY_ONCHANGE,
    payload
  };
}

export function toggleModalCustomer(payload) {
  return {
    type: types.TOGGLE_MODAL_CUSTOMER,
    payload
  };
}

export function toggleModalCalculator(payload: boolean) {
  return {
    type: types.TOGGLE_MODAL_CALCULATOR,
    payload
  };
}

export function toggleModalSignUpCustomer(payload) {
  return {
    type: types.TOGGLE_MODAL_SIGN_UP_CUSTOMER,
    payload
  };
}

export function searchCustomer(payload) {
  return {
    type: types.SEARCH_CUSTOMER,
    payload
  };
}

export function selectCustomerForCurrentCart(payload) {
  return {
    type: types.SELECT_CUSTOMER_FOR_CURRENT_CART,
    payload
  };
}

export function unSelectCustomerForCurrentCart(payload) {
  return {
    type: types.UN_SELECT_CUSTOMER_FOR_CURRENT_CART,
    payload
  };
}

export function updateShowCashModal(payload) {
  return {
    type: types.UPDATE_SHOW_CASH_MODAL,
    payload
  };
}

export function emptyCart() {
  return {
    type: types.EMPTY_CART
  };
}

export function closeReceiptModal() {
  return {
    type: types.CLOSE_RECEIPT_MODAL
  };
}

export function setToken(payload) {
  return {
    type: typesAuthen.RECEIVED_TOKEN,
    payload
  };
}

export function getProductByCategory(payload) {
  return {
    type: types.GET_PRODUCT_BY_CATEGORY,
    payload
  };
}

export function signUpCustomer(payload) {
  return {
    type: types.SIGN_UP_CUSTOMER,
    payload
  };
}

export function changeSignUpLoadingCustomer(payload) {
  return {
    type: types.CHANGE_SIGN_UP_LOADING_CUSTOMER,
    payload
  };
}

export function updateIsInternetConnected(payload) {
  return {
    type: types.IS_INTERNET_CONNECTED,
    payload
  };
}

export function getDiscountForOfflineCheckout() {
  return {
    type: types.GET_DISCOUNT_FOR_OFFLINE_CHECKOUT
  };
}

export function updateIsShowModelEditingCartItem(payload) {
  return {
    type: types.UPDATE_IS_SHOW_MODEL_EDITING_CART_ITEM,
    payload
  };
}

export function updateQtyEditCart(payload) {
  return {
    type: types.UPDATE_QTY_CART_ITEM,
    payload
  };
}

export function gotoChildrenPanel() {
  return {
    type: types.GO_TO_CHILDREN_PANEL_TRIGGER
  };
}

export function reCheckRequireStep() {
  return {
    type: types.RE_CHECK_REQUIRE_STEP
  };
}
