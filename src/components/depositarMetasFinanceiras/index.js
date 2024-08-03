/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";

import Swal from "sweetalert2";

import './style.css';
import axios from '../../services/axios';
import history from '../../services/history'
import Loading from '../Loading/index';
import * as actionsMetas from '../../store/modules/editMetasFin/actions';

export default function DepositarMetasFinanceiras() {
  const dispatch = useDispatch();
  const novoDeposito = useSelector((state) => state.editMetasFin.novoDeposito);
  const metaFinanceira = useSelector((state) => state.editMetasFin.metaFinanceira);
  const [conta_id, setConta_id] = useState(0);
  const [conta, setConta] = useState([]);
  const user_id = useSelector((state) => state.auth.user.id);
  const [isLoading, setIsLoading] = useState(false);
  const [valor, setValor] = useState(0)
  const [data, setData] = useState('');
  const [descontarEmConta, setDescontarEmConta] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [outraData, setOutraData] = useState(false);

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const dia = new Date().getUTCDate()
  const mes = new Date().getUTCMonth() + 1;
  const diaFormato = dia.toString().padStart(2, '0');
  const mesFormatado = mes.toString().padStart(2, '0');
  const ano = new Date().getUTCFullYear();

  const dataAtual = `${ano}-${mesFormatado}-${diaFormato}`


  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/contas/index/${user_id}`)
        setConta_id(response.data[0].id);
        setConta(response.data[0]);
      } catch (error) {
        setIsLoading(false);
        setConta_id(0);
        setConta([]);
      }
    }
    getData();
  }, [])

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/categorias/');
        setCategorias(response.data)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setCategorias([]);
      }
    }
    getData()
  }, [])



  if (novoDeposito) {
    const divDepoMetas = document.querySelector('.depoMetasFinanceiras');
    if (divDepoMetas) {
      divDepoMetas.classList = 'depoMetasFinanceiras active'
    }
  } else {
    const divDepoMetas = document.querySelector('.depoMetasFinanceiras');
    if (divDepoMetas) {
      divDepoMetas.classList = 'depoMetasFinanceiras'
    }
  }

  function handleCancel() {
    setValor(0);
    setData('');
    setOutraData(false);
    setDescontarEmConta(false);
    dispatch(actionsMetas.depositarMetasFailure())
  }


  async function handleSubmit(e) {
    e.preventDefault();

    if (valor === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'O Valor de depósito não pode ser R$ 0,00!'
      })
    }

    if (valor + metaFinanceira.metaFinanceira.saldo_meta > metaFinanceira.metaFinanceira.valor_meta) {
      return Swal.fire({
        title: 'Erro',
        icon: 'error',
        text: `Só faltam ${formatarValor.format(metaFinanceira.metaFinanceira.valor_meta - metaFinanceira.metaFinanceira.saldo_meta)}. Você não pode depositar mais que isso!`
      })
    }

    if (data === '') {
      return Swal.fire({
        title: 'error',
        icon: 'error',
        text: 'Você precisa informar uma data!'
      })
    }
    try {
      setIsLoading(true);
      if (descontarEmConta) {
        if (parseFloat(conta.saldo) >= valor) {
          try {
            await axios.post('/transacoes/', {
              data,
              tipo: 'Despesa',
              descricao: `Deposito, objetivo: ${metaFinanceira.metaFinanceira.descricao}`,
              user_id,
              conta_id,
              valor,
              categoria_id: metaFinanceira.metaFinanceira.categoria_id
            })
          } catch (error) {
            return Swal.fire({
              title: 'Erro!',
              icon: 'error',
              text: error.response.data.errors
            })
          }
        } else {
          setIsLoading(false);
          return Swal.fire({
            title: 'Oops!',
            icon: 'warning',
            text: 'Você não tem saldo suficiente!'
          })
        }
        setIsLoading(false);
      }

      await axios.post('/depositar-metas-financeiras/', {
        valor,
        data,
        user_id,
        meta_id: metaFinanceira.metaFinanceira.id
      })

      return Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Depósito realizado com sucesso!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/');
          handleCancel();
        }
      })
    } catch (error) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'error!',
        text: error.response.data.errors
      })
    }
  }

  if (isLoading) {
    return <Loading isLoading={isLoading} />
  }

  if (metaFinanceira.metaFinanceira) {
    if (metaFinanceira.metaFinanceira.valor_meta === metaFinanceira.metaFinanceira.saldo_meta) {
      return (
        <div className="depoMetasFinanceiras">
          <div className="box conteudo-depo-metas">
            {metaFinanceira.metaFinanceira && categorias.length > 0 ? (

              <h1><p><strong>{metaFinanceira.metaFinanceira.descricao} <i className={categorias.filter(categoria => categoria.id === parseFloat(metaFinanceira.metaFinanceira.categoria_id))[0].icone} /></strong></p></h1>
            ) : ""}
            <hr />

            <div className="grid">
              <div className="col">
                <div className="box">
                  <p>Status do objetivo: <br /> <strong>{formatarValor.format(metaFinanceira.metaFinanceira.saldo_meta)} | {formatarValor.format(metaFinanceira.metaFinanceira.valor_meta)} </strong></p>
                  <progress value={metaFinanceira.metaFinanceira.saldo_meta} max={metaFinanceira.metaFinanceira.valor_meta} />
                  {((metaFinanceira.metaFinanceira.saldo_meta / metaFinanceira.metaFinanceira.valor_meta) * 100).toFixed(2)} %
                </div>
              </div>
            </div>

            <div className="grid">
              <div className="col">
                <div className="notification is-success">
                  <div className="content">
                    <p>
                      <strong>Parabéns!!</strong> O objetivo foi concluído com sucesso!!! <br />
                    </p>
                  </div>
                </div>

                <div className="notification is-info">
                  <div className="content">
                    <p>
                      <i className="bx bx-info-circle" />
                      Não é mais necessário realizar depósitos nesse objetivo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid">
              <div className="col">
                <button type="button" className="button" onClick={handleCancel}><i className='bx bx-left-arrow' /> Voltar</button>
              </div>
            </div>
          </div>
        </div>
      )
    }

  }

  return (
    <div className="depoMetasFinanceiras">
      <div className="box conteudo-depo-metas">
        <form onSubmit={handleSubmit}>
          {metaFinanceira.metaFinanceira && categorias.length > 0 ? (

            <h1>Realizar depósito em <p> <strong>{metaFinanceira.metaFinanceira.descricao} <i className={categorias.filter(categoria => categoria.id === parseFloat(metaFinanceira.metaFinanceira.categoria_id))[0].icone} /></strong></p></h1>
          ) : ""}
          <hr />
          {metaFinanceira.metaFinanceira ? (
            <div className="grid">
              <div className="col">
                <div className="box">
                  <p>Status do objetivo: <br /> <strong>{formatarValor.format(metaFinanceira.metaFinanceira.saldo_meta)} | {formatarValor.format(metaFinanceira.metaFinanceira.valor_meta)} </strong></p>
                  <progress value={metaFinanceira.metaFinanceira.saldo_meta} max={metaFinanceira.metaFinanceira.valor_meta} />
                  {((metaFinanceira.metaFinanceira.saldo_meta / metaFinanceira.metaFinanceira.valor_meta) * 100).toFixed(2)} %
                </div>
              </div>

              <div className="col">
                <div className="notification is-success">
                  <div className="content">
                    <p>
                      <i className='bx bx-info-circle' />
                      <strong>Vamos lá!!</strong>
                      <br />
                      Continue depositando e em breve terá seu objetivo concluído!!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : ""}
          <hr />
          <div className="grid">
            <div className="col">
              <label className="label" htmlFor="valor_guardar">
                Valor que deseja depositar:
                <p className="control has-icons-left">
                  <NumericFormat
                    className="input valor"
                    value={valor}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowLeadingZeros
                    decimalScale={2}
                    fixedDecimalScale={2}
                    allowNegative={false}
                    onFocus={(e) => e.target.select()}
                    onValueChange={(e) => setValor(e.floatValue)}
                  />
                  <span className="icon is-large is-left"><i className="bx">R$</i></span>
                </p>
              </label>

            </div>
            <div className="col">
              <div className="data">
                <i className="bx bx-calendar icone" />
                <button type="button" className={data === dataAtual ? "button is-active" : "button"} onClick={() => setData(dataAtual)}>Hoje</button> <button type="button" className={outraData ? "button is-active" : "button"} onClick={() => setOutraData(true)} >Outro...</button>
                <br />
                <center>
                  <input type="date" className="inputdate" value={data} hidden={!outraData} onChange={(e) => setData(e.target.value)} />
                </center>
                <br />
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="col">
              <label className="label">
                Deseja descontar o valor de depósito em conta? <br />
                <input type="radio" value={descontarEmConta} onChange={() => setDescontarEmConta(true)} checked={descontarEmConta === true} /> Sim | <input type="radio" value={descontarEmConta} onChange={() => setDescontarEmConta(false)} checked={descontarEmConta === false} /> Não
              </label>
            </div>

            <div className="col" />

          </div>
          <button type="submit" className="button is-success"><i className='bx bx-coin' /> Depositar</button> <button type="button" className="button is-danger" onClick={handleCancel}><i className='bx bx-x' /> Cancelar</button>
        </form>
      </div>
    </div>
  )
}
