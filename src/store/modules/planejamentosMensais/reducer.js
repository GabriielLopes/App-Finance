/* eslint-disable default-param-last */
import * as types from '../types';

const estadoInicial = {
  novoPlanejamento: false,
};

export default function Reducer(state = estadoInicial, action) {
  switch (action.type) {
    case types.NOVO_PLANEJAMENTO_MENSAL_REQUEST: {
      const newState = { ...estadoInicial };
      newState.novoPlanejamento = true;
      return newState;
    }

    case types.NOVO_PLANEJAMENTO_MENSAL_FAILURE: {
      const newState = { ...estadoInicial };
      newState.novoPlanejamento = false;
      return newState;
    }

    default: {
      return state;
    }
  }
}
