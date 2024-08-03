import * as types from '../types';


export function novoPlanejamentoMensalRequest(payload) {
  return {
    type: types.NOVO_PLANEJAMENTO_MENSAL_REQUEST,
    payload
  }
}

export function novoPlanejamentoMensalFailure(payload) {
  return {
    type: types.NOVO_PLANEJAMENTO_MENSAL_FAILURE,
    payload
  }
}
