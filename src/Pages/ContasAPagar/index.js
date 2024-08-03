/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';

import './style.css';
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import axios from "../../services/axios";
import Footer from "../../components/Footer";

export default function ContasAPagar() {
  const user = useSelector(state => state.auth.user);
  const [despesasFixas, setDespesasFixas] = useState([]);
  const [despesasFixasBase, setDespesasFixasBase] = useState([]);
  const [conta, setConta] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  })

  // Pegar dados da conta bancária
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/contas/index/${user.id}`);
        setConta(response.data[0]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setConta([]);
      }
    }
    getData();
  }, [])

  // pegar dados de despesas fixas
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/gastos-fixos/${conta.id}/${user.id}`);
        setDespesasFixas(response.data);
        setDespesasFixasBase(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setDespesasFixas([]);
      }
    }
    getData();
  }, [conta])

  // pegar dados de categoria
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/categorias/');
        setCategorias(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setCategorias([]);
      }
    }
    getData();
  }, [])

  console.log(despesasFixasBase)

  return (
    <div className="pages_content">
      <Loading isLoading={isLoading} />
      <h1 className="title">Contas a pagar</h1>
      <div className="box">

        <div className="grid">

          <div className="column is-9">
            <label className="label">
              Filtrar por nome:
              <p className="control has-icons-left">
                <input type="text" className="input descricao" />
                <span className="icon is-large is-left"><i className="bx bx-message-square" /></span>
              </p>
            </label>
          </div>

          <div className="col ">
            Filtrar por data:
            <label className="label">
              De:
              <br />
              <input type="date" className="input data" />
            </label>
            <label className="label">
              Até:
              <br />
              <input type="date" className="input data" />
            </label>
          </div>

          <div className="col">
            Filtrar por valores:
            <label className="label">
              De:
              <p className="control has-icons-left">
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
                <span className="icon is-large is-left"><i className="bx">R$</i></span>
              </p>
              <br />
              Até:
              <p className="control has-icons-left">
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
                <span className="icon is-large is-left"><i className="bx">R$</i></span>
              </p>
            </label>
          </div>
        </div>

        <div className="grid">
          <div className="col">
            <button type="button" className="button is-success"><i className='bx bx-search-alt'/> Buscar</button>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="grid">
          <div className="col">
            <table className="table is-striped is-fullwidth is-hoverable tabela-despesas">
              <thead>
                <tr>
                  <th />
                  <th>NOME</th>
                  <th>VALOR</th>
                  <th>PARCELAS</th>
                  <th>DATA DE VENCIMENTO</th>
                  <th>DATA DE COMPRA</th>
                  <th>REF CONTA BANCÁRIA</th>
                  <th>OPÇÕES</th>
                </tr>
              </thead>

              <tbody>
                {despesasFixas.map((despesa) => (
                  <tr>
                    <td><i className={categorias.filter((categoria) => categoria.id === despesa.categoria_id)[0].icone} /></td>
                    <th>{despesa.nome}</th>
                    <th>{formatarValor.format(despesa.valor)}</th>
                    <th>{despesa.qtde_parcelas_pagas} de {despesa.qtde_parcelas}</th>
                    <td>{formatarData.format(new Date(`${new Date(despesa.data_venc).getFullYear()}-${new Date(despesa.data_venc).getMonth() + 1}-${new Date(despesa.data_venc).getDate() + 1}`))}</td>
                    <td>{formatarData.format(new Date(despesa.data_compra))}</td>
                    <td>{conta.banco}</td>
                    <td>
                      <button type="button" className="button"><i className='bx bxs-pencil' /></button>
                      <br />
                      <button type="button" className="button"><i className='bx bxs-trash' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
