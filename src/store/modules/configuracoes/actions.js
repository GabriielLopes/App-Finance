import * as types from '../types';

export function editConfigRequest(payload) {
  return {
    type: types.EDIT_CONFIG_REQUEST,
    payload
  }
}

export function editConfigFailure(payload) {
  return {
    type: types.EDIT_CONFIG_FAILURE,
    payload,
  }
}

export function editConfigSuccess(payload) {
  return {
    type: types.EDIT_CONFIG_SUCCESS,
    payload,
  }
}
