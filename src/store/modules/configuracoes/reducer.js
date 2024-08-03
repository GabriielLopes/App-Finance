import * as types from '../types';

const estadoInical = {
  editConfig: false,
  config: {},
};

// eslint-disable-next-line default-param-last
export default function Reducer(state = estadoInical, action) {

  switch (action.type) {
    case types.EDIT_CONFIG_REQUEST: {
      const newState = { ...state };
      newState.editConfig = !newState.editConfig;
      return newState;
    }

    case types.EDIT_CONFIG_FAILURE: {
      const newState = { ...state };
      newState.editConfig = false;
      newState.config = {};
      return newState;
    }

    case types.EDIT_CONFIG_SUCCESS: {
      const newState = { ...state };
      newState.config = action.payload.config;
      newState.editConfig = true;
      return newState
    }

    default: {
      return state;
    }
  }
}
