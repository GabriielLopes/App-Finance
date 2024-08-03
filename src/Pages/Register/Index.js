/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

import Swal from 'sweetalert2';
import { Btn } from './styled';
import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/Loading/index';

export default function Register() {
  const dispatch = useDispatch();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [errors, setErrors] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (nome.length <= 0) {
      return Swal.fire({
        title: 'error!',
        icon: 'error',
        text: `O campo "Nome", não pode ficar vazio!`
      })
    }

    if (email.length <= 0) {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: `O campo "E-mail", não pode ficar vazio!`,
      })
    }

    if (password.length <= 0) {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: `O campo "Senha", não pode ficar vazio!`,
      })
    }
    if (confirmSenha.length <= 0) {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: 'O campo "Confirme sua senha", não pode ficar vazio!'
      })
    }
    if (errors === false) {
      return dispatch(actions.registerRequest({ nome, email, password }));
    }

  }

  return (
    <Btn>
      <Loading isLoading={isLoading} />
      <div className="container my-2">
        <div className="box container-login">
          <h1 className="text-center">Crie sua conta</h1>
          <div className="row">
            <form onSubmit={handleSubmit}>
              <div className="col">
                <label className="label">Nome</label>
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    value={nome}
                    onChange={validaNome}
                    type="name"
                    placeholder="Ex: Pedro Silva"
                  />
                  <span className="icon is-small is-left">
                    <FiUser />
                  </span>
                </p>
                <div className='content is-small'>
                  <p className='info-erro erro-nome' />
                </div>
              </div>
              <div className="col my-2">
                <label className="label">Email</label>
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    value={email}
                    onChange={validaEmail}
                    type="email"
                    placeholder="alex@example.com"
                  />
                  <span className="icon is-small is-left">
                    <FiMail />
                  </span>
                </p>
                <div className='content is-small'>
                  <p className='info-erro erro-email' />
                </div>
              </div>
              <div className="col my-2">
                <label className="label">Senha</label>
                <p className="control has-icons-left">
                  <input
                    className="input"
                    value={password}
                    onChange={validaSenha}
                    type="password"
                    placeholder="*****"
                  />
                  <span className="icon is-small is-left">
                    <FiLock />
                  </span>
                </p>
              </div>

              <div className="col my-2">
                <label className="label">Confirme sua senha</label>
                <p className="control has-icons-left">
                  <input
                    className="input"
                    value={confirmSenha}
                    onChange={validaConfirmSenha}
                    type="password"
                    placeholder="*****"
                  />
                  <span className="icon is-small is-left">
                    <FiLock />
                  </span>
                </p>
                <div className='content is-small'>
                  <p className='info-erro erro-senha' />
                </div>
              </div>
              <div className="grid my-3">
                <div className="col">
                  <button type="submit">Criar minha conta</button>
                </div>
                <div className="col">
                  <small>Já possui uma conta?</small>
                  <br />
                  <small>
                    <a href="/login">Entrar na conta</a>
                  </small>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Btn>
  );
}
