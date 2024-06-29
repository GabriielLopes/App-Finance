/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';

import './style.css'
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "../../services/axios";

import Loading from '../Loading/index';

export default function ContaConfig({ configuracoesConta }) {
  const [cadastrarConta, setCadastrarConta] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsloading] = useState(false);

  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [tipo, setTipo] = useState('');
  const [saldo, setSaldo] = useState(0);


  if (configuracoesConta) {
    const btnConfigConta = document.querySelector('.btnConta')
    if (btnConfigConta) {
      btnConfigConta.classList = 'button btnConta is-active'

      const boxOptionsConta = document.querySelector('.btnOptionConta')
      if (boxOptionsConta) {
        boxOptionsConta.classList = 'box btnOptionConta active'

        if (cadastrarConta) {
          const btnCadastroConta = document.querySelector('.btnCadastroConta')
          btnCadastroConta.classList = 'button btnCadastroConta is-active'
          const boxCadastrarConta = document.querySelector('.cadastroConta')
          if (boxCadastrarConta) {
            boxCadastrarConta.classList = 'box cadastroConta active'
          }
        } else {
          const btnCadastroConta = document.querySelector('.btnCadastroConta')
          btnCadastroConta.classList = 'button btnCadastroConta'
          const boxCadastrarConta = document.querySelector('.cadastroConta')
          if (boxCadastrarConta) {
            boxCadastrarConta.classList = 'box cadastroConta'
          }
        }
      }
    }

  } else {
    const btnConfigConta = document.querySelector('.btnConta')
    if (btnConfigConta) {
      btnConfigConta.classList = 'button btnConta'

      const boxOptionsConta = document.querySelector('.btnOptionConta')
      if (boxOptionsConta) {
        boxOptionsConta.classList = 'box btnOptionConta'

        const boxCadastrarConta = document.querySelector('.cadastroConta')
        boxCadastrarConta.classList = 'box cadastroConta'
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsloading(true);
      axios.post(`/contas/`, {
        banco,
        agencia,
        conta,
        tipo,
        saldo,
        user_id: user.id
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'error',
          text: `${err.response}`
        })
      })
      Swal.fire({
        title: 'Sucesso!',
        icon: 'success',
        text: 'A conta foi criada com sucesso!'
      }).then((result) => {
        if (result.isConfirmed) {
          setBanco('');
          setAgencia('');
          setConta('');
          setTipo('');
          setSaldo('')
        }
      })
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      Swal.fire({
        title: 'error',
        icon: 'error',
        text: `${error.response}`
      })
    }
    setIsloading(false);
  }

  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='box btnOptionConta'>
        <button type='button' className='button btnCadastroConta' onClick={() => setCadastrarConta(!cadastrarConta)}>Cadastrar uma nova conta</button>
      </div>


      <div className='box cadastroConta'>
        <form onSubmit={handleSubmit}>
          <label className='label'>Cadastrar nova conta</label>

          <label className='label'>Banco:</label>
          <input type='text' className='input' placeholder='EX: "Itau, Bradesco, Banco do Brasil e etc..."'
            onChange={(e) => setBanco(e.target.value)}
          />

          <label className='label'>Agência:</label>
          <input type='text' className='input' placeholder='EX: 101010-2'
            onChange={(e) => setAgencia(parseFloat(e.target.value))}
          />

          <label className='label'>Conta:</label>
          <input type='text' className='input' placeholder='EX: 101010-2'
            onChange={(e) => setConta(parseFloat(e.target.value))}
          />

          <label className='label'>Tipo</label>
          <div className='select'>
            <select className='select' onChange={(e) => setTipo(e.target.value)}>
              <option value="Conta Corrente">Conta Corrente</option>
              <option value="Conta Poupança">Conta Poupança</option>
            </select>
          </div>

          <label className='label'>Saldo atual</label>

          <NumericFormat
            className="input"
            value={saldo}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            fixedDecimalScale={2}
            placeholder='Ex: R$ 125,00'
            allowNegative={false}
            // eslint-disable-next-line react/jsx-no-bind
            onValueChange={(e) => setSaldo(e.floatValue)}
          />
          <button type='submit' className='button is-link is-left'>Cadastar</button>
        </form>
      </div>
    </>
  )
}

ContaConfig.defaultProps = {
  configuracoesConta: false,
};

ContaConfig.propTypes = {
  configuracoesConta: PropTypes.bool,
}
