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

export function closeToggleModalOrderDetail() {
  return {
    type: type.CLOSE_TOGGLE_MODAL_DETAIL_ORDER
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

export function toggleModalAddNote(payload) {
  return {
    type: type.TOGGLE_ACTION_ORDER_ADD_NOTE,
    payload
  };
}

export function addNoteOrderAction(payload) {
  return {
    type: type.NOTE_ORDER_ACTION,
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

export function getSyncDataFromLocal() {
  return {
    type: type.GET_SYNC_DATA_FROM_LOCAL
  };
}

export function getSyncStatusFromLocal() {
  return {
    type: type.GET_SYNC_STATUS_FROM_LOCAL
  };
}

export function showLogsAction(payload) {
  return {
    type: type.TOOGLE_MODAL_SHOW_SYNC_LOGS,
    payload: { type: payload.type, status: payload.status }
  };
}
