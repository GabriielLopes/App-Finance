/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PropTypes from 'prop-types'

import './style.css'
import { useDispatch } from "react-redux";
import axios from '../../services/axios';
import history from '../../services/history';
import * as actionsAuth from '../../store/modules/auth/actions';
import Loading from "../Loading";

export default function CategoriaConfig({ configuracoesCategoria }) {
  const dispatch = useDispatch();
  const [cadastrarCategoria, setCadastrarCategoria] = useState(false);
  const [verListCategoria, setVerListCategoria] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsloading] = useState(false);

  try {
    useEffect(() => {
      async function getData() {
        const response = await axios.get('/categorias');
        setCategorias(response.data);
      }
      getData()
    }, [])

  } catch (error) {
    const { status } = error.response; // Extract error status

    if (status === 401) {
      dispatch(actionsAuth.loginFailure());
      Swal.fire({
        icon: 'error',
        title: 'Sessão expirada!',
        text: 'Seu login expirou, faça login novamente para acessar sua conta.'
      });
      history.go('/login'); // Redirect to login page
    }
  }

  if (configuracoesCategoria) {
    const btnCategoria = document.querySelector('.btnCategoria');
    if (btnCategoria) {
      btnCategoria.classList = 'button is-active btnCategoria'
      document.querySelector('.btnOptionCategorias').classList = 'box btnOptionCategorias active'

      if (cadastrarCategoria) {
        document.querySelector('.btnListCateg').classList = 'button btnListCateg'
        document.querySelector('.listaCategoria').classList = 'box listaCategoria '

        document.querySelector('.btnCadastroCateg').classList = 'button btnCadastroCateg is-active'
        document.querySelector('.cadastroCateg').classList = 'box cadastroCateg active'
      } else {
        document.querySelector('.btnCadastroCateg').classList = 'button btnCadastroCateg'
        document.querySelector('.cadastroCateg').classList = 'box cadastroCateg'
      }

      if (verListCategoria) {
        document.querySelector('.btnCadastroCateg').classList = 'button btnCadastroCateg'
        document.querySelector('.cadastroCateg').classList = 'box cadastroCateg'


        document.querySelector('.btnListCateg').classList = 'button btnListCateg is-active'
        document.querySelector('.listaCategoria').classList = 'box listaCategoria active'
      } else {
        document.querySelector('.btnListCateg').classList = 'button btnListCateg'
        document.querySelector('.listaCategoria').classList = 'box listaCategoria '
      }

    }
  } else {
    const btnCategoria = document.querySelector('.btnCategoria');
    if (btnCategoria) {
      btnCategoria.classList = 'button btnCategoria';
      document.querySelector('.btnOptionCategorias').classList = 'box btnOptionCategorias'

      document.querySelector('.btnCadastroCateg').classList = 'button btnCadastroCateg'
      document.querySelector('.cadastroCateg').classList = 'box cadastroCateg'

      document.querySelector('.btnListCateg').classList = 'button btnListCateg'
      document.querySelector('.listaCategoria').classList = 'box listaCategoria '
    }
  }

  async function handleSubmit() {
    try {
      setIsloading(true);
      await axios.post('/categorias/', {
        nome,
        descricao
      })
      setIsloading(false);
      Swal.fire({
        icon: 'success',
        title: "Sucesso!",
        text: 'A categoria foi cadastrada com sucesso!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/config');
        }
      })
    } catch (error) {
      setIsloading(false);
      Swal.fire({
        icon: 'error',
        title: "eror",
        text: error,
      })
    }
  }


  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <Loading isLoading={isLoading} />
      <div className='box btnOptionCategorias'>
        <button type="button" className="button btnListCateg" onClick={() => setVerListCategoria(!verListCategoria)}>Ver categorias cadastradas</button>
        <button type="button" className="button btnCadastroCateg" onClick={() => setCadastrarCategoria(!cadastrarCategoria)}>Cadastrar categorias</button>
      </div>

      <div className='box listaCategoria'>
        <label className="label">Lista de categorias</label>
        <table className='table is-hoverable is-fullwidth'>
          <thead>
            <tr>
              <th>NOME</th>
              <th>DESCRIÇÃO</th>
            </tr>
          </thead>
          {categorias.map((categoria) => (
            <tbody>
              <tr>
                <td>{categoria.nome}</td>
                <td>{categoria.descricao}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      <div className='box cadastroCateg'>
        <form onSubmit={handleSubmit}>
          <label className='label'>Cadastro de categorias</label>

          <label className='label'>Nome:</label>
          <input className='input' type='text' placeholder='Ex: Gasto com supermercado, Salário e etc... ' onChange={(e) => setNome(e.target.value)} />

          <label className='label'>Descrição:</label>
          <input className='input' type='text' placeholder="Ex: Compras no Supermercado 'x', salário da empresa 'x' e etc.." onChange={(e) => setDescricao(e.target.value)} />


          <button type='submit' className='button is-link is-left'>Cadastrar</button>
        </form>
      </div>

    </>
  );
}

CategoriaConfig.defaultProps = {
  configuracoesCategoria: false,
};

CategoriaConfig.propTypes = {
  configuracoesCategoria: PropTypes.bool,
}
