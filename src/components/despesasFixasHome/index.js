/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import axios from "../../services/axios";
import history from '../../services/history';
import './style.css';
import DespesasFixasConfig from "../despesasFixasConfig";
import * as actions from '../../store/modules/despesa/actions';

export default function DespesasFixasHome() {
  const dispatch = useDispatch();

  const [despesas, setDespesas] = useState([]);
  const [despesasPagas, setDespesasPagas] = useState([]);
  const [despesasPendentes, setDespesasPendentes] = useState([])
  const [listDespesas, setListDespesas] = useState([]);
  const [verTodasDespesas, setVerTodasDespesas] = useState(0)
  const [dropdownStates, setDropdownStates] = useState([]);
  const [conta, setConta] = useState([])
  const user = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth);

  const ano = new Date().getFullYear();


  useEffect(() => {
    async function getData() {
      const responseConta = await axios.get(`/contas/index/${user.id}`)
      if (responseConta.data.length > 0) {
        setConta(responseConta.data);
        const responseDespesas = await axios.get(`/gastos-fixos/${responseConta.data[0].id}/${user.id}`)
        setDespesas(responseDespesas.data);
        setDespesasPagas(responseDespesas.data.filter((despesa) => despesa.qtde_parcelas === despesa.qtde_parcelas_pagas))
        setDespesasPendentes(responseDespesas.data.filter((despesa) => despesa.qtde_parcelas_pagas < despesa.qtde_parcelas))

        setListDespesas(responseDespesas.data.filter((despesa) => despesa.qtde_parcelas_pagas < despesa.qtde_parcelas))
        setDropdownStates(responseDespesas.data.filter((despesa) => despesa.qtde_parcelas_pagas < despesa.qtde_parcelas).map(() => false))
      }
    }
    getData()
  }, [])

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  })


  function handleChange(e) {
    if (e.target.value === 'Todas') {
      setListDespesas(despesas);
    } else if (e.target.value === 'Pagas') {
      setListDespesas(despesasPagas)
    } else if (e.target.value === 'Pendentes') {
      setListDespesas(despesasPendentes)
    }
  }


  function handleChangeDropDown(index) {

    const newDropDownStates = [...dropdownStates];
    newDropDownStates[index] = !dropdownStates[index];
    setDropdownStates(newDropDownStates);

    if (!dropdownStates[index]) {
      const dropdown = document.getElementById(index)
      if (dropdown) {
        dropdown.classList = 'dropdown is-right is-active'
      }
    } else {
      const dropdown = document.getElementById(index)
      if (dropdown) {
        dropdown.classList = 'dropdown'
      }
    }
  }


  async function pagar(id, qtde_parcelas_pagas, data, tipo, descricao, conta_id, valor, categoria_id) {
    try {
      axios.defaults.headers.post.Authorization = `Bearer ${auth.token}`;
      axios.defaults.headers.put.Authorization = `Bearer ${auth.token}`;
      await axios.put(`/gastos-fixos/${id}`, { qtde_parcelas_pagas })
      await axios.post('/transacoes/', {
        data,
        tipo,
        descricao,
        user_id: parseFloat(user.id),
        conta_id: parseFloat(conta_id),
        valor,
        categoria_id,
      })
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'A despesa foi paga com sucesso!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/')
        }
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: error
      })
    }
  }

  function handlePagar(index, id, qtde_parcelas_atuais, valor_parcela, nome, categoria_id) {
    handleChangeDropDown(index)

    Swal.fire({
      title: 'Efetuar pagamento',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonColor: 'green',
      text: 'Quantas parcelas será paga?',
      input: 'number',
    }).then((result) => {

      if (result.isConfirmed) {
        const tipo = 'Despesa';
        const descricao = `${nome} - ${result.value} parcelas`;
        const conta_id = conta[0].id;
        const valor = Number(valor_parcela) * Number(result.value);
        const qtde_parcelas_pagas = qtde_parcelas_atuais + Number(result.value);

        pagar(id, qtde_parcelas_pagas, `2024-06-06`, tipo, descricao, conta_id, valor, categoria_id)

      }
    })
  }

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
  function handleDelete(id, index) {
    handleChangeDropDown(index)
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

  if (conta.length === 0) {
    return (<></>)
  }

  return (
    <div className="box box-despesas">
      <DespesasFixasConfig />
      <h1 className="">Contas a pagar</h1>
      <div className="grid">
        <div className="col">
          <label className="label" htmlFor="filtro">
            <div className="select">
              <select className="select input" onChange={handleChange}>
                <option value="Pendentes">Pendentes</option>
                <option value="Pagas">Pagas</option>
                <option value="Todas">Todas</option>
              </select>
            </div>
          </label>
          <button type="button" className="button" onClick={() => dispatch(actions.novaDespesaRequest())}>
            <i className='bx bxs-file-plus' /> Adicionar
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="col">
          <table className="table is-hoverable is-fullwidth is-striped">
            {listDespesas.length <= 0 ? (
              "Não há nada para exibir."
            ) : (
              <>
                <thead>
                  <tr>
                    <th>Valor</th>
                    <th>Nome</th>
                    <th>Parcelas</th>
                    <th>Data de vencimento</th>
                    <th>Opções</th>
                  </tr>
                </thead>
                <tbody>
                  {listDespesas.slice(0, verTodasDespesas + 3).map((despesa, index) => (
                    <tr>
                      <td>{formatarValor.format(despesa.valor_parcela)}</td>
                      <td>{despesa.nome}</td>
                      <th>{despesa.qtde_parcelas_pagas} / {despesa.qtde_parcelas}</th>
                      <th>{formatarData.format(new Date(`${ano}-${new Date(despesa.data_compra).getMonth() + 3 + despesa.qtde_parcelas_pagas}-${despesa.data_venc}`))
                      }</th>
                      <th><div className="dropdown is-up" id={index}>
                        <div className="dropdown-trigger">
                          <button className="button" onClick={() => handleChangeDropDown(index)} aria-haspopup="true" aria-controls={`dropdown-menu${index}`}>
                            <span>...</span>
                            <span className="icon is-small">
                              <i className="bx bx-chevron-down" aria-hidden="true" />
                            </span>
                          </button>
                        </div>
                        <div className="dropdown-menu" role="menu">
                          <div className="dropdown-content">
                            {despesa.qtde_parcelas_pagas < despesa.qtde_parcelas ? (
                              <a href="#" className="dropdown-item" role="button" tabIndex={0}
                                onKeyDown={() => handlePagar(index, despesa.id, despesa.qtde_parcelas_pagas, Number(despesa.valor_parcela), despesa.nome, despesa.categoria_id)}
                                onClick={() => handlePagar(index, despesa.id, despesa.qtde_parcelas_pagas, Number(despesa.valor_parcela), despesa.nome, despesa.categoria_id)}>
                                <i className='bx bx-check' />
                                Pagar
                              </a>
                            ) : ("")}

                            <a href="#" className="dropdown-item"><i className='bx bx-pencil' /> Editar</a>
                            <hr className="dropdown-divider" />
                            <a href="#" className="dropdown-item" role="button" tabIndex={0}
                              onKeyDown={() => handleDelete(despesa.id, index)} onClick={() => handleDelete(despesa.id, index)}>
                              <i className='bx bxs-trash' />
                              Excluir
                            </a>
                          </div>
                        </div>
                      </div></th>
                    </tr>
                  ))}
                </tbody>

              </>

            )}
          </table>
        </div>
      </div>
      <div className="grid">
        <div className="col" />
        <div className="col info_vermais">
          {verTodasDespesas < listDespesas.length ? (
            <span className='tag is-dark is-small is-hoverable' tabIndex={0} role='button' onKeyDown={() => setVerTodasDespesas(verTodasDespesas + 5)} onClick={() => setVerTodasDespesas(verTodasDespesas + 5)} >Ver mais...</span>
          ) : ("")}
          {verTodasDespesas > 3 ? (
            <span className='tag is-dark is-small is-hoverable' tabIndex={0} role='button' onKeyDown={() => setVerTodasDespesas(0)} onClick={() => setVerTodasDespesas(0)}>Ver menos...</span>
          ) : (
            ""
          )}
        </div>

        <div className="col" />

      </div>

    </div>
  )
}

