// Importa todos os tipos de ações definidos em ../types (provavelmente uma pasta com definições de tipos)
import * as types from '../types';

// Função para criar uma ação de requisição de editar Metas financeiras
export function depositarMetasRequest(payload) {
  // Retorna um objeto de ação com o tipo LOGIN_REQUEST e o payload recebido
  return {
    type: types.DEPOSITARMETAS_REQUEST,
    payload,
  };
}

// Função para criar uma ação de falha no login
export function depositarMetasFailure(payload) {
  // Retorna um objeto de ação com o tipo LOGIN_FAILURE e o payload recebido
  return {
    type: types.DEPOSITARMETAS_FAILURE,
    payload,
  };
}

export function verMetasRequest(payload) {
  return {
    type: types.VERMETAS_REQUEST,
    payload,
  };
}

export function verMetasFailure(payload) {
  return {
    type: types.VERMETAS_FAILURE,
    payload,
  }
}

export function verDetalhesMetasRequest(payload) {
  return {
    type: types.VERDETALHESMETAS_REQUEST,
    payload,
  }
}

export function verDetalhesMetasFailure(payload) {
  return {
    type: types.VERDETALHESMETAS_FAILURE,
    payload,
  }
}

export function novaMetaRequest(payload) {
  return {
    type: types.NOVAMETA_REQUEST,
    payload,
  }
}

export function novaMetaFailure(payload) {
  return {
    type: types.NOVAMETA_FAILURE,
    payload,
  }
}
