// @flow
import produce from 'immer';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import * as types from '../constants/root';

const initialState = {
  number: 0,
  productList: [
    { id: 2028, sku: 'WSH11-29-Orange' },
    { id: 2027, sku: 'WSH11-29-Blue' },
    { id: 2026, sku: 'WSH11-28-Red' },
    { id: 2025, sku: 'WSH11-28-Orange' }
  ],
  cartCurrent: {
    token: 'r0uinwyueen6ous13zhwf907ut57klv8',
    data: []
  },
  cartHoldList: []
};

/* eslint-disable default-case, no-param-reassign */
const mainRd = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case INCREMENT_COUNTER:
        draft.number += 1;
        break;
      case DECREMENT_COUNTER:
        draft.number -= 1;
        break;
      case types.ADD_TO_CART:
        draft.cartCurrent.data.push(action.payload);
        break;
    }
  });

export default mainRd;
