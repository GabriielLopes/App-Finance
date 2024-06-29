/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './styled.css';

import Swal from 'sweetalert2';
import Transacao from '../Transacao/Index'

import * as actions from '../../store/modules/transacao/actions';
import * as actionsAuth from '../../store/modules/auth/actions';
import axios from '../../services/axios';

export default function Header() {
  const dispatch = useDispatch();
  const [sidebar, setSidebar] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth);
  const novaTransacao = useSelector((state) => state.transacao.novaTransacao)
  const modoNoturno = useSelector((state) => state.auth.modoEscuro);
  const [foto, setFoto] = useState([]);

  try {
    useEffect(() => {
      async function getData() {
        axios.defaults.headers.get.Authorization = `Bearer ${auth.token}`
        if (isLoggedIn) {
          const response = await axios.get(`fotos/${user.id}`).catch((err) => {
            if (err.response.status === 401) {
              console.error(err.response.data.errors)
            }

          })
          if (response) {
            setFoto(response.data);
          }
        }

      }
      getData()
    }, [])
  } catch (error) {
    Swal.fire({
      title: 'error!',
      icon: 'error',
      text: error,
    })
  }



  if (!isLoggedIn) return <></>;


  if (novaTransacao) {
    const boxTransacao = document.querySelector('.transacao')
    if (boxTransacao) {
      boxTransacao.classList = 'transacao active'
    }
  } else {
    const boxTransacao = document.querySelector('.transacao')
    if (boxTransacao) {
      boxTransacao.classList = 'transacao'
    }
  }

  function handleClick() {
    setSidebar(!sidebar);
  }

  if (sidebar) {
    const sideBar = document.querySelector('.sidebar')
    if (sideBar) {
      sideBar.classList = 'sidebar active'
    }
  } else {
    const sideBar = document.querySelector('.sidebar')
    if (sideBar) {
      sideBar.classList = 'sidebar'
    }
  }

  function logout() {
    Swal.fire({
      icon: 'question',
      title: 'Tem certeza?',
      text: 'Tem certeza que quer sair?',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(actionsAuth.loginFailure())

        Swal.fire({
          icon: 'success',
          title: 'Deslogado com sucesso!',
          text: 'Até a próxima! :)'
        })
      }
    })
  }


  if (modoNoturno) {
    document.querySelector('html').classList = `theme-dark`
  } else {
    document.querySelector('html').classList = `theme-light`
  }



  return (
    <>
      <Transacao />

      <div className="sidebar">
        <div className="logo_content">
          <div className="logo">
            <i className='bx bx-bar-chart' />
            <div className="logo_name">  APP FINANCE</div>
          </div>
          <i className='bx bx-menu' role="button" tabIndex={0} id="btn" onClick={handleClick} />
        </div>
        <ul className='nav_list'>
          <li> <a href='/'> <i className='bx bxs-dashboard' /><span className='links_name'>Dashboard</span> </a> <span className='tooltip'>Dashboard</span></li>
          <li > <a href='#' role='button' tabIndex={0} onClick={() => dispatch(actions.novaTransacaoRequest())}> <i className='bx bx-transfer' /><span className='links_name'>Transações</span></a> <span className='tooltip'>Transações</span></li>
          <li> <a href='/editar-perfil/'> <i className='bx bx-user' /><span className='links_name'>Perfil de usuário</span></a> <span className='tooltip'>Perfil</span></li>
          <li> <a href='/config'> <i className='bx bx-cog' /><span className='links_name'>Configurações</span></a> <span className='tooltip'>Configurações</span></li>
          {modoNoturno ? (
            <li> <a href='#' onClick={() => dispatch(actionsAuth.modoNoturnoSuccess())}> <i className='bx bx-sun' /><span className='links_name'>Modo claro</span></a> <span className='tooltip'>Modo claro</span></li>
          ) : (
            <li> <a href='#' onClick={() => dispatch(actionsAuth.modoNoturnoSuccess())}> <i className='bx bx-moon' /><span className='links_name'>Modo escuro</span></a> <span className='tooltip'>Modo escuro</span></li>
          )}

        </ul >
        <div className="profile_content">
          <div className="profile">
            <div className="profile_details">
              {foto.length > 0 ? (
                <img src={foto[0].url} alt='profile_perfil' />
              ) : (<i className='bx bxs-user-circle' />)}
              <div className="name_job">
                <div className="name">{user.nome}</div>
                <div className='job'>{user.email}</div>
              </div>
            </div>
            <i className='bx bx-log-out' id="log_out" tabIndex={0} role='button' onClick={logout} />
          </div>
        </div>
      </div >
    </>
  );
}
