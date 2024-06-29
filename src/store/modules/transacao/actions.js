/* eslint-disable import/prefer-default-export */
import * as types from '../types';

export function novaTransacaoRequest(payload) {
  return {
    // Objeto de ação
    type: types.NOVA_TRANSACAO_REQUEST,
    payload,
  };
}
