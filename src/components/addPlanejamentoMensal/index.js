/* eslint-disable no-inner-declarations */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import Swal from "sweetalert2";
import ClipLoader from 'react-spinners/ClipLoader';

import './style.css';
import * as actionsPlanejamento from '../../store/modules/planejamentosMensais/actions';
import axios from "../../services/axios";
import history from "../../services/history";

export default function AddPlanejamentoMensal() {
  const dispatch = useDispatch();
  const addPlanejamentoMensal = useSelector(state => state.planejamentosMensais.novoPlanejamento)
  const [conta_id, setConta_id] = useState('');
  const user = useSelector(state => state.auth.user);
  const [valor_maximo, setValorMaximo] = useState(0);
  const [salario, setSalario] = useState(0);
  const [porcentagem_economizar, setPorcentagem_economizar] = useState(10);
  const [planejamentoMensal, setPlanejamentoMensal] = useState('');
  const [planejamentoMensalCategorias, setPlanejamentoMensalCategorias] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoria_id, setCategoria_id] = useState('');

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  if (addPlanejamentoMensal) {
    const divPlanejamentoMensal = document.querySelector('.divAddPlanejamentoMensal');
    if (divPlanejamentoMensal) {
      divPlanejamentoMensal.classList = 'divAddPlanejamentoMensal active'
    }
  } else {
    const divPlanejamentoMensal = document.querySelector('.divAddPlanejamentoMensal');
    if (divPlanejamentoMensal) {
      divPlanejamentoMensal.classList = 'divAddPlanejamentoMensal'
    }
  }


  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const responseCategorias = await axios.get(`/categorias/`);
        setCategorias(responseCategorias.data);
        if (addPlanejamentoMensal) {
          const responsePlanejamentoMensal = await axios.get(`planejamento-mensal/${user.id}`);
          setPlanejamentoMensal(responsePlanejamentoMensal.data.planejamentoMensal[0]);
        } else {
          setPlanejamentoMensal([]);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setPlanejamentoMensal('');
      }

      try {
        const responseConta = await axios.get(`/contas/index/${user.id}`);
        setConta_id(responseConta.data[0].id)
      } catch (error) {
        setConta_id(0)
      }

    }
    getData()
  }, [addPlanejamentoMensal])


  useEffect(() => {
    async function getData() {
      try {
        if (typeof planejamentoMensal.id === 'number') {
          setIsLoading(true)
          const responsePlanejamentoMensalCategorias = await axios.get(`planejamento-mensal-categorias/${planejamentoMensal.id}`)
          setPlanejamentoMensalCategorias(responsePlanejamentoMensalCategorias.data)
        }
        setIsLoading(false)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: error.response.data.errors
        })
      }
    }
    getData()
  }, [planejamentoMensal])

  async function pegarDadosPlanejamentos() {
    try {
      setIsLoading(true);
      const responsePlanejamentoMensalCategorias = await axios.get(`planejamento-mensal-categorias/${planejamentoMensal.id}`)
      setPlanejamentoMensalCategorias(responsePlanejamentoMensalCategorias.data)
      setIsLoading(false);
    } catch (error) {
      setPlanejamentoMensalCategorias([]);
      setIsLoading(false);
    }
  }

  function handleCancel() {
    history.go('/');
    setValorMaximo(0);
    setConta_id(0);
    dispatch(actionsPlanejamento.novoPlanejamentoMensalFailure())
  }

  if (conta_id === 0) {
    return (
      <div className="divAddPlanejamentoMensal">
        <div className="box">
          <div className="grid">
            <div className="col">
              <h1>Oops!</h1>

              <label className="label">
                Você ainda não cadastrou nenhuma conta bancária!
                <br />
                <i className='bx bx-tired' />
              </label>
              <button type="button" className="button is-danger" onClick={handleCancel}><i className='bx bx-x' /> Fechar</button>

            </div>
          </div>
        </div>
      </div >
    )
  }

  function validaSalario(e) {
    setSalario(e.floatValue);

    if (salario > 0) {
      document.querySelector('.erro-salario').textContent = ''
      document.querySelector('.input-salario').style.borderColor = 'rgba(56, 240, 0, 0.6)'
    } else {
      document.querySelector('.erro-salario').textContent = '* Este campo não pode ficar vazio!'
      document.querySelector('.input-salario').style.borderColor = 'red'
    }
  }

  function validaPorcentagem(e) {
    setPorcentagem_economizar(e.floatValue);

    if (porcentagem_economizar === 0) {
      document.querySelector('.erro-porcentagem-economizar').textContent = '* este campo não pode ficar vazio!'
      document.querySelector('.porcentagem').style.borderColor = 'red'
    }
    document.querySelector('.erro-porcentagem-economizar').textContent = ''
    document.querySelector('.porcentagem').style.borderColor = 'rgba(56, 240, 0, 0.6)'
  }

  function validaValorCategoria(e) {
    setValorMaximo(e.floatValue)

    if (valor_maximo > planejamentoMensal.valor_maximo - planejamentoMensalCategorias.map((planenejamento) => planenejamento.valor_maximo).reduce((acumulador, valores) => acumulador += valores, 0)) {
      document.querySelector('.valor-categoria').style.borderColor = 'red';
      document.querySelector('.erro-plane-categorias').textContent = '* o valor é maior que o saldo disponível!'
    }
    document.querySelector('.valor-categoria').style.borderColor = 'rgba(56, 240, 0, 0.6)';
    document.querySelector('.erro-plane-categorias').textContent = ''
  }


  async function handleSubmit(e) {
    e.preventDefault();

    if (salario === 0) {
      document.querySelector('.erro-salario').textContent = '* este campo não pode ficar vazio!'
      return document.querySelector('.input-salario').style.borderColor = 'red'
    }

    if (porcentagem_economizar === 0) {
      document.querySelector('.erro-porcentagem-economizar').textContent = '* este campo não pode ficar vazio!'
      return document.querySelector('.porcentagem').style.borderColor = 'red'
    }

    try {
      setIsLoading(true);
      const response = await axios.post('planejamento-mensal/', {
        valor_maximo: parseFloat((salario - (porcentagem_economizar / 100) * salario)),
        salario,
        porcentagem_economizar,
        user_id: user.id,
        conta_id
      })
      setIsLoading(false);
      setValorMaximo(0);
      return setPlanejamentoMensal(response.data);
    } catch (error) {
      setIsLoading(false);
      return Swal.fire({
        title: 'Erro!',
        icon: 'error',
        text: error.response.data.errors
      })
    }
  }

  async function handleSubmitCategorias(e) {
    e.preventDefault();

    if (valor_maximo > (planejamentoMensal.valor_maximo - planejamentoMensalCategorias.map((planenejamento) => parseFloat(planenejamento.valor_maximo)).reduce((acumulador, valores) => acumulador += parseFloat(valores), 0))) {
      document.querySelector('.valor-categoria').style.borderColor = 'red';
      return document.querySelector('.erro-plane-categorias').textContent = '* o valor é maior que o saldo disponível!'
    }

    try {
      setIsLoading(true)
      await axios.post('planejamento-mensal-categorias', {
        valor_maximo,
        categoria_id,
        planejamento_mensal_id: planejamentoMensal.id
      })
      setValorMaximo(0);

      return pegarDadosPlanejamentos();
    } catch (error) {
      setIsLoading(false)
      return Swal.fire({
        title: 'Erro!',
        icon: 'error',
        text: error.response.data.errors,
      })
    }
  }


  async function handleDeleteCategorias(id) {
    try {
      setIsLoading(true);
      await axios.delete(`planejamento-mensal-categorias/${id}`)
      pegarDadosPlanejamentos();
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: error.response.data.errors
      })
    }
  }

  async function handleDelete(id) {
    Swal.fire({
      icon: 'warning',
      title: 'tem certeza?',
      text: 'Você não poderá voltar atrás!',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        async function deletar() {
          try {
            setIsLoading(true);
            await axios.delete(`/planejamento-mensal/${id}`);
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Planejamento mensal deletado com sucesso!',
            })
            handleCancel();
            history.go('/')
            setIsLoading(false);
          } catch (error) {
            setIsLoading(false);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: error.response.data.errors,
            })
          }
        }
        deletar()
      }
    })
  }


  if (planejamentoMensal.id >0 > 0 && addPlanejamentoMensal === true) {
    return (
      <div className="divAddPlanejamentoMensal">
        {isLoading === true ? (
          <div className="box">
            <center><ClipLoader color="#0077b6" size={80} /></center>
          </div>
        ) : (
          <div className="box">
            <h1>Novo planejamento mensal <i className='bx bxs-directions' /> <button type="button" className="button" onClick={() => handleDelete(planejamentoMensal.id)}> <i className='bx bxs-trash' /></button></h1>
            <hr />
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
                    <i className='bx bx-info-circle' />
                    Total de gastos sem categorias:
                    <br />
                    <p className="infoValorSemCategorizar">{formatarValor.format(planejamentoMensal.valor_maximo - planejamentoMensalCategorias.map((planenejamento) => parseFloat(planenejamento.valor_maximo)).reduce((acumulador, valores) => acumulador += parseFloat(valores), 0))}</p>
                  </label>
                </div>
              </div>
            </div>

            <label className="label">
              Defina os gastos por categorias:
            </label>

            {planejamentoMensalCategorias.map((planejamentos) => (
              <div>
                <div className="grid">
                  <div className="col">
                    <br />
                    {planejamentos.categoria_id ? (
                      <label className="tag is-info is-large">
                        <i className={categorias.filter((categoria) => categoria.id === planejamentos.categoria_id)[0].icone} />  {categorias.filter((categoria) => categoria.id === planejamentos.categoria_id)[0].nome}
                      </label>
                    ) : ""}
                  </div>

                  <div className="col">
                    <br />
                    <label className="tag is-danger is-large">
                      {formatarValor.format(planejamentos.valor_maximo)}
                    </label>
                  </div>

                  <div className="col">
                    <br />
                    <button className="button" type="button" onClick={() => handleDeleteCategorias(planejamentos.id)}><i className='bx bxs-trash' /></button>
                  </div>
                </div>
                <hr />
              </div>
            ))}

            <form onSubmit={handleSubmitCategorias}>
              <div className="grid">
                <div className="col">
                  <label className="label">
                    <br />
                    <p className="control has-icons-left">
                      <select className="input select" name="categoria_id" onChange={(e) => setCategoria_id(Number(e.target.value))}>
                        <option>Selecione a categoria</option>
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

                <div className="col">
                  <label className="label">
                    <br />
                    <p className="control has-icons-left">
                      <NumericFormat
                        value={valor_maximo}
                        className="input valor valor-categoria"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        maxLength={15}
                        onFocus={(e) => e.target.select()}
                        // eslint-disable-next-line react/jsx-no-bind
                        onValueChange={validaValorCategoria}
                      />
                      <span className="icon is-large is-left">R$</span>
                    </p>
                    <div className="content is-small">
                      <p className="info-erro erro-plane-categorias" />
                    </div>
                  </label>
                </div>

                <div className="col">
                  <br />
                  <button type="submit" className="button is-success"><i className='bx bx-save' />Salvar</button>
                </div>

              </div>
            </form>
            <hr />
            <button type="button" className="button" onClick={handleCancel}><i className='bx bx-x' /> Fechar</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="divAddPlanejamentoMensal">
      {isLoading ? (
        <div className="box">
          <center><ClipLoader color="#0077b6" size={80} /></center>
        </div>
      ) : (
        <div className="box">
          <h1>Novo planejamento mensal <i className='bx bxs-directions' /></h1>
          <hr />
          <form onSubmit={handleSubmit}>

            <div className="grid">
              <div className="col">
                <label className="label">
                  Quanto você ganha por mês?
                  <p className="control has-icons-left">

                    <NumericFormat
                      value={salario}
                      className="input valor input-salario"
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      maxLength={15}
                      allowNegative={false}
                      onFocus={(e) => e.target.select()}
                      // eslint-disable-next-line react/jsx-no-bind
                      onValueChange={validaSalario}
                    />
                    <span className="icon is-large is-left">R$</span>
                  </p>
                </label>

                <div className="content is-small">
                  <p className="info-erro erro-salario" />
                </div>

                <br />

                <label className="label">
                  Quanto você deseja economizar?

                  <div className="column is-one-third">
                    <p className="control has-icons-right">
                      <NumericFormat
                        className="input is-one-quarter valor porcentagem"
                        value={porcentagem_economizar}
                        min={0}
                        max={100}
                        defaultValue={0}
                        prefix=""
                        fixedDecimalScale={2}
                        maxLength={3}
                        allowNegative={false}
                        // eslint-disable-next-line react/jsx-no-bind
                        onValueChange={validaPorcentagem}
                      />
                      <span className="icon is-right">%</span>
                    </p>

                  </div>
                </label>

                <div className="content is-small">
                  <p className="info-erro erro-porcentagem-economizar" />
                </div>

                <br />

                <div className="notification planejamentoMensal">
                  <i className='bx bx-dollar-circle' />
                  Seu orçamento mensal será:<br />
                  <strong>{formatarValor.format((salario - (porcentagem_economizar / 100) * salario))} </strong> <br />
                  E você irá economizar: <br />
                  <strong className="infoEconomizar planejamentoMensal">{formatarValor.format((porcentagem_economizar / 100) * salario)} </strong>
                </div>

              </div>

              <div className="col">
                <div className="grid botao_enviar">
                  <div className="col">
                    <button type="submit" className="button is-rounded is-success">
                      <p>Continuar</p>
                      <i className='bx bx-right-arrow-alt' />
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </form>
          <br />
          <button type="button" className="button is-danger" onClick={handleCancel}><i className='bx bx-x' /> Cancelar</button>
        </div>
      )}
    </div>
  )
}
