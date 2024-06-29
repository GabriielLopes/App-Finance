/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';
// import { get } from 'lodash';

import './style.css';
import axios from "../../services/axios";
import history from '../../services/history';
import * as actions from '../../store/modules/transacao/actions';
import * as actionsAuth from '../../store/modules/auth/actions';
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
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState(false);

  // eslint-disable-next-line react/jsx-no-useless-fragment

  try {
    useEffect(() => {
      async function getData() {
        setIsLoading(true)
        if (novaTransacao) {
          const responseConta = await axios.get(`/contas/index/${user.id}`);
          if (responseConta.data.length > 0) {
            setConta(responseConta.data);
            setConta_id(responseConta.data[0].id)
            const responseCategorias = await axios.get(`/categorias/`);
            setCategorias(responseCategorias.data);
          }
        }
        setIsLoading(false)
      }
      getData()
    }, [novaTransacao])

  } catch (error) {
    const { status } = error.response;

    if (status === 401) {

      dispatch(actionsAuth.loginFailure());
      Swal.fire({
        icon: 'error',
        title: 'Sessão expirada!',
        text: 'Seu login expirou, faça login novamente para acessar sua conta.'
      });
      history.go('/login'); // Redirect to login page
    }
  }

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

  function createErrorParagraph(msg) {
    const paragraphError = document.createElement('p');
    paragraphError.textContent = `* ${msg}`
    paragraphError.classList.add('error-paragraph'); // Adiciona classe para estilizar
    return paragraphError;
  }

  let verErrorData = false
  function handleDataChange(e) {
    const { value } = e.target

    e.target.style.border = value === '' ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.2)';

    if (value === '' && !verErrorData) {
      const errorParagraph = createErrorParagraph('Este campo não pode ficar vazio!');
      e.target.parentNode.insertBefore(errorParagraph, e.target.nextSibling)
      setErrors(true)
      verErrorData = true
      setData(value)
    } else if (value !== '' && !verErrorData) {
      const errorParagraph = e.target.parentNode.querySelector('.error-paragraph');
      if (errorParagraph) {
        e.target.parentNode.removeChild(errorParagraph);
        setErrors(false)
        verErrorData = false; // Mensagem removida
        setData(value)
      }
    }

    setData(value)
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (tipo === 'Despesa' && valor > conta[0].saldo) {
      setErrors(true)
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Seu saldo é insuficiente'
      })
      return errors
    }
    setErrors(false)

    if (valor === 0 || valor === '') {
      setErrors(true);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'O valor não pode estar vazio! ',
      })
      return errors
    }
    setErrors(false)

    if (data.length === 0) {
      setErrors(true);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'O campo "Data" não pode ficar vazio!',
      })
      return errors
    }
    setErrors(false)


    if (tipo.length < 1) {
      setErrors(true);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'O campo "tipo" não pode estar vazio!',
      })
    }
    setErrors(false)

    if (descricao.length < 5 || descricao.length > 255) {
      setErrors(true)
      Swal.fire({
        icon: 'error',
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
        user_id: user_id,
        conta_id: conta_id,
        valor,
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


  return (
    <div className="transacao">
      <Loading isLoading={isLoading} />
      {conta.length <= 0 && isLoading === false ? (
        <div className="box box-transacao">
          <p className="">Você precisa cadastrar uma conta bancária!</p>
          <button className="button is-danger" type="button" onClick={cancelarTransacao} ><i className='bx bx-x' /> Cancelar</button>
        </div>

      ) : (
      <form onSubmit={handleSubmit}> <div className="box box-transacao">
        <h1 className="title titulo-transacao">Nova transação</h1>
        <hr className="hr" />
        <div className="col-sm my -3">
          <label className="label" htmlFor="valor">Valor:</label>
          <p className="control has-icons-left has-icons-right">
            <NumericFormat
              className="input"
              value={valor}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              fixedDecimalScale={2}
              allowNegative={false}
              // eslint-disable-next-line react/jsx-no-bind
              onValueChange={(e) => setValor(e.floatValue)}
            />
            <span className="icon is-large is-left"> <i className='bx bxs-calculator' /> </span> </p> </div>

        <label className="label">Data:</label>
        <input type="date" className="input" onChange={handleDataChange} />

        <label className="label">Tipo:</label>
        <div className="select" >
        <select type="text" className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option>Selectione o tipo de transação</option>
          <option value="Receita">Receita</option>
          <option value="Despesa">Despesa</option>
        </select>
        </div>

        <label className="label">Categoria:</label>
        <div className="select">
        <select className="input" onChange={(e) => setCategoria_id(Number(e.target.value))}>
          <option value="0">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>{categoria.nome} / {categoria.descricao}</option>
          ))}
        </select>
        </div>
          <br />
        <a href="/config" className="link-cadastrarCategoria"><i className='bx bxs-file-plus' /> Cadastrar categorias</a>

        <label className="label">Descrição:</label>
        <input type="text" className="input" onChange={(e) => setDescricao(e.target.value)} value={descricao} />
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
      )}
    </div>
  );
}

