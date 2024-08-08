/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import Swal from 'sweetalert2';

import './style.css';
import axios from "../../services/axios";
import history from '../../services/history';
import * as actionsMetas from '../../store/modules/editMetasFin/actions';
import Loading from "../Loading";


export default function EditMetasFinanceiras() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const metaFinanceira = useSelector((state) => state.editMetasFin.metaFinanceira);
  const verMeta = useSelector((state) => state.editMetasFin.verMeta)
  const [categorias, setCategorias] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valor_meta, setValorMeta] = useState(0);
  const [valor_guardar, setValor_guardar] = useState();
  const [data_alvo, setDataAlvo] = useState('');
  const [saldo_meta, setSaldo_meta] = useState(0);
  const [categoria_id, setCategoria_id] = useState(0)
  const [categoriaAtual, setCategoriaAtual] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState(false);

  function handleCancelar() {
    dispatch(actionsMetas.verMetasFailure());
  }

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    minimum: 2,
    day: '2-digit'
  })

  useEffect(() => {
    if (verMeta) {
      setDescricao(metaFinanceira.metaFinanceira.descricao)
      setValorMeta(metaFinanceira.metaFinanceira.valor_meta)
      setValor_guardar(metaFinanceira.metaFinanceira.valor_guardar);
      setDataAlvo(moment(formatarData.format(new Date(metaFinanceira.metaFinanceira.data_alvo)), 'DD/MM/YYYY').format('YYYY-MM-DD'))
      setSaldo_meta(metaFinanceira.metaFinanceira.saldo_meta);
      setCategoria_id(metaFinanceira.metaFinanceira.categoria_id);
      // eslint-disable-next-line eqeqeq
      setCategoriaAtual(categorias.filter((categoria) => categoria.id === metaFinanceira.metaFinanceira.categoria_id)[0])
    }
  }, [verMeta])

  if (verMeta) {
    const divEditMetas = document.querySelector('.editMetasFinanceiras');
    if (divEditMetas) {
      divEditMetas.classList = 'editMetasFinanceiras active'
    }
  } else {
    const divEditMetas = document.querySelector('.editMetasFinanceiras');
    if (divEditMetas) {
      divEditMetas.classList = 'editMetasFinanceiras'
    }
  }

  const temSimbolos = (string) => {
    const regex = /^[A-Za-z\s]+$/i;
    return regex.test(string)
  }

  const dataAtual = new Date();
  /* const dia = dataAtual.getDate();
  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear(); */

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/categorias/');
      setCategorias(response.data.filter(categoria => categoria.nome !== "Salário" && categoria.nome !== "Serviços"))
    }
    getData()
  }, [])

  function validaDescricao(e) {
    const input = e.target;
    const infoError = document.querySelector('.erro-descricao');
    setDescricao(e.target.value);

    if (descricao.lenght <= 0) {
      setErrors(true);
      input.classList = 'input descricao';
      infoError.textContent = `* O campo "Nome do objetivo", não pode ficar vazio!`
      return
    } if (descricao.length <= 3 || descricao.length > 55) {
      setErrors(true);
      input.classList = 'input descricao';
      infoError.textContent = `* O campo "Nome do objetivo", deve ter no mínimo 3 caracteres e no máximo 55`;
      return
    } if (!temSimbolos(descricao)) {
      setErrors(true)
      input.classList = 'input descricao';
      infoError.textContent = `* O campo "Nome do objetivo", não pode ter símbolos!`
      return
    }
    setErrors(false);
    input.classList = 'input descricao';
    infoError.textContent = "";
    input.addEventListener("input", validaDescricao)
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (descricao === '' || descricao.length <= 0) {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Você precisa informar a descrição de seu objetivo!`,
      })
    }
    if (valor_meta === 0) {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `O "Valor do objetivo", não pode ser igual a R$ 0,00!`,
      });
    }
    setErrors(false)
    if (valor_guardar === 0) {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `O campo "Quanto deseja guardar por mês?", não pode ser igual a R$ 0,00!`,
      })
    }
    setErrors(false)
    if (data_alvo === '') {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Você precisa informar a data final de seu objetivo!`,
      })
    }
    if (new Date(data_alvo).getDate() + 1 === dataAtual.getDate() && new Date(data_alvo).getMonth() === dataAtual.getMonth() && new Date(data_alvo).getFullYear() === dataAtual.getFullYear()) {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `A Data final do objetivo não pode ser igual a data atual.`,
      });
    }

    if (valor_meta < valor_guardar) {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `O valor que você irá guardar, não pode ser maior que o objetivo.`,
      })
    }

    if (categoria_id === 0) {
      setErrors(true);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'A categoria não foi informada!',
      })
    }


    // eslint-disable-next-line consistent-return
    if (errors) return

    try {
      setIsLoading(true);
      await axios.put(`/metas-financeiras/${metaFinanceira.metaFinanceira.id}`, {
        user_id: user.id,
        categoria_id,
        descricao,
        valor_meta,
        valor_guardar,
        saldo_meta,
        data_alvo,
      })
      setIsLoading(false);
      handleCancelar()
      return Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Objetivo editado com sucesso!',
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/');
        }
      })

    } catch (error) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.response.data.errors || 'A Categoria não foi informada'
      })
    }

  }


  return (
    <div className="editMetasFinanceiras">
      <Loading isLoading={isLoading} />
      <div className="box">
        <form onSubmit={handleSubmit}>
          <h1>Editar objetivo <i className='bx bx-pencil' /></h1>
          <hr />


          <div className="grid">
            <div className="col">

              <label className="label" htmlFor="descricao">
                Nome do objetivo:
                <p className="control has-icons-left">
                  <input type="text" name="descricao" className="input descricao" placeholder="Ex: Casa, Carro e etc..." value={descricao} onChange={(e) => validaDescricao(e)} />
                  <span className="icon is-large is-left"><i className='bx bx-label' /></span>
                </p>
                <div className="content is-small">
                  <p className="info-erro erro-descricao" />
                </div>
              </label>
            </div>


          </div>

          <div className="grid">
            <div className="col">
              <br />
              <label className="label">categoria: </label>
              <div className="select">
                <p className="control has-icons-left">
                  <select className="input select" value={categoria_id} name="categoria_id" onChange={(e) => setCategoria_id(parseFloat(e.target.value))}>
                    <option>Selecione a categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                  {categoria_id > 0 ? (
                    <span className="icon is-large is-left icon-categoria"><i className={categorias.filter(categoria => categoria.id === categoria_id)[0].icone} /></span>
                  ) : ""}
                </p>

              </div>
            </div>

            <div className="col">
              <label className="label" htmlFor="valor_meta">
                Valor do objetivo:
                <p className="control has-icons-left">
                  <NumericFormat
                    className="input valor"
                    value={valor_meta}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale={2}
                    allowNegative={false}
                    onFocus={(e) => e.target.select()}
                    // eslint-disable-next-line react/jsx-no-bind
                    onValueChange={(e) => setValorMeta(e.floatValue)}
                  />
                  <span className="icon is-large is-left"><i className="bx">R$</i></span>
                </p>
              </label>
            </div>
          </div>

          <div className="grid">

            <div className="col">
              <label className="label" htmlFor="data_alvo">
                Data de conclusão: <br />
                <input type="date" name="data_alvo" value={data_alvo} className="input data" onChange={(e) => setDataAlvo(e.target.value)} />
              </label>
            </div>

            <div className="col">
              <div className="notification is-info">
                <div className="content ">
                  <i className='bx bx-info-circle' />
                  <br />
                  <p>Informe corretamente a data limite de conclusão de seu objetivo. <br />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="grid">
            <div className="col">
              <label className="label">
                Valor inicial do objetivo:
                <p className="control has-icons-left">
                  <NumericFormat
                    className="input valor"
                    value={saldo_meta}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowLeadingZeros
                    decimalScale={2}
                    fixedDecimalScale={2}
                    allowNegative={false}
                    onFocus={(e) => e.target.select()}
                    // eslint-disable-next-line react/jsx-no-bind
                    onValueChange={(e) => setSaldo_meta(e.floatValue)}
                  />
                  <span className="icon is-large is-left"><i className="bx">R$</i></span>
                </p>
              </label>
            </div>

            <div className="col">
              <label className="label" htmlFor="valor_guardar">
                Quanto deseja guardar por mês?
                <p className="control has-icons-left">
                  <NumericFormat
                    className="input valor"
                    value={valor_guardar}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowLeadingZeros
                    decimalScale={2}
                    fixedDecimalScale={2}
                    allowNegative={false}
                    onFocus={(e) => e.target.select()}
                    // eslint-disable-next-line react/jsx-no-bind
                    onValueChange={(e) => setValor_guardar(e.floatValue)}
                  />
                  <span className="icon is-large is-left"><i className="bx">R$</i></span>
                </p>
              </label>
            </div>


          </div>

          <div className="grid">
            <div className="col">
              <button type="submit" className="button is-success"><i className='bx bxs-save' /> Salvar</button>
            </div>

            <div className="col">
              <button type="button" className="button is-danger" onClick={() => dispatch(actionsMetas.verDetalhesMetasFailure())}><i className='bx bx-x' />Cancelar</button>
            </div>

          </div>
        </form>
      </div>
    </div >
  )
}
