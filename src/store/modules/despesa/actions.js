/* eslint-disable import/prefer-default-export */
import * as types from '../types';

export function novaDespesaRequest(payload) {
  return {
    // Objeto de ação
    type: types.NOVA_DESPESA_REQUEST,
    payload,
  };
}

export function pagarDespesaRequest(payload) {
  return {
    type: types.PAGAR_DESPESA_REQUEST,
    payload,
  };
}

export function pagarDespesaFailure(payload) {
  return {
    type: types.PAGAR_DESPESA_FAILURE,
    payload,
  };
}
