/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-duplicates */
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaSignInAlt } from 'react-icons/fa';
import { Nav } from './styled';

export default function Header() {
  return (
    <Nav>
      <a href="/">
        <FaHome /> Home
      </a>
      <a href="Alunos">
        <FaUser /> Alunos
      </a>
      <a href="Sair">
        <FaSignInAlt /> Sair
      </a>
    </Nav>
  );
}
