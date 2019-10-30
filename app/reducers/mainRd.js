// @flow
import produce from 'immer';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';

const initialState = {
  number: 0
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
    }
  });

export default mainRd;
