/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';

import './style.css';
import axios from "../../services/axios";
import history from '../../services/history';
import * as actions from '../../store/modules/transacao/actions';
import Loading from "../Loading";

export default function Transacao() {
  const novaTransacao = useSelector((state) => state.transacao.novaTransacao)

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth)

  const user = useSelector((state) => state.auth.user);
  const user_id = user.id;
  // eslint-disable-next-line no-unused-vars
  const [conta, setConta] = useState([]);
  const [conta_id, setConta_id] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [valor, setValor] = useState(0);
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria_id, setCategoria_id] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [outraData, setOutraData] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState(false);
  // eslint-disable-next-line react/jsx-no-useless-fragment

  const dia = new Date().getUTCDate()
  const mes = new Date().getUTCMonth() + 1;
  const mesFormatado = mes.toString().padStart(2, '0');
  const ano = new Date().getUTCFullYear();

  const dataAtual = `${ano}-${mesFormatado}-${dia}`


  // pegar dados de conta bancária
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/contas/index/${user.id}`);
        setConta(response.data);
        setConta_id(response.data[0].id);
        setIsLoading(false);
      } catch (error) {
        setConta([]);
        setConta_id('');
        setIsLoading(false);
      }
    }
    getData();
  }, [novaTransacao])

  // pegar dados de categoria
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/categorias/');
        if (tipo === 'Receita') {
          const categoriasReceitas = []
          categoriasReceitas.push(response.data.filter((categoria) => categoria.nome === 'Salário')[0])
          categoriasReceitas.push(response.data.filter((categoria) => categoria.nome === 'Serviços')[0]);
          setCategorias(categoriasReceitas);
        } else if (tipo === 'Despesa') {
          setCategorias(response.data.filter((categoria) => categoria.nome !== "Salário" && categoria.nome !== "Serviços"));
        }
        else {
          setCategorias([]);
        }
        setIsLoading(false)
      } catch (error) {
        setCategorias([]);
        setIsLoading(false);
      }
    }
    getData();
  }, [novaTransacao, tipo])

  if (!conta) {
    return
  }

  function cancelarTransacao() {
    setValor(0);
    setData('');
    setTipo('');
    setCategoria_id(0);
    setDescricao('');
    dispatch(actions.novaTransacaoRequest())
  }


  let verErrorData = false
  function handleDataChange(e) {
    const { value } = e.target
    const infoErro = document.querySelector('.erro-data-transacao');

    if (value === '' && !verErrorData) {
      infoErro.textContent = "* Este campo não pode ficar vazio"
      setErrors(true)
      verErrorData = true
      setData(value)
    } else if (value !== '' && !verErrorData) {
      infoErro.textContent = '';
      setData(value)
      setErrors(false)
    }

    setData(value)
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (valor === 0 || valor === '') {
      setErrors(true);
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O valor não pode ser R$ 0,00! ',
      })
      return errors
    }
    setErrors(false)

    if (data.length === 0) {
      setErrors(true);
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O campo "Data" não pode ficar vazio!',
      })
      return errors
    }
    setErrors(false)

    if (tipo === '') {
      setErrors(true);
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você precisa informar o tipo da transação',
      })
      return errors
    }
    setErrors(false);

    if (tipo === 'Despesa' && valor > conta[0].saldo) {
      setErrors(true)
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Seu saldo é insuficiente'
      })
      return errors
    }
    setErrors(false)

    if (tipo.length < 1) {
      setErrors(true);
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O campo "tipo" não pode estar vazio!',
      })
    }
    setErrors(false)

    if (categoria_id === 0 || categoria_id === '') {
      setErrors(true);
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você precisa informar a categoria'
      })
      return errors
    }

    if (descricao.length < 5 || descricao.length > 255) {
      setErrors(true)
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'A descrição deve ter no mínimo 5 caracteres e no máximo 255 caracteres'
      })
      return errors
    }
    setErrors(false)

    if (errors) return

    try {
      axios.defaults.headers.post.Authorization = `Bearer ${auth.token}`;
      setIsLoading(true)
      axios.post('/transacoes/', {
        data,
        tipo,
        descricao,
        user_id,
        conta_id,
        valor: parseFloat(valor),
        categoria_id,
      })
      setIsLoading(false)
      Swal.fire({
        icon: 'success',
        title: 'Tansação efetuada com sucesso!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          cancelarTransacao()
          history.go('/')
        }
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error,
      })
      cancelarTransacao()
    }

  }
  // eslint-disable-next-line new-cap

  function selecionarTipo(e) {
    const input = e.target

    if (e.target.value === 'Receita') {
      if (tipo === 'Receita') {
        input.classList = 'button is-success'
        input.style.boxShadow = ''
        setTipo('');
      } else {
        input.classList = 'button is-success is-active'
        input.style.boxShadow = '3px 3px 12px 3px rgba(0, 0, 0, 0.3)'
        setTipo('Receita');
      }
    } else if (e.target.value === 'Despesa') {
      if (tipo === 'Despesa') {
        input.classList = 'button is-danger'
        input.style.boxShadow = ''
        setTipo('');
      } else {
        input.classList = 'button is-danger is-active'
        input.style.boxShadow = '3px 3px 12px 3px rgba(0, 0, 0, 0.3)'
        setTipo('Despesa');
      }
    }
  }

  return (
    <div className="transacao">
      <Loading isLoading={isLoading} />
      {conta.length <= 0 && isLoading === false ? (
        <div className="box box-transacao">
          <p className="">Você precisa cadastrar uma conta bancária!</p>
          <button className="button is-danger" type="button" onClick={cancelarTransacao} ><i className='bx bx-x' /> Cancelar</button>
        </div>

      ) : (
        <form onSubmit={handleSubmit}>

          <div className="box box-transacao">
            <h1 className="title titulo-transacao">Nova transação</h1>
            <hr className="hr" />
            <div className="col-sm my-3">
              <p className="control has-icons-left has-icons-right">
                <NumericFormat
                  value={valor}
                  className="input valor"
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  maxLength={15}
                  onFocus={(e) => e.target.select()}
                  allowNegative={false}
                  // eslint-disable-next-line react/jsx-no-bind
                  onValueChange={(e) => setValor(e.floatValue)}
                />
                <span className="icon is-large is-left">R$</span> </p> </div>

            <div className="data">
              <i className="bx bx-calendar icone" />
              <button type="button" className={data === dataAtual ? "button is-active" : "button"} onClick={() => setData(dataAtual)}>Hoje</button> <button type="button" className={outraData ? "button is-active" : "button"} onClick={() => setOutraData(true)} >Outro...</button> <input type="date" className="inputdate" value={data} hidden={!outraData} onChange={handleDataChange} />
              <br />
            </div>
            <div className="content is-small">
              <p className="info-erro erro-data-transacao" />
            </div>

            <div className="label">Tipo de transação:
              <br />
              <button type="button" className="button is-success" onClick={selecionarTipo} value="Receita" disabled={tipo === 'Despesa'}><i className='bx bx-line-chart' /> Receita</button> <button type="button" className="button is-danger" onClick={selecionarTipo} value='Despesa' disabled={tipo === 'Receita'}><i className='bx bx-line-chart-down' /> Despesa</button> <button type="button" className="button is-danger" disabled={tipo === ''} onClick={() => setTipo('')}><i className="bx bx-x" /></button>
            </div>

            <label className="label">
              Categoria:
              <p className="control has-icons-left">
                <select className="input select" onChange={(e) => setCategoria_id(Number(e.target.value))}>
                  <option value="0">Selecione uma categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                  ))}
                </select>
                {categorias.length > 0 ? (
                  <span className="icon icon-categoria is-large is-left">{categoria_id > 0 ? (<i className={categorias.filter(categoria => categoria.id === categoria_id)[0].icone} />) : ""}</span>
                ) : ""}
              </p>
            </label>

            <label className="label">
              Descrição:
              <p className="control has-icons-left">
                <input type="text" className="input descricao" onChange={(e) => setDescricao(e.target.value)} value={descricao} />
                <span className="icon is-large is-left"><i className="bx bx-label" /></span>
              </p>

            </label>

            <div className="grid">
              <div className="col">
                <button className="button is-primary" type="submit"><i className='bx bx-check' /> Efetuar transação </button>
              </div>
              <div className="col">
                <button className="button is-danger" type="button" onClick={cancelarTransacao} ><i className='bx bx-x' /> Cancelar</button>
              </div>
            </div>
          </div>
        </form>
      )
      }
    </div >
  );
}

