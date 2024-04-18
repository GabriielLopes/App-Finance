import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaUser, FaSignInAlt } from 'react-icons/fa';

import { Nav } from './styled';

export default function Header() {
  const botaoClicado = useSelector(
    (state) => state.exampleReducer.botaoClicado
  );
  return (
    <Nav>
      <Link to="/">
        <FaHome /> Home
      </Link>
      <Link to="/Alunos">
        <FaUser /> Alunos
      </Link>
      <Link to="/Sair">
        <FaSignInAlt /> Sair
      </Link>
      {botaoClicado ? 'Clicado' : 'Não Clicado'}
    </Nav>
  );
}
