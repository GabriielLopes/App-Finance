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
  const auth = useSelector((state) => state.auth)
  const novaDespesa = useSelector((state) => state.despesa.novaDespesa);

  const [conta_id, setConta_id] = useState(0);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState(0);
  const [data_compra, setData_compra] = useState('');
  const [data_venc, setData_venc] = useState('');
  const [parcelado, setParcelado] = useState('Não');
  const [qtde_parcelas, setQtde_parcelas] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [categoria_id, setCategoria_id] = useState([]);
  const [erro, setErro] = useState(false);
  const [isLoading, setIsloading] = useState(false);




  const hasSymbols = (string) => {
    const regex = /[!"#$%&'()*+,-./:;<=>?@^_{|}~]/;
    return regex.test(string);
  }

  const listQtde_Parcelas = [1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
  ]

  const listDias = [1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

  try {
    useEffect(() => {
      async function getData() {
        axios.defaults.headers.get.Authorization = `Bearer ${auth.token}`
        // eslint-disable-next-line consistent-return
        const responseConta = await axios.get(`/contas/index/${user.id}`).catch((err) => {
          if (err.response.status === 400) {
            return setConta_id(0)
          }
        })
        if (responseConta) {
          if (responseConta.data.length <= 0) {
            return setConta_id(0);
          }
          const responseCategorias = await axios.get(`/categorias/`);
          setCategorias(responseCategorias.data);
          return setConta_id(responseConta.data.id)
        }
      }
      getData()
    }, [])
  } catch (error) {
    Swal.fire({
      title: 'error',
      icon: 'error',
      text: `${error.response}`
    })
  }


  function validaNome() {

    if (nome.length <= 0 || nome === '') {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O nome não pode ficar vazio!'
      })
      return setErro(true)
    }

    if (nome.length >= 25) {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O nome deve ter no máximo 25 caracteres!'
      })
      return setErro(true)
    }

    if (hasSymbols(nome)) {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O nome não pode ter símbolos',
      })
      return setErro(true)
    }
    setErro(false)
    return erro;
  }

  function validaData() {
    if (data_compra.length <= 0 || data_compra === '') {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O campo "Data de compra", não pode ficar vazio!',
      })
      return setErro(true)
    }

    if (data_venc.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O campo "Vencimento da fatura", não pode ficar vazio!',
      })
      return setErro(true)
    }

    if (data_venc < data_compra) {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O vencimento da fatura não pode ser inferior a data de compra.',
      })
      return setErro(true)
    }
    setErro(false);
    return erro;
  }

  function validaValor() {
    if (valor === 0) {
      Swal.fire({
        icon: 'error',
        title: 'ERRO!',
        text: 'O valor não pode ser igual a "R$ 0,00"',
      })
      return setErro(true)
    }
    setErro(false);
    return erro;
  }

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

    validaNome();
    validaData();
    validaValor();

    if (erro === false) {
      try {
        setIsloading(true);
        await axios.post('/gastos-fixos/', {
          nome,
          valor,
          data_compra,
          data_venc,
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
            history.go('/');
          }
        })
      } catch (error) {
        setIsloading(false);
        Swal.fire({
          icon: 'error',
          title: 'ERRO!',
          text: erro.response,
        })
        console.log(erro)
      }
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
        <form onSubmit={onSubmit}>
          <h1 className='title'>Adicionar despesa</h1>
          <hr className="hr" />
          <label className='label' htmlFor="nome">
            Nome:
            <input type='text' className='input' placeholder='EX: "Celular Samsung"' id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>

          <label className="label" htmlFor="categoria">
            Categoria:
            <br />
            <div className="select">
              <select className="input" onChange={(e) => setCategoria_id(Number(e.target.value))}>
                <option value="0">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nome} / {categoria.descricao}</option>
                ))}
              </select>
            </div>
          </label>

          <label className='label' htmlFor="valor">
            Valor da compra:
            <input hidden />
            <NumericFormat
              className="input"
              value={valor}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              fixedDecimalScale={2}
              placeholder='Ex: R$ 125,00'
              allowNegative={false}
              // eslint-disable-next-line react/jsx-no-bind
              onValueChange={(e) => setValor(e.floatValue)}
              id="valor"
            />
          </label>

          <div className="grid">
            <div className="col">
              <label className="label" htmlFor="data_compra">
                Data de compra:
                <input type="date" className="input" id="data_compra" value={data_compra} onChange={(e) => setData_compra(e.target.value)} />
              </label>
            </div>

            <div className="col">
              <label className="label" htmlFor="data_venc">
                Dia de vencimento da fatura:
                <div className="select">
                  <select className="input" value={data_venc} onChange={(e) => setData_venc(Number(e.target.value))}>
                    {listDias.map((numDia) => (
                      <option value={numDia}>{numDia}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
          </div>

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


          <label className='label' htmlFor="qtde_parcelas">
            Quantidade de parcelas:
            <div className="select">
              <select className="input select" value={qtde_parcelas} onChange={(e) => setQtde_parcelas(Number(e.target.value))} disabled={parcelado === 'Não'}>
                {listQtde_Parcelas.map((numParcela) => (
                  <option value={numParcela}>{numParcela}</option>
                ))}
              </select>
            </div>

          </label>

          <button type='submit' className='button is-link is-left'><i className='bx bx-check' /> Cadastar</button>
          <button type='button' className='button is-danger' onClick={() => dispatch(actions.novaDespesaRequest())}><i className='bx bx-x' /> Cancelar</button>
        </form>
      </div>
    </div>
  )
}

