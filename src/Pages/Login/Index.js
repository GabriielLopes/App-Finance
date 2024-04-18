import React from 'react';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/EstilosGlobal';
import { Titulo } from './styled';
import * as exampleActions from '../../store/modules/exemple/actions';

export default function Login() {
  const dispatch = useDispatch();

  function handleClick(e) {
    e.preventDefault(); // Parar o evento padrão
    dispatch(exampleActions.default());
  }

  return (
    <Container>
      <Titulo>Login</Titulo>
      <button type="button" onClick={handleClick}>
        Enviar
      </button>
    </Container>
  );
}
