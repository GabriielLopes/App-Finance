/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import ClipLoader from 'react-spinners/ClipLoader';

import './style.css';
import * as actionsPlanejamento from '../../store/modules/planejamentosMensais/actions';
import AddPlanejamentoMensal from "../addPlanejamentoMensal";
import axios from "../../services/axios";
import history from '../../services/history';


export default function PlanejamentoMensal() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  // eslint-disable-next-line no-unused-vars
  const [planejamentoMensal, setPlanejamentoMensal] = useState([]);
  const [planejemanetoMensalCategorias, setPlanejamentoMensalCategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minPagina, setMinPagina] = useState(0);
  const [maxPagina, setMaxPagina] = useState(3);
  const [qtdePagina, setQtdePagina] = useState(0)
  const [paginaAtual, setPaginaAtual] = useState(1);

  const mes = new Date().getMonth() + 1
  const ano = new Date().getFullYear()

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await axios.get('/categorias/');
        setCategorias(response.data);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setCategorias([]);
      }
    }
    getData();
  }, [])

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await axios.get(`/planejamento-mensal/${user.id}`)
        setPlanejamentoMensal(response.data.planejamentoMensal[0])

        const responsePlanejamentoCategorias = await axios.get(`/planejamento-mensal-categorias/${response.data.planejamentoMensal[0].id}`)
        setPlanejamentoMensalCategorias(responsePlanejamentoCategorias.data)
        setQtdePagina(Math.ceil(responsePlanejamentoCategorias.data.length / 3))
        setIsLoading(false)

      } catch (error) {
        (
          <div className="erro">
            {error.response.data.errors}
          </div>
        )
      }
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const responseConta = await axios.get(`/contas/index/${user.id}`);

        const response = await axios.get(`/transacoes/all/${responseConta.data[0].id}`)
        setTransacoes(response.data)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setTransacoes([]);
      }
    }
    getData();
  }, [])

  async function handleDeleteCategorias(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Tem certeza?',
      text: 'Você não poderá voltar atrás!',
      showCancelButton: true,
      showConfirmButton: 'true',
    }).then((result) => {
      if (result.isConfirmed) {
        // eslint-disable-next-line no-inner-declarations
        async function deletar() {
          try {
            setIsLoading(true);
            await axios.delete(`planejamento-mensal-categorias/${id}`)
            setIsLoading(false);
            history.go('/');
          } catch (error) {
            setIsLoading(false);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: error.response.data.errors
            })
          }
        }
        deletar();
      }
    })
  }

  function handleProximaPagina() {
    if (maxPagina >= planejemanetoMensalCategorias.length) return
    setMinPagina(minPagina + 3);
    setMaxPagina(maxPagina + 3);
    setPaginaAtual(paginaAtual + 1);
  }

  function handlePaginaAnterior() {
    if (minPagina <= planejemanetoMensalCategorias.length - planejemanetoMensalCategorias.length) return
    setMinPagina(minPagina - 3);
    setMaxPagina(maxPagina - 3);
    setPaginaAtual(paginaAtual - 1);
  }

  if (isLoading) {
    return (
      <div className="box">
        <center><ClipLoader color="#0077b6" size={70} /></center>
      </div>
    )
  }


  return (
    <div className="box box-planejamentoMensal">
      <AddPlanejamentoMensal />
      <h1>Planejamento mensal <i className='bx bx-directions' /></h1>
      <hr />

      {planejamentoMensal.id > 0 ? (
        <>
      <div className="grid">

        <div className="col">
          <div className="notification">
            <label className="label">
              <i className='bx bx-dollar-circle' />
              Seu orçamento mensal é de:
              <br />
              <strong className="infoEconomizar planejamentoMensal">{formatarValor.format(planejamentoMensal.valor_maximo)}</strong>
            </label>
          </div>

        </div>

        <div className="col">
          <div className="notification">
            <label className="label">
              <i className='bx bx-coin-stack' />
              Você guardou:
              <br />
              <strong className="infoEconomizar planejamentoMensal">{formatarValor.format((planejamentoMensal.porcentagem_economizar / 100) * planejamentoMensal.salario)}</strong>
            </label>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="col">
          <div className="notification">
            <label className="label">
              <i className='bx bx-info-circle' />
              Ainda restam:
              <p className="infoValorSemCategorizar">{formatarValor.format(parseFloat(planejamentoMensal.valor_maximo - transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0)))}</p>
            </label>
          </div>
        </div>

        <div className="col">
          <button type="button" className="button btnaddplanejamento" onClick={() => dispatch(actionsPlanejamento.novoPlanejamentoMensalRequest())}><i className='bx bx-pencil' /> Editar</button>
        </div>
      </div>

          <div className="grid">
            <div className="table tabelaPlanejamentos">

              <table className="table is-hoverable is-striped">
                <thead>
                  <th />
                  <th>Categoria</th>
                  <th>Meta</th>
                  <th>Gastos</th>
                  <th>Status</th>
                  <th>Ações</th>
                </thead>

                {planejemanetoMensalCategorias.slice(minPagina, maxPagina).map((planejamento) => (
                  <tbody>
                    {planejamento.categoria_id > 0 && categorias.length > 0 ? (
                      <tr>
                        <td className="icon-planejamento"><i className={categorias.filter(categoria => categoria.id === planejamento.categoria_id)[0].icone} /></td>
                        <td>{categorias.filter(categoria => categoria.id === planejamento.categoria_id)[0].nome}</td>
                        <td><strong>{formatarValor.format(parseFloat(planejamento.valor_maximo))}</strong></td>
                        <td>{formatarValor.format(transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes).filter((transacao) => transacao.categoria_id === planejamento.categoria_id).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))}</td>
                        <td> <p>
                          Restam <strong>{formatarValor.format(transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes).filter((transacao) => transacao.categoria_id === planejamento.categoria_id).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))}</strong>
                          <progress value={(transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes).filter((transacao) => transacao.categoria_id === planejamento.categoria_id).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0)).toFixed(2)} max={parseFloat(planejamento.valor_maximo)} />
                          <br />
                          {(((transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getMonth() + 1 === mes).filter((transacao) => transacao.categoria_id === planejamento.categoria_id).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0)) / parseFloat(planejamento.valor_maximo)) * 100).toFixed(2)}%
                        </p></td>
                        <th>
                          <button type="button" className="button" onClick={() => handleDeleteCategorias(planejamento.id)}>
                            <i className='bx bxs-trash' />
                          </button>
                        </th>
                      </tr>
                    ) : (
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                    )}
                  </tbody>

                ))}
              </table>

              <div className="grid menu-tabela">
                <div className="col" />
                <div className="col" />
                <div className="col">
                  <button type="button" className="button" onClick={handlePaginaAnterior}><i className="bx bx-left-arrow-alt" /></button>
                  <label className="tag is-medium">pág {paginaAtual} de {qtdePagina}</label>
                  <button type="button" className="button" onClick={handleProximaPagina}><i className="bx bx-right-arrow-alt" /></button>

                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid">
            <div className="col">
              <button type="button" className="button btnaddplanejamento" onClick={() => dispatch(actionsPlanejamento.novoPlanejamentoMensalRequest())}><i className='bx bx-plus' /> Novo</button>
              <center><p>
                Ainda não há nenhum planejamento mensal para exibir! <i className="bx bx-confused" />
              </p> </center>
            </div>
          </div>
      )}


    </div>
  )
}
