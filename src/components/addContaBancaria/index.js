/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import { NumericFormat } from 'react-number-format';
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Loading from '../Loading/index';
import axios from "../../services/axios";
import history from "../../services/history";
import Footer from "../Footer";
import './style.css';

export default function AddContaBancaria() {
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsloading] = useState(false);
  const [erro] = useState([false, false, false])
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [tipo, setTipo] = useState('');
  const [saldo, setSaldo] = useState(0);
  const images = [[
    'https://api-finance-zeta.vercel.app/images/imagem_1.png'],
  ['https://api-finance-zeta.vercel.app/images/imagem_2.png'],
  ['https://api-finance-zeta.vercel.app/images/imagem_3.png']
  ];


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
      input.classList = 'input valor is-danger'
      infoError.textContent = "* Este campo não pode ficar vazio!"
      return
    } if (banco.length < 3 || banco.length > 50) {
      erro[0] = true
      input.classList = 'input valor is-danger'
      infoError.textContent = "* O nome da instituição financeira deve ter no mínimo 3 caracteres e no máximo 50!"
      return
    } if (!temSimbolos(banco)) {
      erro[0] = true
      input.classList = 'input valor is-danger'
      infoError.textContent = "* O nome da instituição não pode conter símbolos ou números!"
      return
    }
    erro[0] = false
    input.classList = 'input valor'
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
      input.classList = 'input valor is-danger'
      infoError.textContent = "O campo agência não pode ficar vazio!"
      return
    } if (!regex.test(agencia)) {
      erro[1] = true;
      input.classList = 'input valor valor is-danger'
      infoError.textContent = "O campo agência só pode conter números!"
      return
    }
    erro[1] = false;
    input.classList = 'input valor'
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
      input.classList = 'input valor is-danger'
      infoError.textContent = "O campo Número da conta não pode ficar vazio!"
      return
    } if (!regex.test(conta)) {
      erro[2] = true;
      input.classList = 'input valor is-danger'
      infoError.textContent = "O campo Número da conta só pode conter números!"
      return
    }
    erro[2] = false;
    input.classList = 'input valor'
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

    if (erro.filter((value) => value === true).length <= 0) {
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
            history.go('/');
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
    <div className="pages_content">
      <Loading isLoading={isLoading} />
      <h1 className="title">Boas vindas!!</h1>
      <div className="grid">
        <div className="col">
          <div className="notification is-primary">
            <div className="content is-medium">
              <p>Seja bem vindo(a) <strong>{user.nome}!!</strong> <br />
                Veja abaixo algumas das funcionalidades do aplicativo <strong>App Finance.</strong> <br />
                <i className='bx bx-down-arrow-alt' />
              </p>
            </div>

          </div>
        </div>

      </div>

      <div className="grid">

        <div className="col">
          <center>
            <Carousel autoPlay interval={3000} width="80%" showArrows infiniteLoop>
              <div>
                <img src={images[0]} alt="imagem-sistema" />
              </div>

              <div>
                <img src={images[1]} alt="imagem-sistema" />
              </div>

              <div>
                <img src={images[2]} alt="imagem-sistema" />
              </div>
            </Carousel>
          </center>
        </div>

        <div className="col">
          <div className="notification">
            <div className="content is-medium">
              <i className='bx bx-info-circle' /> <br />
              <p>No <strong>App Finance</strong>, você poderá realizar totalmente seu controle financeiro pessoal. <br />
                <br />
                Com ele, você poderá fazer:
                <strong>
                  <ul>
                    <li>Planejamento mensal;</li>
                    <li>Definir metas de curto, médio e longo prazo;</li>
                    <li>Gráficos de receitas e categorias;</li>
                    <li>Cadastro de despesas fixas;</li>
                    <li>Visualização de balanço mensal;</li>
                    <li>E entre outros!!</li>
                  </ul>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">

        <div className="col">
          <div className="box">
            <form onSubmit={handleSubmit}>
              <h1 className="title">Cadastro de conta bancária <i className='bx bxs-bank' /></h1>
              <div className="grid">
                <div className="col">
                  <label className='label' htmlFor="banco">Nome da instituição financeira:
                    <p className="control has-icons-left">
                      <input type='text' className='input valor' name="banco" value={banco} placeholder='Ex: "Itau, Bradesco, Banco do Brasil e etc..."'
                        onChange={validaBanco}
                      />
                      <span className="icon is-left"><i className='bx bxs-bank' /></span>
                    </p>
                    <div className="content is-small">
                      <p className="info-erro erro-banco" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid">
                <div className="col">
                  <label className='label' htmlFor="agencia">
                    Agência:
                    <p className="control has-icons-left">
                      <input type='text' className='input valor' name="agencia" placeholder='Ex: 101081'
                        value={agencia}
                        onChange={validaAgencia}
                      />
                      <span className="icon is-large is-left"><i className='bx bx-label' /></span>
                    </p>
                    <div className="content is-small">
                      <p className="info-erro erro-agencia" />
                    </div>
                  </label>
                </div>

                <div className="col">
                  <label className='label' htmlFor="conta">
                    Número da conta:
                    <p className="control has-icons-left">
                      <input type='text' className='input valor' name="conta" placeholder='EX: 1010102'
                        value={conta}
                        onChange={validaConta}
                      />
                      <span className="icon is-large is-left"><i className='bx bx-label' /></span>
                    </p>
                    <div className="content is-small">
                      <p className="info-erro erro-conta" />
                    </div>
                  </label>

                </div>
              </div>

              <div className="grid">
                <div className="col">
                  <label className='label' htmlFor="tipo">
                    Tipo: <br />
                    <div className='select'>
                      <select className='select' name="tipo" onChange={(e) => setTipo(e.target.value)}>
                        <option value="Conta Corrente">Conta Corrente</option>
                        <option value="Conta Poupança">Conta Poupança</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="col">
                  <label className='label' htmlFor="saldo">
                    Saldo atual:

                    <p className="control has-icons-left">
                      <NumericFormat
                        className="input valor"
                        name="saldo"
                        value={saldo}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale={2}
                        placeholder='Ex: R$ 125,00'
                        allowNegative={false}
                        onFocus={(e) => e.target.select()}
                        onValueChange={(e) => setSaldo(e.floatValue)}
                      />
                      <span className="icon is-large is-left"><p className="bx">R$</p></span>
                    </p>
                  </label>
                </div>
              </div>

              <button type='submit' className='button is-link is-left'>Cadastar</button>
            </form>

          </div>
        </div>

        <div className="col">
          <div className="notification is-success">
            <div className="content is-medium">
              <p>Cadastre já a sua conta bancária e aproveite os benefícios do <strong>App Finance</strong>!</p> <br />
              <center><i className='bx bx-left-arrow-alt' /></center>
              <br />

            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <Footer />
      </div>
    </div>
  )
}
