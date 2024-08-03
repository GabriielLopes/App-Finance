/* eslint-disable default-param-last */
// Importa todos os tipos de ações possíveis (provavelmente definidos em um arquivo types.js)
import * as types from '../types';

// Define o estado inicial do reducer
const estadoInicial = {
  verMeta: false, // Indica se o usuário deseja ver a meta financeira
  novaMeta: false,
  verDetalhesMeta: false,
  novoDeposito: false,
  metaFinanceira: {}, // Objeto contendo informações da meta Financeira
  isLoading: false, // Indica se uma requisição de editar está em andamento

};

// Função reducer que gerencia o estado da aplicação
export default function Reducer(state = estadoInicial, action) {
  // Verifica o tipo da ação recebida
  switch (action.type) {
    case types.VERMETAS_REQUEST: {
      const newState = { ...state };
      newState.verMeta = true;
      newState.metaFinanceira = action.payload;
      return newState; // Retorna o novo estado modificado
    }

    case types.VERMETAS_FAILURE: {
      const newState = { ...estadoInicial };
      newState.verMeta = false;
      newState.metaFinanceira = {};
      return newState;
    }

    case types.DEPOSITARMETAS_REQUEST: {
      const newState = { ...estadoInicial };
      newState.novoDeposito = true;
      newState.metaFinanceira = action.payload;
      return newState;
    }

    case types.DEPOSITARMETAS_FAILURE: {
      const newState = { ...estadoInicial };
      newState.novoDeposito = false;
      newState.metaFinanceira = {}
      return newState;
    }

    case types.VERDETALHESMETAS_REQUEST: {
      const newState = { ...estadoInicial };
      newState.verDetalhesMeta = true;
      newState.metaFinanceira = action.payload;
      return newState;
    }

    case types.VERDETALHESMETAS_FAILURE: {
      const newState = { ...estadoInicial };
      newState.verDetalhesMeta = false;
      newState.metaFinanceira = {}
      return newState
    }

    case types.NOVAMETA_REQUEST: {
      const newState = { ...estadoInicial };
      newState.novaMeta = true;
      return newState
    }

    case types.NOVAMETA_FAILURE: {
      const newState = { ...estadoInicial };
      newState.novaMeta = false;
      return newState
    }

    default: {
      // Caso a ação não seja reconhecida
      // Retorna o estado atual sem modificações
      return state;
    }
  }
}
