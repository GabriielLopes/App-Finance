/* eslint-disable default-param-last */
import * as types from '../types';

const estadoInical = {
  novaTransacao: false,
};

export default function Reducer(state = estadoInical, action) {
  switch (action.type) {
    case types.NOVA_TRANSACAO_REQUEST: {
      const newState = { ...state };
      newState.novaTransacao = !newState.novaTransacao;
      return newState;
    }
    default: {
      return state;
    }
  }
}
