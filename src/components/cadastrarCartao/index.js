/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import './style.css';
import Loading from "../Loading/index";
import * as actionsCartoes from '../../store/modules/cartoes/actions';
import axios from "../../services/axios";
import history from "../../services/history";

export default function CadastrarCartao() {
  const dispatch = useDispatch();
  const cadastrarCartao = useSelector((state) => state.cartoes.cadastrarCartao);
  const user_id = useSelector((state) => state.auth.user.id);
  const [conta_id, setConta_id] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [nome, setNome] = useState('');
  const [limite, setLimite] = useState(0);
  const [diaVencFatura, setDiaVencFatura] = useState(0);
  const [diaFechFatura, setDiaFechFatura] = useState(0);

  if (cadastrarCartao) {
    const divCadastroCartao = document.querySelector('.divCadastroCartao')
    if (divCadastroCartao) {
      divCadastroCartao.classList = 'divCadastroCartao active'
    }
  } else {
    const divCadastroCartao = document.querySelector('.divCadastroCartao')
    if (divCadastroCartao) {
      divCadastroCartao.classList = 'divCadastroCartao'
    }
  }

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/contas/index/${user_id}`)
        setConta_id(response.data[0].id)
      } catch (error) {
         Swal.fire({
          title: 'error!',
          icon: 'error',
          text: error.response.data.errors
        })
      }
    }
    getData()
  }, [])

  // eslint-disable-next-line consistent-return
  async function handleSubmit(e) {
    e.preventDefault();

    const temSimbolos = (string) => {
      const regex = /^[A-Za-z\s]+$/i;
      return regex.test(string)
    }
    if (nome.length <= 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O nome/apelido não pode estar vazio!'
      })
    }
    if (nome.length < 3) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O nome/apelido do cartão deve ter pelo menos 03 caracteres.'
      })
    }
    if (!temSimbolos(nome)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você não pode inserir símbolos no nome!'
      })
    }
    if (nome.length <= 0 || nome === '') {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O nome/apelido não pode ficar vazio!'
      })
    }
    if (limite === 0 || limite === '') {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O limite do cartão deve ser maior que R$ 0,00'
      })
    }

    if (diaVencFatura === diaFechFatura) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O dia de fechamento da fatura não pode ser igual ao dia de vencimento.'
      })
    }

    try {
      setIsloading(true);
      await axios.post(`/cartoes/`, {
        nome,
        limite,
        limiteMaximo: limite,
        diaVencFatura: parseFloat(diaVencFatura),
        diaFechFatura: parseFloat(diaFechFatura),
        tipo: 'Crédito',
        user_id,
        conta_id
      })
      setIsloading(false);
      return Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'O cartão foi cadastrado com sucesso!',
      }).then((result) => {
        if(result.isConfirmed) {
          history.go('/')
        }
      })
    } catch (error) {
      setIsloading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.response.data.errors
      })
    }
  }

  return (
    <div className="pages_content " >
      <Loading isLoading={isLoading} />
      <div className="divCadastroCartao">
        <div className="box">
          <h1>Cadastro de cartões</h1>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="col">
                <div className="grid">
                  <div className="col">
                    <label className="label" htmlFor="name">
                      Como deseja chamar este cartão?
                      <p className="control has-icons-left">
                        <input type="text" className="input descricao" value={nome} onChange={(e) => setNome(e.target.value)} name="descricao" />
                        <span className="icon is-large is-left"><i className="bx bx-label" /></span>
                      </p>
                    </label>
                  </div>

                  <div className="col">
                    <label className="label" htmlFor="name">
                      Qual o limite do seu cartão?
                      <p className="control has-icons-left has-icons-right">
                        <NumericFormat
                          value={limite}
                          className="input valor"
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          maxLength={15}
                          onFocus={(e) => e.target.select()}
                          onValueChange={(e) => setLimite(e.floatValue)}
                          allowNegative={false}
                        // eslint-disable-next-line react/jsx-no-bind

                        />
                        <span className="icon is-large is-left">R$</span> </p>
                    </label>
                  </div>
                </div>

                <div className="grid">
                  <div className="col">
                    <label className="label">
                      Qual o dia de vencimento da fatura?
                      <br />
                      <span className="icon"><i className="bx bx-calendar" /></span><input type="number" className="input select" min={1} max={31} value={diaVencFatura} onChange={(e) => setDiaVencFatura(e.target.value)} />
                    </label>
                  </div>

                  <div className="col">
                    <label className="label">
                      Qual dia ocorre o fechamento da fatura?
                      <br />
                      <span className="icon"><i className="bx bx-calendar" /></span><input type="number" className="input select" min={1} max={31} value={diaFechFatura} onChange={(e) => setDiaFechFatura(e.target.value)} />
                    </label>
                  </div>

                  <div className="col">
                    <div className="notification is-info">
                      <i className="bx bx-info-circle" />
                      <br />
                      <div className="content is-small">
                        <p>Informe corretamente o dia de vencimento da fatura e o dia que ocorre o fechamento de sua fatura, para que assim possamos realizar os cálculos corretamente.</p>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <br />
            <div className="grid">
              <div className="col">
                <button type="submit" className="button is-success"><i className="bx bx-save" /> Cadastrar</button>
              </div>
              <div className="col">
                <button type="button" className="button is-danger" onClick={() => dispatch(actionsCartoes.novoCartaoFailure())}><i className="bx bx-x" />Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >
  )
}
