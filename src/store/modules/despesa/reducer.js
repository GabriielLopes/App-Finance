/* eslint-disable default-param-last */
import * as types from '../types';

const estadoInical = {
  novaDespesa: false,
};

export default function Reducer(state = estadoInical, action) {
  switch (action.type) {
    case types.NOVA_DESPESA_REQUEST: {
      const newState = { ...state };
      newState.novaDespesa = !newState.novaDespesa;
      return newState;
    }
    default: {
      return state;
    }
  }
}
