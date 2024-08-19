/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { NumericFormat } from 'react-number-format';

import './style.css';
import { useDispatch, useSelector } from "react-redux";
import * as actionsCartoes from '../../store/modules/cartoes/actions';

export default function CadastrarCartao() {
  const dispatch = useDispatch();
  const cadastrarCartao = useSelector((state) => state.cartoes.cadastrarCartao);

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
  return (
    <div className="pages_content " >
      <div className="divCadastroCartao">
        <div className="box">
          <h1>Cadastro de cartões</h1>
          <hr />
          <form>
            <div className="grid">
              <div className="col">
                <label className="label" htmlFor="name">
                  Nome do cartão:
                  <p className="control has-icons-left">
                    <input type="text" className="input descricao" name="descricao" />
                    <span className="icon is-large is-left"><i className="bx bx-label" /></span>
                  </p>
                </label>
              </div>

              <div className="col">
                <label className="label" htmlFor="name">
                  Limite máximo do cartão:
                  <p className="control has-icons-left has-icons-right">
                    <NumericFormat

                      className="input valor"
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      maxLength={15}
                      onFocus={(e) => e.target.select()}
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
                  <span className="icon"><i className="bx bx-calendar" /></span><input type="number" className="input select" min={1} max={31} />
                </label>
              </div>

              <div className="col">
                <label className="label">
                  Qual dia ocorre o fechamento da fatura?
                  <br />
                  <span className="icon"><i className="bx bx-calendar" /></span><input type="number" className="input select" min={1} max={31} />
                </label>
              </div>
            </div>
          </form>
          <br />
          <div className="grid">
            <div className="col">
              <button type="submit" className="button is-success"><i className="bx bx-save" /> Salvar</button>
            </div>
            <div className="col">
              <button type="button" className="button is-danger" onClick={() => dispatch(actionsCartoes.novoCartaoFailure())}><i className="bx bx-x" />Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
