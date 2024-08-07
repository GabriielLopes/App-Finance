/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

import axios from "../../services/axios";
import history from '../../services/history';
import './style.css';
import DespesasFixasConfig from "../despesasFixasConfig";
import * as actions from '../../store/modules/despesa/actions';
import PagarDespesasFixas from "../pagarDespesasFixas";

export default function DespesasFixasHome() {
  const dispatch = useDispatch();
  const [despesas, setDespesas] = useState([]);
  const [dropdownStates, setDropdownStates] = useState([]);
  const [conta, setConta] = useState([])
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mes = new Date().getUTCMonth() + 1;
  const user = useSelector((state) => state.auth.user);

  // pegando informações de conta bancária
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await axios.get(`/contas/index/${user.id}`);
        setConta(response.data);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        setConta([]);
      }
    }
    getData()
  }, [])

  // pegar dados de despesas fixas
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/gastos-fixos/${conta[0].id}/${user.id}`)
        setDespesas(response.data.filter(despesa => new Date(despesa.data_venc).getUTCMonth() + 1 === new Date().getUTCMonth() + 1 && new Date(despesa.data_venc).getUTCFullYear() === new Date().getUTCFullYear()));
        setDropdownStates(response.data.filter((despesa) => despesa.qtde_parcelas_pagas < despesa.qtde_parcelas).map(() => false))
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setDespesas([]);
        setDropdownStates([])
      }
    }
    getData();
  }, [conta])

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await axios.get('/categorias/');
        setCategorias(response.data);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false);
        setCategorias([]);
      }
    }
    getData();
  }, [])

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


  if (isLoading === true) {
    return (
      <div className="box box-despesas">
        <div className="grid">
          <div className="col" />
          <div className="col">
            <ClipLoader color="#0077b6" size={30} />
          </div>
        </div>
      </div>
    )
  }

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  })


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
      <PagarDespesasFixas />
      <h1 className="title">Despesas de {mesAtual()}</h1>
      <div className="grid">
        <div className="col">
          <button type="button" className="button" onClick={() => dispatch(actions.novaDespesaRequest())}>
            <i className='bx bxs-file-plus' /> Adicionar
          </button>
        </div>

        <div className="col">
          <p className="tag is-large is-danger">Total: {formatarValor.format(despesas.map((despesa) => parseFloat(despesa.valor_parcela)).reduce((valores, acumulador) => acumulador += valores, 0))}</p>
        </div>
      </div>

      <div className="grid">
        <div className="col">
          <table className="table is-hoverable is-fullwidth is-striped">
            {despesas.length <= 0 ? (
              "Não há despesas vencendo no mês."
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
                  {despesas.slice(0, 3).map((despesa, index) => (
                    <tr>
                      <td>{formatarValor.format(despesa.valor_parcela)}</td>
                      <td> <i className={categorias.filter(categoria => categoria.id === despesa.categoria_id)[0].icone} /> {despesa.nome}</td>
                      <th>{despesa.qtde_parcelas_pagas} / {despesa.qtde_parcelas}</th>
                      <th>{formatarData.format(new Date(`${new Date(despesa.data_venc).getFullYear()}-${new Date(despesa.data_venc).getMonth() + 1}-${new Date(despesa.data_venc).getDate() + 1}`))}</th>
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
                                onKeyDown={() => dispatch(actions.pagarDespesaRequest({ despesa }))}
                                onClick={() => dispatch(actions.pagarDespesaRequest({ despesa }))}>
                                <i className='bx bx-check' />
                                Pagar
                              </a>
                            ) : ("")}

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
          <a href="/contas-a-pagar/">
            <span className='tag is-dark is-small is-hoverable' >Ver todas as despesas</span>
          </a>
        </div>
        <div className="col" />
      </div>
    </div>
  )
}

