// Importa todos os tipos de ações definidos em ../types (provavelmente uma pasta com definições de tipos)
import * as types from '../types';

// Função para criar uma ação de requisição de login
export function loginRequest(payload) {
  // Retorna um objeto de ação com o tipo LOGIN_REQUEST e o payload recebido
  return {
    type: types.LOGIN_REQUEST,
    payload,
  };
}

// Função para criar uma ação de sucesso no login
export function loginSuccess(payload) {
  // Retorna um objeto de ação com o tipo LOGIN_SUCCESS e o payload recebido
  return {
    type: types.LOGIN_SUCCESS,
    payload,
  };
}

// Função para criar uma ação de falha no login
export function loginFailure(payload) {
  // Retorna um objeto de ação com o tipo LOGIN_FAILURE e o payload recebido
  return {
    type: types.LOGIN_FAILURE,
    payload,
  };
}

export function registerRequest(payload) {
  return {
    type: types.REGISTER_REQUEST,
    payload,
  };
}

export function registerSuccess(payload) {
  return {
    type: types.REGISTER_SUCCESS,
    payload,
  };
}

export function registerFailure(payload) {
  return {
    type: types.REGISTER_FAILURE,
    payload,
  };
}

export function modoNoturnoSuccess(payload) {
  return {
    type: types.MODO_NOTURNO_SUCCESS,
    payload,
  };
}

export function editSuccess(payload) {
  return {
    type: types.EDIT_SUCCESS,
    payload,
  };
}


export function editFailure(payload) {
  return {
    type: types.EDIT_FAILURE,
    payload,
  };
}
