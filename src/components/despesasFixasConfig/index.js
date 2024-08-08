/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";

import './style.css'
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/despesa/actions'
import Loading from '../Loading/index';

export default function DespesasFixasConfig() {
  // nome, valor, data_compra, data_venc, parcelado, qtde_parcelas
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const novaDespesa = useSelector((state) => state.despesa.novaDespesa);

  const [conta_id, setConta_id] = useState(0);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState(0);
  const [data_compra, setData_compra] = useState('');
  const [data_venc, setData_venc] = useState(1);
  const [parcelado, setParcelado] = useState('Não');
  const [qtde_parcelas, setQtde_parcelas] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [categoria_id, setCategoria_id] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [outraData, setOutraData] = useState(false);

  const dia = new Date().getDate()
  const mes = new Date().getMonth() + 1;
  const mesFormatado = mes.toString().padStart(2, '0');
  const ano = new Date().getFullYear();
  const dataAtual = `${ano}-${mesFormatado}-${dia}`

  const hasSymbols = (string) => {
    const regex = /[!"#$%&'()*+,-./:;<=>?@^_{|}~]/;
    return regex.test(string);
  }

  const listQtde_Parcelas = [1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
  ]

  const listDias = [1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/contas/index/${user.id}`)
        setConta_id(response.data[0].id);
      } catch (error) {
        setConta_id(0);
      }
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get('/categorias/');
        setCategorias(response.data);
      } catch (error) {
        setCategorias([]);
      }
    }
    getData()
  }, [])


  function resetarForm() {
    setNome('');
    setValor(0);
    setData_compra('');
    setData_venc('');
    setParcelado('Não');
    setQtde_parcelas(1);
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (nome.length <= 0 || nome === '') {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você precisa informar a descrição da despesa!'
      })

    }

    if (nome.length >= 25) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'A descrição deve ter no máximo 25 caracteres!'
      })
    }

    if (hasSymbols(nome)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Não pode ter símbolos na descrição',
      })
    }

    if (valor === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O valor não pode ser igual a "R$ 0,00"',
      })
    }

    if (data_compra.length <= 0 || data_compra === '') {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você precisa informar a data de compra!',
      })
    }

    if (data_venc.length <= 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você precisa informar o dia de vencimento',
      })
    }

    if (data_venc < data_compra) {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'O vencimento da fatura não pode ser inferior a data de compra.',
      })
    }

    if (categoria_id === 0 || categoria_id === '') {
      return Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Você precisa informar uma categoria!',
      })
    }

    try {
      setIsloading(true);
      await axios.post('/gastos-fixos/', {
        nome,
        valor,
        data_compra,
        data_venc: `${new Date(data_compra).getFullYear()}-${new Date(data_compra).getMonth() + 2}-${data_venc}`,
        qtde_parcelas,
        user_id: user.id,
        conta_id,
        categoria_id,
      })
      setIsloading(false);
      Swal.fire({
        icon: 'success',
        title: 'SUCESSO!',
        text: 'A despesa foi criada com sucesso!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          resetarForm()
          dispatch(actions.novaDespesaRequest())
          history.go('/');
        }
      })
    } catch (error) {
      setIsloading(false);
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: error.response.data.errors,
      })
    }
  }

  if (novaDespesa) {
    const divFundo = document.querySelector(".fundo_despesa")
    const divCadastro = document.querySelector(".cadastroDespesasFixas")
    if (divCadastro && divFundo) {
      divCadastro.classList = "box cadastroDespesasFixas active"
      divFundo.classList = "fundo_despesa active"
    }
  } else {
    const divFundo = document.querySelector(".fundo_despesa")
    const divCadastro = document.querySelector(".cadastroDespesasFixas")
    if (divCadastro && divFundo) {
      divCadastro.classList = "box cadastroDespesasFixas"
      divFundo.classList = "fundo_despesa"
    }
  }

  return (
    <div className="fundo_despesa">
      <Loading isLoading={isLoading} />
      <div className='box cadastroDespesasFixas'>
        <h1 className='title'>Adicionar despesa</h1>
        <hr className="hr" />

        <form onSubmit={onSubmit}>

          <div className="grid">

            <div className="col">
              <label className='label' htmlFor="nome">
                Descrição:
                <p className="control has-icons-left">
                  <input type='text' className='input descricao' placeholder='EX: "Celular Samsung"' id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                  <span className="icon is-large is-left"><i className='bx bx-label' /></span>
                </p>
              </label>
            </div>

            <div className="col">
              <label className='label' htmlFor="valor">
                Valor da compra:
                <input hidden />
                <p className="control has-icons-left">
                  <NumericFormat
                    value={valor}
                    className="input valor input-salario"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    maxLength={15}
                    allowNegative={false}
                    onFocus={(e) => e.target.select()}
                    // eslint-disable-next-line react/jsx-no-bind
                    onValueChange={(e) => setValor(e.floatValue)}
                    id="valor"
                  />
                  <span className="icon icon-valor is-large is-left">R$</span>
                </p>
              </label>
            </div>

          </div>

          <div className="grid">
            <div className="data">
              <label className="label">
                Data de compra:
                </label>
              <label className="label" htmlFor="data_compra">
                <i className="bx bx-calendar icon" />
                <button type="button" className={data_compra === dataAtual ? "button is-active" : "button"} onClick={() => setData_compra(dataAtual)}>Hoje</button> <button type="button" className={outraData ? "button is-active" : "button"} onClick={() => setOutraData(true)} >Outro...</button>

                <input type="date" className="inputdate" value={data_compra} hidden={!outraData} onChange={(e) => setData_compra(e.target.value)} />

              </label>
            </div>
          </div>

          <div className="grid">
            <div className="col">
              <label className="label" htmlFor="data_venc">
                <i className='bx bx-calendar-exclamation' /> Dia do vencimento: <br />
                <div className="select">
                  <select className="input select-venc" value={data_venc} onChange={(e) => setData_venc(Number(e.target.value))}>
                    {listDias.map((numDia) => (
                      <option value={numDia}>{numDia}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <div className="col">
              <div className="notification">
                <i className='bx bx-info-circle' />
                <br />
                <div className="content">
                  <p>Informe o dia de vencimento de sua fatura, para que possamos realizar os cálculos corretamente.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="col">
              <label className="label" htmlFor="categoria">
                Categoria:
                <br />
                <p className="control has-icons-left">
                  <select className="input select" onChange={(e) => setCategoria_id(Number(e.target.value))}>
                    <option value="0">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                  {categoria_id > 0 ? (
                    <span className="icon icon-categoria is-large is-left"><i className={categorias.filter(categoria => categoria.id === categoria_id)[0].icone} /></span>
                  ) : ""}
                </p>

              </label>
            </div>
          </div>

          <div className="grid">
            <div className="col">
              <div className="control">
                <p className="label">Compra parcelada?</p>
                <label className="radio" htmlFor="parcelado?">
                  <input type="radio" name="parcelado?" id="parcelado?" value="Não" onChange={(e) => setParcelado(e.target.value)} checked={parcelado === 'Não'} />
                  Não
                </label>

                <label className="radio" htmlFor="parcelado?">
                  <input type="radio" name="parcelado?" id="parcelado?" value="Sim" onChange={(e) => setParcelado(e.target.value)} checked={parcelado === 'Sim'} />
                  Sim
                </label>
              </div>
            </div>

            <div className="col">
              <label className='label' htmlFor="qtde_parcelas">
                Quantidade de parcelas:
                <br />
                <div className="select">
                  <select className="input select-venc" value={qtde_parcelas} onChange={(e) => setQtde_parcelas(Number(e.target.value))} disabled={parcelado === 'Não'}>
                    {listQtde_Parcelas.map((numParcela) => (
                      <option value={numParcela}>{numParcela}</option>
                    ))}
                  </select>
                </div>

              </label>
            </div>
          </div>


          <div className="grid">
            <div className="col">
              <button type='button' className='button is-danger' onClick={() => dispatch(actions.novaDespesaRequest())}><i className='bx bx-x' /> Cancelar</button>
            </div>

            <div className="col">
              <button type='submit' className='button is-link is-left'><i className='bx bx-check' /> Cadastar</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

