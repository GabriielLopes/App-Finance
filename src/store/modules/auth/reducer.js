/* eslint-disable default-param-last */
// Importa todos os tipos de ações possíveis (provavelmente definidos em um arquivo types.js)
import * as types from '../types';
import axios from '../../../services/axios';

// Define o estado inicial do reducer
const estadoInicial = {
  isLoggedIn: false, // Indica se o usuário está logado
  token: false, // Token de autenticação do usuário (provavelmente uma string)
  user: {}, // Objeto contendo informações do usuário
  isLoading: false, // Indica se uma requisição de login está em andamento
  modoEscuro: false,

};

// Função reducer que gerencia o estado da aplicação
export default function Reducer(state = estadoInicial, action) {
  // Verifica o tipo da ação recebida
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      // Ação disparada após login bem-sucedido
      // Cria uma cópia do estado atual para evitar mutação direta
      const newState = { ...state };
      newState.isLoggedIn = true; // Atualiza o estado de login para true
      newState.token = action.payload.token; // Armazena o token recebido na ação
      newState.user = action.payload.user; // Armazena as informações do usuário na ação
      newState.isLoading = false; // Indica que a requisição finalizou
      return newState; // Retorna o novo estado modificado
    }

    case types.LOGIN_FAILURE: {
      // Ação disparada após falha no login
      // Retorna o estado inicial, limpando qualquer informação de login anterior
      delete axios.defaults.headers.common.Authorization;
      delete axios.defaults.headers.delete.Authorization;
      delete axios.defaults.headers.get.Authorization;
      delete axios.defaults.headers.post.Authorization;
      delete axios.defaults.headers.put.Authorization;
      const newState = { ...estadoInicial };
      return newState;
    }

    case types.LOGIN_REQUEST: {
      // Ação disparada ao iniciar uma requisição de login
      // Cria uma cópia do estado inicial
      const newState = { ...estadoInicial };
      newState.isLoading = true; // Indica que a requisição está em andamento
      return newState; // Retorna o novo estado modificado
    }

    case types.REGISTER_SUCCESS: {
      const newState = { ...state };
      newState.user.nome = action.payload.nome;
      newState.user.email = action.payload.email;
      newState.isLoggedIn = false;
      newState.isLoading = false;
      return newState;
    }

    case types.EDIT_SUCCESS: {
      const newState = { ...state };
      newState.user.nome = action.payload.nome;
      newState.user.email = action.payload.email;
      newState.isLoggedIn = true;
      newState.isLoading = false;
      return newState;
    }

    case types.REGISTER_REQUEST: {
      const newState = { ...state };
      newState.isLoading = true;
      return newState;
    }

    case types.REGISTER_FAILURE: {
      const newState = { ...state };
      newState.isLoading = false;
      return newState;
    }

    case types.EDIT_FAILURE: {
      const newState = { ...state };
      newState.isLoading = false;
      return newState;
    }

    case types.MODO_NOTURNO_SUCCESS: {
      const newState = { ...state };
      newState.modoEscuro = !newState.modoEscuro;
      return newState;
    }

    default: {
      // Caso a ação não seja reconhecida
      // Retorna o estado atual sem modificações
      return state;
    }
  }
}
