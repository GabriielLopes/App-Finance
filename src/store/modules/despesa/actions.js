/* eslint-disable import/prefer-default-export */
import * as types from '../types';

export function novaDespesaRequest(payload) {
  return {
    // Objeto de ação
    type: types.NOVA_DESPESA_REQUEST,
    payload,
  };
}
