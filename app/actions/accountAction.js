import * as type from '../constants/root.json';

export function getOrderHistory(payload){
  return{
    type: type.RECEIVED_ORDER_HISTORY_ACTION,
    payload
  }
}
