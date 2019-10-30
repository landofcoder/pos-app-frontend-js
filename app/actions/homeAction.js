// @flow
import { ADD_TO_CART } from '../constants/root';

export function addToCart(payload) {
  return {
    type: ADD_TO_CART,
    payload
  };
}
