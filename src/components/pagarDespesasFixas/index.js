/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import ClipLoader from 'react-spinners/ClipLoader';

import './style.css';
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import * as actionsDespesa from '../../store/modules/despesa/actions';
import axios from '../../services/axios';
import history from '../../services/history';

export default function PagarDespesasFixas() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const pagarDespesa = useSelector((state) => state.despesa.pagarDespesa)
  const despesa = useSelector((state) => state.despesa.despesa || []);
  const user = useSelector((state) => state.auth.user);
  const [conta, setConta] = useState([]);
  const [descontarEmConta, setDescontarEmConta] = useState(true);
  const [data, setData] = useState('');
  const [dia, setDia] = useState(0);
  const [ano, setAno] = useState(0);
  const [mesAtual, setMesAtual] = useState(0);
  const [mes, setMes] = useState(0);
  const [parcelas, setParcelas] = useState(0);
  const [valor, setValor] = useState(despesa.despesa ? despesa.despesa.valor_parcela * 1 : 0);
  const [qtde_parcelas_pagas, setQtde_parcelas_pagas] = useState(despesa.despesa && despesa.id > 0 ? despesa.despesa.qtde_parcelas_pagas + parcelas : 0);
  const [outraData, setOutraData] = useState(false);
  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const mesFormatado = month.toString().padStart(2, '0');

  const dataAtual = `${year}-${mesFormatado}-${day}`

  if (pagarDespesa && despesa.despesa) {
    const divPagarDespesa = document.querySelector('.pagarDespesasFixas');
    if (divPagarDespesa) {
      divPagarDespesa.classList = 'pagarDespesasFixas active';
    }
  } else {
    const divPagarDespesa = document.querySelector('.pagarDespesasFixas');
    if (divPagarDespesa) {
      divPagarDespesa.classList = 'pagarDespesasFixas';
    }
  }


  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get(`/contas/index/${user.id}`);
      setConta(response.data[0])
      setIsLoading(false);
      if (despesa.despesa) {
        setAno(new Date(despesa.despesa.data_venc).getFullYear());
        setMesAtual(new Date(despesa.despesa.data_venc).getMonth() + 1);
        setMes(new Date(despesa.despesa.data_venc).getMonth() + 1);
        setDia(new Date(despesa.despesa.data_venc).getDate());
      } else {
        setAno('')
        setMesAtual('')
        setMes('');
        setDia('')
      }
    }
    getData()
  }, [pagarDespesa])


  function handleParcelas(e) {
    setParcelas(e.target.value);
    setValor(despesa.despesa.valor_parcela * e.target.value)
    setQtde_parcelas_pagas(despesa.despesa.qtde_parcelas_pagas);
    setMes(mesAtual + parseFloat(e.target.value))
    e.target.addEventListener("input", handleParcelas)
  }

  // eslint-disable-next-line consistent-return
  async function handleSubmit(e) {
    e.preventDefault();

    if (data === '') {
      return Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Você previsa informar a data de pagamento!'
      })
    }

    if (parcelas === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Você precisa informar a quantidade de parcelas que serão pagas'
      })
    }

    if (valor > conta.saldo) {
      return Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Você não tem saldo suficiente para efetuar o pagamento!'
      })
    }

    if (descontarEmConta) {
      try {
        setIsLoading(true)
        await axios.post('/transacoes/', {
          data,
          tipo: 'Despesa',
          descricao: `${parseFloat(parcelas) + parseFloat(despesa.despesa.qtde_parcelas_pagas)}|${despesa.despesa.qtde_parcelas} - ${despesa.despesa.nome}`,
          user_id: user.id,
          conta_id: conta.id,
          valor,
          categoria_id: despesa.despesa.categoria_id
        })
      } catch (error) {
        setIsLoading(false)
        return Swal.fire({
          title: 'error',
          icon: 'error',
          text: error.response.data.errors
        })
      }
    }

    try {
      setIsLoading(true)
      await axios.put(`/gastos-fixos/${despesa.despesa.id}`, {
        qtde_parcelas_pagas: parseFloat(qtde_parcelas_pagas) + parseFloat(parcelas),
        data_venc: mes > 12 ? (`${ano + 1}-${mes - 12}-${dia}`) : (`${ano}-${mes}-${dia}`)
      })
      setIsLoading(false);
      return Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Pagamento realizado com sucesso!',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(actionsDespesa.pagarDespesaFailure())
          history.go('/')
        }
      })
    } catch (error) {
      setIsLoading(false)
      return Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: error.response.data.errors
      })
    }
  }

  function handleCancel() {
    dispatch(actionsDespesa.pagarDespesaFailure())
    setData('');
    setParcelas(0);
    setOutraData(false);
  }

  return (
    <div className="pagarDespesasFixas">
      {isLoading ? (
        <div className="box pagarDespesasFixasConteudo">
          <center><ClipLoader color="#0077b6" size={70} /></center>
        </div>
      ) : (
        <div className="box pagarDespesasFixasConteudo">
          <h1>Pagar parcelas de <strong>{despesa.despesa ? despesa.despesa.nome : ''}</strong></h1>
          <hr />
          <form onSubmit={handleSubmit}>

            <div className="grid">
              <div className="data">
                <label className="label">
                  Data de pagamento:
                </label>
                <label className="label" htmlFor="data_compra">
                  <i className="bx bx-calendar icon" />
                  <button type="button" className={data === dataAtual ? "button is-active" : "button"} onClick={() => setData(dataAtual)}>Hoje</button> <button type="button" className={outraData ? "button is-active" : "button"} onClick={() => setOutraData(true)} >Outro...</button>

                  <input type="date" className="inputdate" value={data} hidden={!outraData} onChange={(e) => setData(e.target.value)} />

                </label>
              </div>
            </div>

            <div className="grid">
              <div className="col">
                <label className="label" htmlFor="qtdeparcelas">
                  Quantidade de parcelas:
                  <br />
                  <input type="number" className="input select-venc" name="qtdeparcelas" value={parcelas} min={1} max={despesa.despesa ? despesa.despesa.qtde_parcelas - despesa.despesa.qtde_parcelas_pagas : 0} onChange={handleParcelas} />
                </label>
              </div>

              <div className="col">
                <label className="label" htmlFor="checkbox">
                  Deseja descontar em conta?
                  <br />
                  <input type="radio" name="checkbox" onChange={() => setDescontarEmConta(true)} checked={descontarEmConta === true} /> Sim <input type="radio" name="checkbox" onChange={() => setDescontarEmConta(false)} checked={descontarEmConta === false} /> Não
                </label>
              </div>
            </div>

            <div className="grid">
              <div className="col">
                <div className="notification">
                  <i className='bx bx-info-circle' />
                  <br />
                  <div className="content is-small">
                    <p>Informe se deseja ou não, descontar o pagamento em conta. <br/>
                    <strong>Essa opção irá impactar diretamente em seu orçamento.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {descontarEmConta && despesa.despesa ? (
                <div className="col">
                  <div className="box">
                    <p>Saldo atual: <strong>{formatarValor.format(conta.saldo)}</strong>
                      <br />
                      - <strong className="valor_parcelas">{formatarValor.format(despesa.despesa.valor_parcela * parcelas)} </strong>
                      <hr />
                      Previsão de saldo: <strong>{formatarValor.format(conta.saldo - despesa.despesa.valor_parcela * parcelas)}</strong>
                    </p>
                  </div>
                </div>
              ) : ""}
            </div>

            <button type="submit" className="button is-success"><i className='bx bx-check' />  Efetuar pagamento</button> <button type="button" className="button is-danger" onClick={handleCancel} ><i className='bx bx-x' /> Cancelar</button>
          </form>
        </div>
      )}
    </div >
  )
}
