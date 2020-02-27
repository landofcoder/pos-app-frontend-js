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

export function actionTakePaymentDetailOrder() {
  return {
    type: type.TAKE_PAYMENT_DETAIL_ORDER_ACTION
  };
}

export function actionReorderDetailOrder() {
  return {
    type: type.REORDER_DETAIL_ORDER_ACTION
  };
}

export function actionPrintDetailOrder() {
  return {
    type: type.PRINT_DETAIL_ORDER_ACTION
  };
}

export function actionTakeShipmentDetailOrder() {
  return {
    type: type.TAKE_SHIPMENT_DETAIL_ORDER_ACTION
  };
}

export function actionCancelDetailOrder() {
  return {
    type: type.CANCEL_DETAIL_ORDER_ACTION
  };
}

export function actionRefundDetailOrder() {
  return {
    type: type.REFUND_DETAIL_ORDER_ACTION
  };
}
