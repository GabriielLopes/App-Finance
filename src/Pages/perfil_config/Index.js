/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import isEmail from 'validator/lib/isEmail';

import './style.css';
import axios from '../../services/axios';
import history from '../../services/history'
import Loading from '../../components/Loading/index';
import * as actionsAuth from '../../store/modules/auth/actions'
import Footer from '../../components/Footer';

export default function PerfilConfig() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { id } = user
  const auth = useSelector((state) => state.auth);
  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [fotoUser, setFotoUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      axios.defaults.headers.get.Authorization = `Bearer ${auth.token}`
      const response = await axios.get(`/fotos/${user.id}`);
      setFotoUser(response.data);
      setIsLoading(false)
    }
    getData()
  }, [])


  const handleFotoChange = async (e) => {
    const foto = e.target.files[0];

    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('foto', foto);

    try {
      setIsLoading(true);
      await axios.post('/fotos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: 'sucesso!',
        icon: 'success',
        text: 'Foto atualizada com sucesso',
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/editar-perfil')
        }
      });
      setIsLoading(false);
    } catch (err) {
      const { status } = get(err, 'response', '');
      Swal.fire({
        title: 'erro!',
        icon: 'erro',
        text: err.response.data.errors,
      });

      if (status === 401) {
        dispatch(actionsAuth.loginFailure());
        Swal.fire({
          title: 'erro!',
          icon: 'erro',
          text: 'Você precisa fazer login novamente!',
        });
      }
      setIsLoading(false);
    }
  };

  const temSimbolos = (string) => {
    const regex = /^[A-Za-z\s]+$/i;
    return regex.test(string)
  }

  function validaNome(e) {
    setNome(e.target.value);
    const input = e.target;
    const infoError = document.querySelector('.erro-nome')
    input.addEventListener("input", validaNome);

    if (nome.length < 3 || nome.length > 50) {
      setErrors(true)
      input.classList = 'input is-danger'
      infoError.textContent = '* O campo "Nome" deve ter de 3 até 50 caracteres!'
      input.addEventListener("input", validaNome)
      return

    } if (!temSimbolos(nome)) {
      setErrors(true);
      input.classList = 'input is-danger'
      infoError.textContent = '* O campo "Nome" não pode ter símbolos!'
      input.addEventListener("input", validaNome)
      return
    }
    input.classList = 'input'
    infoError.textContent = ''
    input.addEventListener("input", validaNome)
    setErrors(false);

  }

  function validaEmail(e) {
    setEmail(e.target.value)
    const input = e.target
    const infoError = document.querySelector('.erro-email')
    if (!isEmail(email)) {
      setErrors(true);
      input.classList = 'input is-danger'
      infoError.textContent = '* O e-mail informado é inválido!'
      input.addEventListener("input", validaEmail)
      return
    }
    setErrors(false);
    input.classList = 'input'
    input.addEventListener("input", validaEmail)
    infoError.textContent = ''
  }

  function validaSenha(e,) {
    setPassword(e.target.value)
    const input = e.target
    const infoError = document.querySelector('.erro-senha');
    if (password.length < 8) {
      setErrors(true);
      input.classList = 'input is-danger'
      infoError.textContent = '* A sua senha precisa ter pelo menos 8 caracteres'
      input.addEventListener("input", validaSenha)
      return
    }

    if (temSimbolos(password)) {
      setErrors(true)
      input.classList = 'input is-danger'
      infoError.textContent = '* A sua senha precisa ter pelo menos um símbolo!'
      input.addEventListener("input", validaSenha)
      return
    }
    setErrors(false)
    input.classList = 'input'
    input.addEventListener("input", validaSenha)
    infoError.textContent = ''

  }

  function validaConfirmSenha(e) {
    setConfirmSenha(e.target.value);
    const input = e.target;
    const infoError = document.querySelector('.erro-senha')
    if (password !== confirmSenha) {
      setErrors(true);
      input.classList = 'input is-danger'
      infoError.textContent = '* As senhas não correspondem!'
      input.addEventListener("input", validaConfirmSenha)
      return
    }
    input.classList = 'input'
    infoError.textContent = ''
    input.addEventListener("input", validaConfirmSenha)
    setErrors(false)
  }

  function handleCancel() {
    setEditarPerfil(false);
    setNome(user.nome);
    setEmail(user.email);
    setPassword('');
    setConfirmSenha('');
    const infosErrors = document.querySelectorAll('.info-erro');
    infosErrors.forEach((el) => {
      el.textContent = '';
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!errors) {
      try {
        setIsLoading(true)
        dispatch(actionsAuth.registerRequest({ id, nome, email, password }))
        setIsLoading(false)
        setEditarPerfil(false)
      } catch (error) {
        setIsLoading(false);
        Swal.fire({ title: 'error!', text: error.response.data })
      }
    }
  }

  return (
    <div className='pages_content config_perfil'>
      <Loading isLoading={isLoading} />
      <h1 className='title'>Editar perfil</h1>

      <div className='grid'>
        <div className='box'>
          <div className='col'>
            {fotoUser.length > 0 ? (
              <img src={fotoUser[0].url} alt='profile_perfil' width={500} />
            ) : (<i className='bx bxs-user-circle' />)}

            <div className='grid'>

              <div className='col'>

                <div className="file">
                  <label className="file-label">
                    <input className="file-input" type="file" name="resume" onChange={handleFotoChange} />
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className='bx bx-upload' />
                      </span>
                      <span className="file-label"> Escolher foto </span>
                    </span>
                  </label>
                </div>
              </div>


            </div>
          </div>
        </div>

        <div className='col'>
          <form onSubmit={handleSubmit}>
            <label htmlFor='name'>
              Nome:
              <input type='name' name='name' className='input' disabled={!editarPerfil}
                value={nome}
                onChange={(e) => validaNome(e)}
              />
              <div className='content is-small'>
                <p className='info-erro erro-nome' />
              </div>
            </label>

            <label htmlFor='email'>
              E-mail:
              <input type='email' name='email' className='input' disabled={!editarPerfil}
                value={email}
                onChange={(e) => validaEmail(e)}
              />
              <div className='content is-small'>
                <p className='info-erro erro-email' />
              </div>
            </label>

            <label htmlFor='password' >
              Insira sua nova senha:
              <input type='password' name='password' className='input' onChange={(e) => validaSenha(e)} disabled={!editarPerfil} />
            </label>

            <label htmlFor='password' >
              Confirmar nova senha:
              <input type='password' name='password' className='input' onChange={(e) => validaConfirmSenha(e)} disabled={!editarPerfil} />
              <div className='content is-small'>
                <p className='info-erro erro-senha' />
              </div>
            </label>

            <div className='content is-small' hidden={!editarPerfil}>
              <p className=''><strong>OBS: </strong> Deixar em branco caso não queira alterar a senha.</p>
            </div>
            <div className='grid grid-botoes'>
              <div className='col'>
                {editarPerfil ? (
                  ""
                ) : (
                  <button type='button' className='button is-primary' onClick={() => setEditarPerfil(true)}>
                    <i className='bx bxs-edit' />
                    Editar perfil
                  </button>
                )}
              </div>

              <div className='col'>
                {editarPerfil ? (
                  <button type='submit' className='button is-success' >
                    <i className='bx bxs-save' />
                    Salvar alterações
                  </button>

                ) : (
                  ""
                )}
              </div>

              <div className='col'>
                {editarPerfil ? (
                  <button type='button' className='button is-danger' onClick={handleCancel}>
                    <i className='bx bx-x' />
                    Cancelar
                  </button>
                ) : ("")}
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
