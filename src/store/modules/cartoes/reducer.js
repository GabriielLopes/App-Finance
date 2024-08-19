/* eslint-disable default-param-last */
import * as types from '../types';

const estadoInical = {
  cadastrarCartao: false,
};

export default function Reducer(state = estadoInical, action) {

  switch (action.type) {

    case types.NOVO_CARTAO_REQUEST: {
      const newState = { ...state };
      newState.cadastrarCartao = true;
      return newState;
    }

    case types.NOVO_CARTAO_FAILURE: {
      const newState = { ...state };
      newState.cadastrarCartao = false;
      return newState;

    }

    default: {
      return state;
    }
  }
}
