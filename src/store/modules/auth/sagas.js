/* eslint-disable consistent-return */
// Importa funções do redux-saga/effects
import { call, put, all, takeLatest } from 'redux-saga/effects';
import Swal from 'sweetalert2'; // Biblioteca para criar popups de alerta
import { get } from 'lodash'; // Função utilitária para acessar dados em objetos aninhados

// Importa ações da pasta actions
import * as actions from './actions';
// Importa constantes de tipos da pasta types
import * as types from '../types';
import axios from '../../../services/axios'; // Instância do Axios configurada
import history from '../../../services/history'; // Serviço de navegação

// Função geradora para tratar a requisição de login

function* loginRequest({ payload }) {
  try {
    // Faz a requisição POST para '/tokens/' usando o Axios
    const response = yield call(axios.post, '/tokens/', payload);

    // Dispara a ação de login bem-sucedido passando os dados da resposta

    axios.defaults.headers.get.Authorization = `Bearer ${response.data.token}`
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    axios.defaults.headers.post.Authorization = `Bearer ${response.data.token}`;
    axios.defaults.headers.get.Authorization = `Bearer ${response.data.token}`;
    axios.defaults.headers.delete.Authorization = `Bearer ${response.data.token}`;
    axios.defaults.headers.put.Authorization = `Bearer ${response.data.token}`;

    yield put(actions.loginSuccess({ ...response.data }));

    // Configura o popup de sucesso do SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Login efetuado com sucesso!',
      showCloseButton: true,
    });
    history.push(payload.prevPath);
  } catch (e) {
    // Configura o popup de erro do SweetAlert
    Swal.fire({
      icon: 'error',
      title: 'Usuário ou senha inválidos!',
      showCloseButton: true,
    });
    // Dispara a ação de login falho
    yield put(actions.loginFailure());
  }
}

// eslint-disable-next-line consistent-return
function* registerRequest({ payload }) {
  const { id, nome, email, password } = payload;
  try {
    if (id) {
      yield call(axios.put, '/users', {
        email,
        nome,
        password: password || undefined,
      });
      yield put(actions.editSuccess({ nome, email }));
      Swal.fire({
        icon: 'success',
        title: 'O usuário foi editado com sucesso!',
        showCloseButton: true,
      })
    } else {
      yield call(axios.post, '/users', {
        email,
        nome,
        password,
      });
      Swal.fire({
        icon: 'success',
        title: 'Conta criada!',
        text: 'Sua conta foi criada com sucesso! divirta-se :)',
        showCloseButton: true,
      });
      yield put(actions.registerSuccess({ nome, email }));
      history.push('/Login');
    }
  } catch (error) {
    const errors = get(error, 'response.data.error', []);
    const status = get(error, 'response.status', 0);

    if (status === 401) {
      Swal.fire({
        title: 'error',
        text: 'Precisa fazer login novamente!',
        icon: 'error',
      });
      yield put(actions.loginFailure());
      return history.push('/login');
    }

    if (status === 400) {
      Swal.fire({
        title: 'error',
        text: 'O e-mail informado já existe!',
        icon: 'error',
      });
      return yield put(actions.editFailure());
    }
    if (errors.length > 0) {
      errors.map((err) => Swal.fire({ title: 'error', text: err }));
      return yield put(actions.registerFailure());
    }
    Swal.fire({ title: 'error desconhecido', text: error });
  }
}

// Função geradora para tratar a ação de re-hidratação do persist
function persistRehydrate({ payload }) {
  // Tenta pegar o token do payload na chave 'auth.token' usando lodash.get
  const token = get(payload, 'auth.token');
  // Se não houver token, sai da função
  if (!token) return;
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  axios.defaults.headers.post.Authorization = `Bearer ${token}`;
  axios.defaults.headers.get.Authorization = `Bearer ${token}`;
  axios.defaults.headers.delete.Authorization = `Bearer ${token}`;
  axios.defaults.headers.put.Authorization = `Bearer ${token}`;
}

// Exporta um array contendo os watchers (takeLatest) para loginRequest e persistRehydrate
export default all([
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
