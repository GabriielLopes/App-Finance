/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-google-charts";

import './style.css';
import axios from '../../services/axios';
import Loading from "../../components/Loading";

export default function Extratos() {
  const user = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [conta, setConta] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mes, setMes] = useState(new Date().getUTCMonth() + 1);
  const [dadosGraf, setDadosGraf] = useState([])
  const ano = new Date().getUTCFullYear();

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  })

  function mesAtual() {
    switch (mes) {
      case 1: {
        return "Janeiro"
      }

      case 2: {
        return "Feveiro"
      }

      case 3: {
        return "Março"
      }

      case 4: {
        return "Abril"
      }

      case 5: {
        return "Maio"
      }

      case 6: {
        return "Junho"
      }

      case 7: {
        return "Julho"
      }

      case 8: {
        return "Agosto"
      }

      case 9: {
        return "Setembro"
      }

      case 10: {
        return "Outubro"
      }

      case 11: {
        return "Novembro"
      }

      case 12: {
        return "Dezembro"
      }

      default: {
        return mes
      }
    }
  }

  // pegar dados de categorias
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await axios.get('/categorias/');
        setCategorias(response.data);
        setIsLoading(false)
      } catch (error) {
        setCategorias([]);
      }
    }
    getData()
  }, [])

  // pegar dados de conta bancária
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
    getData()
  }, [])

  // pegar dados de transacoes
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await axios.get(`/transacoes/all/${conta.id}`);
        setTransacoes(response.data.filter(transacao => new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data).getUTCFullYear() === ano));
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setTransacoes([]);
      }
    }
    getData();
  }, [conta, mes])

  // inserir dados no gráfico
  useEffect(() => {
    async function inserirDadosGraf() {
      setDadosGraf([
        ["Receita", "Valores em reais"],
        [`Receita`, parseFloat(transacoes.filter((transacao) => transacao.tipo === 'Receita').map((transacao) => parseFloat(transacao.valor)).reduce((valores, acumulador) => acumulador += valores, 0))],
        ['Despesa', parseFloat(transacoes.filter((transacao) => transacao.tipo === 'Despesa').map((transacao) => parseFloat(transacao.valor)).reduce((valores, acumulador) => acumulador += valores, 0))]
      ])
    }
    inserirDadosGraf()
  }, [conta, mes, transacoes])

  function setMesAnterior() {
    if (mes <= 1) return
    setMes(mes - 1)
  }

  function setMesAcima() {
    if (mes >= 12) return
    setMes(mes + 1);
  }

  const options = {
    legend: 'none',
    text: 'none',
    colors: ['blue', 'red'],
    backgroundColor: 'transparent',
    pieHole: 0.658,
    pieStartAngle: 180
  }


  return (
    <div className="pages_content page_extrato">
      {isLoading ? (
        <Loading isLoading={isLoading} />
      ) : (
        <>
          <h1 className="title">Extratos de transferências bancárias</h1>
          <hr />

          <br />
          <div className="grid">
            <div className="col div_pesquisa">
              <p className="control has-icons-left">
                <input type="text" className="input descricao" placeholder="Filtre por: Descrição, categoria ou tipo" />
                <span className="icon is-large is-left"><i className="bx bx-filter" /></span>
              </p>
              <button type="button" className="button"><i className="bx bx-search-alt" /></button>
            </div>

          </div>

          <div className="columns">
            <div className="column is-three-fifths">
              <div className="box">
                <center>
                  <button type="button" className="button btnMudarMes" onClick={setMesAnterior}><i className="bx bx-arrow-back" /></button>
                  <p className="tag is-large is-info">
                    <i className="bx bx-calendar" /> {mesAtual()}
                  </p>
                  <button type="button" className="button btnMudarMes" onClick={setMesAcima}><i className="bx bx-right-arrow-alt" /></button>
                </center>

                <table className="table is-hoverable is-fullwidth">
                  <thead>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Opções</th>
                  </thead>

                  <tbody>
                    {transacoes.map((transacao) => (
                      <tr>
                        <td>{transacao.tipo === "Receita" ? (
                          <i className='bx bxs-up-arrow' />
                        ) : <i className='bx bxs-down-arrow' />}</td>
                        <td>{transacao.descricao}</td>
                        <td>{categorias.length > 0 ? (
                          <i className={categorias.filter(categoria => categoria.id === parseFloat(transacao.categoria_id))[0].icone} />
                        ) : ""}
                          {categorias.filter(categoria => categoria.id === parseFloat(transacao.categoria_id))[0].nome}
                        </td>
                        <td><strong>{formatarValor.format(transacao.valor)}</strong></td>
                        <td>{formatarData.format(new Date(transacao.data))}</td>
                        <td>
                          <button type="button" className="button"><i className="bx bxs-pencil" /></button>
                          <button type="button" className="button"><i className="bx bxs-trash" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col is-two-fifths">
              <div className="box">
                <div className="grid">
                  <div className="col">
                    <center>{mesAtual()}</center>
                    <Chart
                      chartType="PieChart"
                      options={options}
                      data={dadosGraf}
                      width={350}
                      height={180}
                    />
                  </div>
                </div>

              </div>
              <div className="grid">
                <div className="col">
                  <div className="box div-balanco">
                    <p>
                      Balanço do mês de <strong>{mesAtual()}</strong>
                    </p>
                    <br />
                    <p>
                      Receitas: <strong>{formatarValor.format(parseFloat(transacoes.filter((transacao) => transacao.tipo === 'Receita').map((transacao) => parseFloat(transacao.valor)).reduce((valores, acumulador) => acumulador += valores, 0)))}</strong>
                      <br />
                      - Despesas: <strong>{formatarValor.format(parseFloat(transacoes.filter((transacao) => transacao.tipo === 'Despesa').map((transacao) => parseFloat(transacao.valor)).reduce((valores, acumulador) => acumulador += valores, 0)))}</strong>
                      <hr />
                      Saldo do mês: <strong>{formatarValor.format(parseFloat(transacoes.filter((transacao) => transacao.tipo === 'Receita').map((transacao) => parseFloat(transacao.valor)).reduce((valores, acumulador) => acumulador += valores, 0)) - parseFloat(transacoes.filter((transacao) => transacao.tipo === 'Despesa').map((transacao) => parseFloat(transacao.valor)).reduce((valores, acumulador) => acumulador += valores, 0)))}</strong>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </>
      )}
    </div>
  )
}
