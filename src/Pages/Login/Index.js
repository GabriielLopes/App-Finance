/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Container } from '../../styles/EstilosGlobal';
import { Titulo } from './styled';

import axios from '../../services/axios';

export default function Login() {
  React.useEffect(async () => {
    async function getData() {
      const response = await axios.get('/alunos');
      const { data } = await response;
      getData();
    }
  }, []);
  return (
    <Container>
      <Titulo>Login</Titulo>
    </Container>
  );
}
