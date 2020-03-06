import * as type from '../constants/root.json';

export function getOrderHistory() {
  return {
    type: type.GET_ORDER_HISTORY_ACTION
  };
}

export function getOrderHistoryDetail(payload) {
  return {
    type: type.GET_ORDER_HISTORY_DETAIL_ACTION,
    payload
  };
}

export function getOrderHistoryDetailOffline(payload) {
  return {
    type: type.GET_ORDER_HISTORY_DETAIL_OFFLINE_ACTION,
    payload
  };
}

export function toggleModalOrderDetail(payload) {
  return {
    type: type.TOGGLE_MODAL_ORDER_DETAIL,
    payload
  };
}

export function toggleModalOrderDetailOffline(payload) {
  return {
    type: type.TOGGLE_MODAL_ORDER_DETAIL_OFFLINE,
    payload
  };
}

export function actionLoadingOrderDetailOffline(payload) {
  return {
    type: type.LOADING_ORDER_HISTORY_DETAIL_OFFLINE,
    payload
  };
}

export function orderAction(payload) {
  return {
    type: type.ORDER_ACTION,
    payload
  };
}

export function getSyncManager() {
  return {
    type: type.GET_SYNC_MANAGER
  };
}
