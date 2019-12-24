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
  }
}
