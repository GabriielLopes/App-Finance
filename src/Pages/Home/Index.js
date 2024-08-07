/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './style.css';
import axios from '../../services/axios';
import Loading from '../../components/Loading/index';
import Grafico from '../../components/Grafico';
import DespesasFixasHome from '../../components/despesasFixasHome';
import GraficoCategoriaDespesa from '../../components/GraficoCategoriaDespesa';
import GraficoCategoriaReceita from '../../components/GraficoCategoriaReceita';
import Footer from '../../components/Footer/index';
import AddContaBancaria from '../../components/addContaBancaria';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [saldo, setSaldo] = useState('');
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [transacoes, setTransacoes] = useState([]);
  const [totalDespesas, setTotalDespesas] = useState(0)
  const [verGrafReceita, setVerGrafReceita] = useState('')
  const [verGrafDespesa, setVerGrafDespesa] = useState('');
  const [verBalanMensal, setVerBalanMensal] = useState('');
  const [verTotalDespesas, setVerTotalDespesas] = useState('');
  const [verTotalReceitas, setVerTotalRecetas] = useState('');
  const [verSaldo, setVerSaldo] = useState('');
  const [conta, setConta] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [mes, setMes] = useState(new Date().getUTCMonth() + 1);

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  })

  const ano = new Date().getFullYear()

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

  function setMesAnterior() {
    if (mes <= 1) return
    setMes(mes - 1)
  }

  function setMesAcima() {
    if (mes >= 12) return
    setMes(mes + 1);
  }

  // Dados de conta bancária
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/contas/index/${user.id}`);
        setConta(response.data);
        setSaldo(response.data[0].saldo)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setConta([]);
        setSaldo(0);
      }
    }
    getData()
  }, [user])

  // Dados de transações
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`transacoes/all/${conta[0].id}`)
        setTransacoes(response.data);
        setTotalReceitas(response.data.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getUTCMonth() + 1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
        setTotalDespesas(response.data.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setTransacoes([])
        setTotalReceitas(0);
      }
    }
    getData();
  }, [conta, mes])

  // Dados de configurações de aplicativo
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`user-config/${user.id}`);
        setVerGrafReceita(response.data[0].verGrafReceita);
        setVerGrafDespesa(response.data[0].verGrafDespesa);
        setVerBalanMensal(response.data[0].verBalanMensal);
        setVerTotalDespesas(response.data[0].verTotalDespesas);
        setVerTotalRecetas(response.data[0].verTotalReceitas);
        setVerSaldo(response.data[0].verSaldo);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setVerGrafReceita('');
        setVerGrafDespesa('');
        setVerBalanMensal('');
        setVerTotalDespesas('');
        setVerTotalRecetas('');
        setVerSaldo('');
      }
    }
    getData()
  }, [user])

  // Dados de categorias
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/categorias/`);
        setCategorias(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setCategorias([]);
      }
    }
    getData();
  }, [])

  if (isLoading) {
    return <Loading isLoading={isLoading} />
  }

  if (conta.length <= 0 || conta === "") {
    return <AddContaBancaria />
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <div className="pages_content">
        <h1 className='title'>DASHBOARD <i className='bx bxs-pie-chart-alt-2' /></h1>
        <div className='grid'>
          <div className='col'>
            <center>
              <button type='button' className='button btnMudarMes' onClick={setMesAnterior}><i className='bx bx-left-arrow-alt' /></button>
              <label className='tag is-large is-info'><i className="bx bx-calendar" /> {mesAtual()}</label>
              <button type='button' className='button btnMudarMes' onClick={setMesAcima}><i className='bx bx-right-arrow-alt' /></button>
            </center>
          </div>
        </div>
        <div className='grid'>

          <div className='col'>
            {verSaldo ? (
              <a href="/extratos/">
                <div className='box info-home info-saldo'>
                  <p className='p'>Saldo: <br />
                    <p className='label'>
                      {formatarValor.format(saldo)}
                    </p>
                  </p>
                  <i className='bx bxs-bank' />
                  <div className='detalhes'>
                    <div className='box'>
                      {transacoes.filter((transacao) => new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data).getUTCFullYear() === ano).length > 0 ? (
                        <table className='table is-hoverable is-fullwidth'>
                          <thead>
                            <tr>
                              <td>Descricao:</td>
                              <td>Data:</td>
                              <td>Valor:</td>
                              <td />
                            </tr>
                          </thead>
                          <tbody>
                            {transacoes.slice(0, 2).filter((transacao) => new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data).getUTCFullYear() === ano).map((transacao) => (
                              <tr>
                                <td>{transacao.descricao}</td>
                                <td>{formatarData.format(new Date(`${new Date(transacao.data).getFullYear()}-${new Date(transacao.data).getUTCMonth() + 1}-${new Date(transacao.data).getUTCDate()}`))}</td>
                                <td>{formatarValor.format(transacao.valor)}</td>
                                <td>{transacao.tipo === 'Receita' ? (<i className='bx bxs-up-arrow' />) : (<i className='bx bxs-down-arrow' />)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        "Não há movimentações no mês para exibir"
                      )}
                    </div>
                  </div>
                </div>
              </a>

            ) : ""}
          </div>


          <div className='col'>
            {verTotalReceitas ? (
              <a href="/extratos/">
                <div className='box info-home info-receitas'>
                  <p className='p'>Receitas: <br />
                    <p className='label'>
                      {formatarValor.format(totalReceitas)}
                    </p>
                  </p>
                  <i className='bx bxs-up-arrow-circle' />
                  <div className='detalhes'>
                    <div className='box'>
                      {transacoes.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data).getUTCFullYear() === ano).length > 0 ? (
                        <table className='table is-hoverable is-fullwidth'>
                          <thead>
                            <tr>
                              <td>Descricao:</td>
                              <td>Data:</td>
                              <td>Valor:</td>
                              <td />
                            </tr>
                          </thead>
                          <tbody>
                            {transacoes.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getUTCFullYear() === ano).slice(0, 2).map((transacao) => (
                              <tr>
                                <td>{transacao.descricao}</td>
                                <td>{formatarData.format(new Date(`${new Date(transacao.data).getFullYear()}-${new Date(transacao.data).getUTCMonth() + 1}-${new Date(transacao.data).getUTCDate()}`))}</td>
                                <td>{formatarValor.format(transacao.valor)}</td>
                                <td>{transacao.tipo === 'Receita' ? (<i className='bx bxs-up-arrow' />) : (<i className='bx bxs-down-arrow' />)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                      ) : (
                        "Ainda não há receitas nesse mês"
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ) : ""}
          </div>

          <div className='col'>
            {verTotalDespesas ? (
              <a href="/extratos/">
                <div className='box info-home info-despesas'>
                  <p className='p'>Despesas: <br />
                    <p className='label'>
                      {formatarValor.format(totalDespesas)}
                    </p>
                  </p>
                  <i className='bx bxs-down-arrow-circle' />
                  <div className='detalhes'>
                    <div className='box'>
                      {transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data).getUTCFullYear() === ano).length > 0 ? (
                        <table className='table is-hoverable is-fullwidth'>
                          <thead>
                            <tr>
                              <td>Descricao:</td>
                              <td>Data:</td>
                              <td>Valor:</td>
                              <td />
                            </tr>
                          </thead>
                          <tbody>
                            {transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getUTCFullYear() === ano).slice(0, 2).map((transacao) => (
                              <tr>
                                <td>{transacao.descricao}</td>
                                <td>{formatarData.format(new Date(`${new Date(transacao.data).getFullYear()}-${new Date(transacao.data).getUTCMonth() + 1}-${new Date(transacao.data).getUTCDate()}`))}</td>
                                <td>{formatarValor.format(transacao.valor)}</td>
                                <td>{transacao.tipo === 'Receita' ? (<i className='bx bxs-up-arrow' />) : (<i className='bx bxs-down-arrow' />)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        "Ainda não há despesas nesse mês"
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ) : ""}
          </div>
        </div>

        <div className="grid">
          <div className="col">
            {verGrafDespesa ? (
              <div className='box'>
                DESPESAS POR CATEGORIA
                <GraficoCategoriaDespesa mes={mes} transacoes={transacoes} categorias={categorias} />
              </div>
            ) : ""}
          </div>
          <div className='col'>
            {verGrafReceita ? (
              <div className='box'>
                <GraficoCategoriaReceita mes={mes} transacoes={transacoes} categorias={categorias} />
              </div>
            ) : ("")}
          </div>

        </div>

        <div className="grid">
          <div className="col">
            {verBalanMensal ? (
              <Grafico transacoes={transacoes} mes={mes} />
            ) : ""}
          </div>

          <div className='col'>
            <DespesasFixasHome />
          </div>
        </div>
        <Footer />
      </div >


    </>
  );
}
