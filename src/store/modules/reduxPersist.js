// Importa o storage do redux-persist, que define o local de armazenamento dos dados persistidos (local storage por padrão)
import storage from 'redux-persist/lib/storage';

// Importa o persistReducer do redux-persist, utilizado para criar um reducer persistente
import { persistReducer } from 'redux-persist';

// Função que recebe um objeto contendo os reducers da aplicação
export default (reducers) => {
  // Cria um objeto de configuração para o persistReducer
  const persistedReducers = persistReducer(
    {
      // Chave única para identificar os dados persistidos no storage
      key: 'CONSUMO-API',
      // Define o storage utilizado para persistir os dados (normalmente 'localStorage')
      storage,

      whitelist: ['auth', 'transacao', 'despesa', 'editMetasFin', 'planejamentosMensais', 'configuracoes'],
    },
    // Reducers da aplicação passados como argumento
    reducers
  );

  // Retorna o reducer persistente
  return persistedReducers;
};
