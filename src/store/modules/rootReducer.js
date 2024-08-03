// Importa a função combineReducers do redux para combinar reducers
import { combineReducers } from 'redux';

// Importa o reducer de autenticação (provavelmente localizado em auth/reducer.js)
import auth from './auth/reducer';
import transacao from './transacao/reducer';
import despesa from './despesa/reducer'
import editMetasFin from './editMetasFin/reducer';
import planejamentosMensais from './planejamentosMensais/reducer';
import configuracoes from './configuracoes/reducer';

// Combina os reducers em um único reducer raiz
export default combineReducers({
  auth,
  transacao,
  despesa,
  editMetasFin,
  planejamentosMensais,
  configuracoes
});
