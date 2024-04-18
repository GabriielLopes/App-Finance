/* eslint-disable default-param-last */
const estadoInical = {
  botaoClicado: false,
};

export default function Reducer(state = estadoInical, action) {
  switch (action.type) {
    case 'BOTAO_CLICADO': {
      const newState = { ...state };
      newState.botaoClicado = !newState.botaoClicado;
      return newState;
    }
    default: {
      return state;
    }
  }
}
