/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import isEmail from 'validator/lib/isEmail';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

import { Btn } from './styled';
import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/Loading/index';

export default function Register() {
  const dispatch = useDispatch();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = useSelector((state) => state.auth.isLoading);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'O nome precisa ter mais que 3 caracteres e no máximo 255',
        showCloseButton: true,
      });
      return formErrors;
    }

    if (!isEmail(email)) {
      formErrors = true;

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'O e-mail informado é inválido',
        showCloseButton: true,
      });
      return formErrors;
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'a senha precisa ter mais que 6 caracteres e no máximo 50',
        showCloseButton: true,
      });
      return formErrors;
    }
    
    dispatch(actions.registerRequest({ nome, email, password }));
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
                    onChange={(e) => setNome(e.target.value)}
                    type="name"
                    placeholder="Ex: Pedro Silva"
                  />
                  <span className="icon is-small is-left">
                    <FiUser />
                  </span>
                </p>
              </div>
              <div className="col my-2">
                <label className="label">Email</label>
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="alex@example.com"
                  />
                  <span className="icon is-small is-left">
                    <FiMail />
                  </span>
                </p>
              </div>
              <div className="col my-2">
                <label className="label">Senha</label>
                <p className="control has-icons-left">
                  <input
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="*****"
                  />
                  <span className="icon is-small is-left">
                    <FiLock />
                  </span>
                </p>
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
