/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import './style.css';
import axios from '../../services/axios';
import Footer from '../../components/Footer/index';
import CadastrarCartao from "../../components/cadastrarCartao";
import * as actionsCartoes from '../../store/modules/cartoes/actions';

export default function Cartoes() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [cartoes, setCartoes] = useState([]);

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  /* const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }) */

  // Pegar dados de cartões
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/cartoes/${user.id}`)
        setCartoes(response.data);
      } catch (error) {
        setCartoes([]);
      }
    }
    getData();
  }, [])


  return (
    <div className="pages_content page_cartoes">
      <CadastrarCartao />
      <h1 className="title">Cartões de crédito e débito</h1>

      <div className="grid">
        {cartoes.slice(0, 2).map((cartao) => (
          <>
            <div className="col">
              {cartao.tipo === 'Crédito' ? (
                <div className="box">

                  <div className="grid">
                    <div className="col">
                      <p className="tag is-large">
                        <i className="bx bx-credit-card" />
                        {cartao.nome}</p>
                      <br />
                    </div>
                    <div className="col" />
                    <div className="col">
                      <p className="tag is-large is-danger">Fatura aberta</p>
                    </div>
                  </div>

                  <div className="grid">
                    <div className="col">
                      <p>
                        R$ 0,00 de <strong>{formatarValor.format(parseFloat(cartao.limiteMaximo))}</strong>
                      </p>
                      <progress value={0} max={parseFloat(cartao.limiteMaximo)} />
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col">
                      <p>A fatura vence no dia <strong>{cartao.diaVencFatura}</strong> do mês</p>
                    </div>

                    <div className="col">
                      <p>A fatura fecha no dia <strong>{cartao.diaFechFatura}</strong> do mês</p>
                    </div>
                  </div>
                  <hr />
                  <div className="grid">
                    <div className="col divBotoes">
                      <button type="button" className="button">
                        <i className="bx bxs-pencil" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bxs-trash" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bx-detail" />
                      </button>
                    </div>
                  </div>

                </div>
              ) : ""}
            </div>
            {cartoes.length === 1 ? (
              <div className="col" />
            ) : ""}
          </>
        ))}
      </div>

      <div className="grid">
        {cartoes.slice(2, 4).map((cartao) => (
          <>
            <div className="col">
              {cartao.tipo === 'Crédito' ? (
                <div className="box">

                  <div className="grid">
                    <div className="col">
                      <p className="tag is-large">
                        <i className="bx bx-credit-card" />
                        {cartao.nome}</p>
                      <br />
                    </div>
                    <div className="col" />

                    <div className="col">
                      <p className="tag is-large is-danger">Fatura aberta</p>
                    </div>
                  </div>

                  <div className="grid">
                    <div className="col">
                      <p>
                        R$ 0,00 de <strong>{formatarValor.format(parseFloat(cartao.limiteMaximo))}</strong>
                      </p>
                      <progress value={0} max={parseFloat(cartao.limiteMaximo)} />
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col">
                      <p>A fatura vence no dia <strong>{cartao.diaVencFatura}</strong> do mês</p>
                    </div>

                    <div className="col">
                      <p>A fatura fecha no dia <strong>{cartao.diaFechFatura}</strong> do mês</p>
                    </div>
                  </div>
                  <hr />
                  <div className="grid">
                    <div className="col divBotoes">
                      <button type="button" className="button">
                        <i className="bx bxs-pencil" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bxs-trash" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bx-detail" />
                      </button>
                    </div>
                  </div>

                </div>
              ) : ""}
            </div>

            {cartoes.length === 3 ? (
              <div className="col" />
            ) : ""}
          </>
        ))}
      </div>

      <div className="grid">
        {cartoes.slice(4, 6).map((cartao) => (
          <>
            <div className="col">
              {cartao.tipo === 'Crédito' ? (
                <div className="box">

                  <div className="grid">
                    <div className="col">
                      <p className="tag is-large">
                        <i className="bx bx-credit-card" />
                        {cartao.nome}</p>
                      <br />
                    </div>
                    <div className="col" />

                    <div className="col">
                      <p className="tag is-large is-danger">Fatura aberta</p>
                    </div>
                  </div>

                  <div className="grid">
                    <div className="col">
                      <p>
                        R$ 0,00 de <strong>{formatarValor.format(parseFloat(cartao.limiteMaximo))}</strong>
                      </p>
                      <progress value={0} max={parseFloat(cartao.limiteMaximo)} />
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col">
                      <p>A fatura vence no dia <strong>{cartao.diaVencFatura}</strong> do mês</p>
                    </div>

                    <div className="col">
                      <p>A fatura fecha no dia <strong>{cartao.diaFechFatura}</strong> do mês</p>
                    </div>
                  </div>
                  <hr />
                  <div className="grid">
                    <div className="col divBotoes">
                      <button type="button" className="button">
                        <i className="bx bxs-pencil" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bxs-trash" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bx-detail" />
                      </button>
                    </div>
                  </div>

                </div>
              ) : ""}
            </div>
            {cartoes.length === 5 ? (
              <div className="col" />
            ) : ""}
          </>
        ))}
      </div>

      <div className="grid">
        {cartoes.slice(6, 8).map((cartao) => (
          <>
            <div className="col">
              {cartao.tipo === 'Crédito' ? (
                <div className="box">

                  <div className="grid">
                    <div className="col">
                      <p className="tag is-large">
                        <i className="bx bx-credit-card" />
                        {cartao.nome}</p>
                      <br />
                    </div>
                    <div className="col" />

                    <div className="col">
                      <p className="tag is-large is-danger">Fatura aberta</p>
                    </div>
                  </div>

                  <div className="grid">
                    <div className="col">
                      <p>
                        R$ 0,00 de <strong>{formatarValor.format(parseFloat(cartao.limiteMaximo))}</strong>
                      </p>
                      <progress value={0} max={parseFloat(cartao.limiteMaximo)} />
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col">
                      <p>A fatura vence no dia <strong>{cartao.diaVencFatura}</strong> do mês</p>
                    </div>

                    <div className="col">
                      <p>A fatura fecha no dia <strong>{cartao.diaFechFatura}</strong> do mês</p>
                    </div>
                  </div>
                  <hr />
                  <div className="grid">
                    <div className="col divBotoes">
                      <button type="button" className="button">
                        <i className="bx bxs-pencil" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bxs-trash" />
                      </button>

                      <button type="button" className="button">
                        <i className="bx bx-detail" />
                      </button>
                    </div>
                  </div>

                </div>
              ) : ""}
            </div>
            {cartoes.length === 7 ? (
              <div className="col" />
            ) : ""}
          </>
        ))}
      </div>

      <div className="grid">
        <div className="col">
          <div className="addCartao">
            <center>
              <button type="button" className="button" onClick={() => dispatch(actionsCartoes.novoCartaoRequest())}>
                <i className='bx bx-plus' /> <p>Cadastrar novo cartão</p>
              </button>
            </center>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  )
}
