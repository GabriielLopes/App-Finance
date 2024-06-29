// Importa a função all do redux-saga/effects
import { all } from 'redux-saga/effects';

// Importa as sagas de autenticação do arquivo auth/sagas.js
import auth from './auth/sagas';

// Função raiz das sagas da aplicação
export default function* rootSaga() {
  // Inicia todas as sagas simultaneamente
  yield all([auth]);
}
