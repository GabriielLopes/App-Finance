/* eslint-disable import/prefer-default-export */
import * as types from '../types';

export function novoCartaoRequest(payload) {
  return {
    // Objeto de ação
    type: types.NOVO_CARTAO_REQUEST,
    payload,
  };
}

export function novoCartaoSuccess(payload) {
  return {
    type: types.NOVO_CARTAO_SUCCESS,
    payload,
  };
}

export function novoCartaoFailure(payload) {
  return {
    type: types.NOVO_CARTAO_FAILURE,
    payload,
  };
}
