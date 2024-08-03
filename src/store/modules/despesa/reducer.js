/* eslint-disable default-param-last */
import * as types from '../types';

const estadoInical = {
  novaDespesa: false,
  pagarDespesa: false,
  despesa: {},
};

export default function Reducer(state = estadoInical, action) {

  switch (action.type) {
    case types.NOVA_DESPESA_REQUEST: {
      const newState = { ...state };
      newState.novaDespesa = !newState.novaDespesa;
      return newState;
    }

    case types.PAGAR_DESPESA_REQUEST: {
      const newState = { ...estadoInical };
      newState.pagarDespesa = true;
      newState.despesa = action.payload;
      return newState;
    }

    case types.PAGAR_DESPESA_FAILURE: {
      const newState = { ...estadoInical };
      newState.pagarDespesa = false;
      return newState;
    }

    default: {
      return state;
    }
  }
}
