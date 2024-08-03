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
  const [erro] = useState([false,false,false])

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


  function validaBanco(e) {
    setBanco(e.target.value);
    const input = e.target;
    const infoError = document.querySelector('.erro-banco');
    const temSimbolos = (string) => {
      const regex = /^[A-Za-z\s]+$/i;
      return regex.test(string)
    }

    if (banco.length === 0) {
      erro[0] = true
      input.classList = 'input is-danger'
      infoError.textContent = "* Este campo não pode ficar vazio!"
      return
    } if (banco.length < 3 || banco.length > 50) {
      erro[0] = true
      input.classList = 'input is-danger'
      infoError.textContent = "* O nome da instituição financeira deve ter no mínimo 3 caracteres e no máximo 50!"
      return
    } if (!temSimbolos(banco)) {
      erro[0] = true
      input.classList = 'input is-danger'
      infoError.textContent = "* O nome da instituição não pode conter símbolos ou números!"
      return
    }
    erro[0] = false
    input.classList = 'input'
    infoError.textContent = ""

    input.addEventListener("input", validaBanco)
  }

  function validaAgencia(e) {
    setAgencia(e.target.value);
    const input = e.target;
    const infoError = document.querySelector('.erro-agencia');

    const regex = /^\d+$/;
    if (e.target.value.length <= 0) {
      erro[1] = true;
      input.classList = 'input is-danger'
      infoError.textContent = "O campo agência não pode ficar vazio!"
      return
    } if (!regex.test(agencia)) {
      erro[1] = true;
      input.classList = 'input is-danger'
      infoError.textContent = "O campo agência só pode conter números!"
      return
    }
    erro[1] = false;
    input.classList = 'input'
    infoError.textContent = ""


    input.addEventListener("input", validaAgencia)
  }

  function validaConta(e) {
    setConta(e.target.value);
    const input = e.target;
    const infoError = document.querySelector('.erro-conta');

    const regex = /^\d+$/;
    if (e.target.value.length <= 0) {
      erro[2] = true;
      input.classList = 'input is-danger'
      infoError.textContent = "O campo Número da conta não pode ficar vazio!"
      return
    } if (!regex.test(conta)) {
      erro[2] = true;
      input.classList = 'input is-danger'
      infoError.textContent = "O campo Número da conta só pode conter números!"
      return
    }
    erro[2] = false;
    input.classList = 'input'
    infoError.textContent = ""

    input.addEventListener("input", validaConta)
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (banco.length <= 0) {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: `O campo "Nome da instituição financeira", não pode ficar vazio!`,
      })
    }

    if (agencia.length <= 0) {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: `O campo "Agência", não pode ficar vazio!`,
      })
    }

    if (conta.length <= 0) {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: `O campo "Número da conta", não pode ficar vazio!`,
      })
    }

    if (erro.filter((value) => value === true).length <=0) {
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
    }
    return setIsloading(false);
  }



  return (
    <>
      <Loading isLoading={isLoading} />
      <div className='box btnOptionConta'>
        <button type='button' className='button btnCadastroConta' onClick={() => setCadastrarConta(!cadastrarConta)}>Cadastrar uma nova conta</button>
      </div>

      <div className='box cadastroConta'>
        <form onSubmit={handleSubmit}>
          <p className='label'>Cadastrar nova conta</p>

          <label className='label' htmlFor="banco">Nome da instituição financeira:
            <input type='text' className='input' name="banco" value={banco} placeholder='EX: "Itau, Bradesco, Banco do Brasil e etc..."'
              onChange={validaBanco}
            />
            <div className="content is-small">
              <p className="info-erro erro-banco" />
            </div>
          </label>

          <label className='label' htmlFor="agencia">Agência:
            <input type='text' className='input' name="agencia" placeholder='EX: 101010-2'
              value={agencia}
              onChange={validaAgencia}
            />
            <div className="content is-small">
              <p className="info-erro erro-agencia" />
            </div>
          </label>

          <label className='label' htmlFor="conta">Número da conta:
            <input type='text' className='input' name="conta" placeholder='EX: 101010-2'
              value={conta}
              onChange={validaConta}
            />
            <div className="content is-small">
              <p className="info-erro erro-conta" />
            </div>
          </label>

          <label className='label' htmlFor="tipo">Tipo
            <div className='select'>
              <select className='select' name="tipo" onChange={(e) => setTipo(e.target.value)}>
                <option value="Conta Corrente">Conta Corrente</option>
                <option value="Conta Poupança">Conta Poupança</option>
              </select>
            </div>
          </label>


          <p className='label' htmlFor="saldo">Saldo atual
            <NumericFormat
              className="input"
              name="saldo"
              value={saldo}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              fixedDecimalScale={2}
              placeholder='Ex: R$ 125,00'
              allowNegative={false}
              onValueChange={(e) => setSaldo(e.floatValue)}
            />
          </p>

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
