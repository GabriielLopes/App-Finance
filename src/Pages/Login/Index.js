/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { get } from 'lodash';
import { FaArrowRight } from 'react-icons/fa';
import { FiUser, FiLock } from 'react-icons/fi';

import { Btn } from './styled';

import * as actions from '../../store/modules/auth/actions';
import Loading from '../../components/Loading/index';

export default function Login(props) {
  const dispatch = useDispatch();
  const prevPath = get(props, 'location.state.prevPath', '/');

  const isLoading = useSelector((state) => state.auth.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (!isEmail(email)) {
      formErrors = true;

      Swal.fire({
        icon: 'error',
        title: 'O e-mail informado é inválido',
        showCloseButton: true,
      });
      return formErrors;
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;

      Swal.fire({
        icon: 'error',
        title: 'Senha inválida!',
        showCloseButton: true,
      });
      return formErrors;
    }

    return dispatch(actions.loginRequest({ email, password, prevPath }));
  }

  return (
    <Btn>
      <Loading isLoading={isLoading} />
      <div className="container my-3">
        <form onSubmit={handleSubmit}>
          <div className="box container-login">
            <div className="row">
              <strong>
                <h1 className="text-center">Entre com sua conta</h1>
              </strong>
              <div className="col-sm my-3">
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
                    <FiUser />
                  </span>
                </p>
              </div>

              <div className="col-sm my-3">
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
            </div>
            <div className="grid">
              <div className="col">
                <button type="submit">
                  Entrar
                  <FaArrowRight className="arrow" />
                </button>
              </div>

              <div className="col">
                <small>Ainda não possui conta?</small>
                <br />
                <small>
                  <a href="/register">Criar conta</a>
                </small>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Btn>
  );
}
