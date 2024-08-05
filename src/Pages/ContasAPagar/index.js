/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
// import { NumericFormat } from 'react-number-format';

import './style.css';
import axios from "../../services/axios";
import history from "../../services/history";
import * as actions from '../../store/modules/despesa/actions';
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import PagarDespesasFixas from "../../components/pagarDespesasFixas";

export default function ContasAPagar() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [despesasFixas, setDespesasFixas] = useState([]);
  const [despesasFixasBase, setDespesasFixasBase] = useState([]);
  const [conta, setConta] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [minPagina, setMinPagina] = useState(0);
  const [maxPagina, setMaxPagina] = useState(10);
  const [qtdePagina, setQtdePagina] = useState(0)
  const [verPorPagina, setVerPorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroSelecionado, setFiltroSelecionado] = useState('');
  const [situacaoDespesa, setSituacaoDespesa] = useState("Todas");
  const [mes, setMes] = useState(new Date().getUTCMonth() + 1);
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
        setDespesasFixas(response.data.filter(despesa => new Date(despesa.data_venc).getUTCMonth() + 1 === mes));
        setDespesasFixasBase(response.data.filter(despesa => new Date(despesa.data_venc).getUTCMonth() + 1 === mes));
        setQtdePagina(Math.ceil(despesasFixas.length / verPorPagina))
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setDespesasFixas([]);
      }
    }
    getData();
  }, [conta, mes])

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

  async function deletar(id) {
    try {
      await axios.delete(`/gastos-fixos/${id}`)
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'A despesa foi excluída com sucesso!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/')
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: error,
      })
    }
  }

  function handleDelete(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Você tem certeza?!',
      text: 'Se excluir, as parcelas que foram pagas não serão reembolsadas ao saldo!',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar.',
      confirmButtonText: 'Sim, deletar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deletar(id)
      }
    })
  }

  function handleProximaPagina() {
    if (paginaAtual >= qtdePagina) return
    setMinPagina(minPagina + verPorPagina);
    setMaxPagina(maxPagina + verPorPagina);
    setPaginaAtual(paginaAtual + 1);
    setSituacaoDespesa("Todas");
  }

  function handlePaginaAnterior() {
    if (paginaAtual <= 1) return
    setMinPagina(minPagina - verPorPagina);
    setMaxPagina(maxPagina - verPorPagina);
    setPaginaAtual(paginaAtual - 1);
    setSituacaoDespesa("Todas");
  }

  function handleVerPorPagina(e) {
    setVerPorPagina(e.target.value);
    setMaxPagina(e.target.value);
    setSituacaoDespesa("Todas");
  }

  function handleMesAcima() {
    if (mes === 12) return
    setMes(mes + 1);
    setSituacaoDespesa("Todas")
  }

  function handleMesAnterior() {
    if (mes === 1) return
    setMes(mes - 1);
    setSituacaoDespesa("Todas")
  }

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

  function cancelarFiltro() {
    setDespesasFixas(despesasFixasBase);
    setMes(new Date().getUTCMonth() + 1)
    setFiltroSelecionado('');
  }

  function filtro(e) {
    e.preventDefault();
    function removerAcentos(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }
    const descricaoCorrigida = removerAcentos(descricao);
    const regex = new RegExp(`\\b${descricaoCorrigida}\\b`, "gi");
    if (descricao === '' || descricao.length <= 0) {
      setDespesasFixas(despesasFixasBase);
      setFiltroSelecionado('')
    } else {
      setFiltroSelecionado(e.target.descricao.value);
      const despesasFiltradas = despesasFixasBase.filter((despesa) => regex.test(removerAcentos(despesa.nome)))
      setDescricao('');
      setDespesasFixas(despesasFiltradas)

    }
  }

  useEffect(() => {
    function filtroPorSituacaoDespesa() {
      if (situacaoDespesa === "Pendentes") {
        setDespesasFixas(despesasFixasBase.filter(despesa => parseFloat(despesa.qtde_parcelas_pagas) < parseFloat(despesa.qtde_parcelas)));
        setFiltroSelecionado('')
        setFiltroSelecionado('');
      } else if (situacaoDespesa === "Pagas") {
        setDespesasFixas(despesasFixasBase.filter(despesa => parseFloat(despesa.qtde_parcelas_pagas) >= parseFloat(despesa.qtde_parcelas)))
      } else if (situacaoDespesa === "Todas") {
        setDespesasFixas(despesasFixasBase);
      }
    }
    filtroPorSituacaoDespesa()
  }, [situacaoDespesa])

  function handleFiltroSituacaoDespesaChange(e) {
    setSituacaoDespesa(e.target.value);
  }

  return (
    <div className="pages_content contas-a-pagar">
      <PagarDespesasFixas />
      <Loading isLoading={isLoading} />
      <h1 className="title">Contas a pagar</h1>
      <hr />
      <div className="box">

        <div className="grid">

          <div className="col">
            <form className="form-contas-a-pagar" onSubmit={filtro}>
              <label className="label">
                <p className="control has-icons-left">
                  <input type="text" className="input descricao" name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Filtre pelo nome" />
                  <span className="icon is-large is-left"><i className="bx bx-filter" /></span>
                </p>
              </label>
              <button type="submit" className="button"><i className='bx bx-search-alt' /></button>
            </form>
            <br />
            {filtroSelecionado.length > 0 ? (
              < p className="tag is-large is-info">{filtroSelecionado}<button type="button" className="delete is-small" onClick={cancelarFiltro} /> </p>
            ) : ""}
          </div>

          <div className="col">
            <center>
              <button type="button" className="button btnMudarMes" onClick={handleMesAnterior}><i className='bx bx-left-arrow-alt' /></button>
              <label className="tag is-large is-info">{mesAtual()}</label>
              <button type="button" className="button btnMudarMes" onClick={handleMesAcima}><i className='bx bx-right-arrow-alt' /></button>
            </center>
          </div>

          <div className="col">
            <p>Quantidade por página:
              <br />
              <div className="select">
                <select className="input" value={verPorPagina} onChange={handleVerPorPagina}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="col">
            <div className="select">
              <select className="input" value={situacaoDespesa} onChange={handleFiltroSituacaoDespesaChange}>
                <option value="Pendentes">Pendentes</option>
                <option value="Pagas">Pagas</option>
                <option value="Todas">Todas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="grid">
          <div className="col">
            {despesasFixas.length > 0 ? (
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
                  {despesasFixas.slice(minPagina, maxPagina).map((despesa) => (
                    <tr>
                      <td><i className={categorias.filter((categoria) => categoria.id === despesa.categoria_id)[0].icone} /></td>
                      <th>{despesa.nome}</th>
                      <th>{formatarValor.format(despesa.valor)}</th>
                      <th>{despesa.qtde_parcelas_pagas} de {despesa.qtde_parcelas}</th>
                      <td>{formatarData.format(new Date(`${new Date(despesa.data_venc).getFullYear()}-${new Date(despesa.data_venc).getMonth() + 1}-${new Date(despesa.data_venc).getDate() + 1}`))}</td>
                      <td>{formatarData.format(new Date(despesa.data_compra))}</td>
                      <td>{conta.banco}</td>
                      <td>
                        {despesa.qtde_parcelas_pagas < despesa.qtde_parcelas ? (
                          <>
                            <button type="button" className="button" onClick={() => dispatch(actions.pagarDespesaRequest({ despesa }))}><i className='bx bx-check' /></button>
                            <br />
                          </>
                        ) : ""}
                        <button type="button" className="button" onClick={() => handleDelete(despesa.id)}><i className='bx bxs-trash' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            ) : (
              <center><p>Não há despesas vencendo no mês de <strong>{mesAtual()}</strong></p></center>
            )}
          </div>
        </div>
        <div className="grid">
          <div className="col">
            {despesasFixas.length > 0 ? (
              <div className="botoes_mudar_pagina">
                <button type="button" className="button" onClick={handlePaginaAnterior}><i className='bx bx-left-arrow-alt' /></button>
                <p className="tag is-large">Página: {paginaAtual} de {Math.ceil(despesasFixas.length / verPorPagina)}</p>
                <button type="button" className="button" onClick={handleProximaPagina}><i className='bx bx-right-arrow-alt' /></button>
              </div>
            ) : ""}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
