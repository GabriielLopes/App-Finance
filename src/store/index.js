/* eslint-disable default-param-last */ // Desabilita a regra ESLint "default-param-last" para este arquivo

// Importa o persistStore do redux-persist para persistir o estado do Redux
import { persistStore } from 'redux-persist';

// Importa o createStore e applyMiddleware do redux para criar o store
import { createStore, applyMiddleware } from 'redux';

// Importa o createSagaMiddleware do redux-saga para criar o middleware de sagas
import createSagaMiddleware from 'redux-saga';

// Importa o rootReducer que combina todos os reducers da aplicação (provavelmente em modules/rootReducer.js)
import rootReducer from './modules/rootReducer';

// Importa o rootSaga que é a saga principal da aplicação (provavelmente em modules/rootSagas.js)
import rootSaga from './modules/rootSagas';

// Importa os persistedReducers que definem a configuração da persistência do estado (provavelmente em modules/reduxPersist.js)
import persistedReducers from './modules/reduxPersist';

// Cria o middleware de sagas
const sagaMiddleware = createSagaMiddleware();

// Cria o store do Redux usando os persistedReducers combinados com o rootReducer e aplica o middleware de sagas
const store = createStore(
  persistedReducers(rootReducer),
  applyMiddleware(sagaMiddleware)
);

// Inicia a saga principal
sagaMiddleware.run(rootSaga);

// Exporta o persistor para persistir o estado do Redux
export const persistor = persistStore(store);

// Exporta o store do Redux como padrão
export default store;
