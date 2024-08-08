/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch, useSelector } from "react-redux";

import './style.css';
import Swal from "sweetalert2";
import * as actionsMeta from '../../store/modules/editMetasFin/actions';
import axios from "../../services/axios";
import history from '../../services/history';

export default function DetalhesMetasFinanceiras() {
  const dispatch = useDispatch();
  const verDetalhesMeta = useSelector((state) => state.editMetasFin.verDetalhesMeta);
  const metaFinanceira = useSelector((state) => state.editMetasFin.metaFinanceira.metaFinanceira);
  const [depositosMetasFinanceiras, setDepositosMetasFinanceiras] = useState([]);
  const [depositosFinanceiros, setDepositosFinanceiros] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState({});
  const [categorias, setCategorias] = useState();
  // eslint-disable-next-line no-unused-vars
  const [dataInicial, setDataInicial] = useState();
  // eslint-disable-next-line no-unused-vars
  const [dataFinal, setDataFinal] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      const response = await axios.get('/categorias/');
      setCategorias(response.data);
      if (metaFinanceira) {
        setCategoriaAtual(response.data.filter((categoria) => categoria.id === metaFinanceira.categoria_id)[0])
        const responseDepositos = await axios.get(`/depositar-metas-financeiras/${metaFinanceira.id}`);
        setDepositosMetasFinanceiras(responseDepositos.data);
        setDepositosFinanceiros(responseDepositos.data);
      }
      else {
        setCategoriaAtual({})
      }
      setIsLoading(false)
    }
    getData();
  }, [verDetalhesMeta])


  if (verDetalhesMeta === true) {
    const divDetalhesMetas = document.querySelector('.detalhesMetasFinanceiras');

    if (divDetalhesMetas) {
      divDetalhesMetas.classList = 'detalhesMetasFinanceiras active'
    }
  } else {
    const divDetalhesMetas = document.querySelector('.detalhesMetasFinanceiras');

    if (divDetalhesMetas) {
      divDetalhesMetas.classList = 'detalhesMetasFinanceiras'
    }
  }

  function voltarPagina() {
    dispatch(actionsMeta.verDetalhesMetasFailure())

  }

  function handleDelete(idDepo, idMeta) {
    Swal.fire({
      icon: 'warning',
      title: 'Tem certeza?',
      text: 'Você não poderá voltar atrás!',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      confirmButtonColor: 'rgb(248, 60, 60)',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(`/depositar-metas-financeiras/${idDepo}/${idMeta}`);
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'O depósito foi excluído com sucesso!'
          }).then((resultado) => {
            if (resultado.isConfirmed) {
              history.go('/')
              dispatch(actionsMeta.verDetalhesMetasFailure())
            }
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: error.response.data.errors,
          })
        }
      }
    })
  }

  // console.log(dataInicial.getTime() >= dataFinal.getTime());

  function handleFilter() {
    if (typeof dataInicial === 'undefined' || dataInicial === '' && typeof dataFinal === 'undefined' || dataFinal === '') {
      setDepositosFinanceiros(depositosMetasFinanceiras)
    } else {
      setDepositosFinanceiros(depositosMetasFinanceiras.filter(deposito => new Date(deposito.data).getTime() >= new Date(dataInicial).getTime() && new Date(deposito.data).getTime() <= new Date(dataFinal).getTime()))
    }

  }


  return (
    <div className="detalhesMetasFinanceiras">
      {metaFinanceira ? (
        <>
          <div className="box box-fundo-detalhes-metas-financeiras">
            <h1>Detalhes do objetivo <i className='bx bxs-detail' /></h1>
            <hr />

            <div className="grid">

              <div className="col">
                <label className="label">
                  Objetivo:
                </label>
                <label className="tag is-large is-info">
                  <span className="icon is-large is-left"><i className='bx bx-label' /></span>
                  {metaFinanceira.descricao}
                </label>
              </div>

              <div className="col">
                {isLoading === true ? (
                  <center><ClipLoader color="#0077b6" size={50} /></center>
                ) : (
                  <div>
                    <label className="label">
                      Categoria:
                    </label>
                    <label className="tag is-large is-info">
                      {categoriaAtual.id > 0 ? (
                        <i className={categorias.filter(categoria => categoria.id === categoriaAtual.id)[0].icone} />
                      ) : ''}
                      {categoriaAtual.nome}
                    </label>
                  </div>
                )}
              </div>

              <div className="col">
                <label className="label">
                  Data limite:
                </label>
                <label className="tag is-large is-info">
                  <span className="icon is-large is-left"><i className="bx bx-calendar" /></span>
                  {formatarData.format(new Date(metaFinanceira.data_alvo))}

                </label>
              </div>

            </div>

            <div className="grid">
              <div className="col">
                <label className="label">
                  Saldo:
                </label>
                <label className="tag is-large is-primary">
                  {formatarValor.format(metaFinanceira.saldo_meta)}
                </label>
              </div>

              <div className="col">
                <label className="label">
                  Meta:
                </label>
                <label className="tag is-large is-danger">
                  {formatarValor.format(metaFinanceira.valor_meta)}
                </label>
              </div>
            </div>

            <div className="grid">

              <div className="col">
                <label className="label">
                  Status:  <br />
                  {((metaFinanceira.saldo_meta / metaFinanceira.valor_meta) * 100).toFixed(2)}%
                  <progress value={metaFinanceira.saldo_meta} max={metaFinanceira.valor_meta} />
                </label>
              </div>
            </div>

            <hr />

            <div className="grid">
              <div className="col">
                <button type="button" className="button" onClick={voltarPagina}><i className='bx bx-arrow-back' /> Voltar</button>
              </div>
            </div>
          </div>

          <div className="box fundo-extrato-depositos">
            <h1>Extrato de depósitos</h1>
            {isLoading ? (
              <center><ClipLoader color="#0077b6" size={50} /></center>
            ) : (
              <>
                <div className="box-extrato-depositos">
                  <label className="label">
                    <i className='bx bx-filter-alt' /> Filtrar por data
                  </label>
                  <div className="grid">
                    <div className="col">
                      <label className="label">
                        De:
                        <br />
                        <input type="date" className="input data" onChange={(e) => setDataInicial(e.target.value)} />
                      </label>
                    </div>

                    <div className="col">
                      <label className="label">
                        Até:
                        <br />
                        <input type="date" className="input data" onChange={(e) => setDataFinal(e.target.value)} />
                      </label>
                    </div>

                    <div className="col">
                      <br />
                      <button type="button" className="button is-success" onClick={handleFilter}><i className='bx bx-search-alt' /> Filtrar</button>
                    </div>
                  </div>
                </div>


                <hr />
                {depositosFinanceiros.length <= 0 ? (
                  <div className="grid box-extrato-depositos">
                    <div className="col">
                     <center>Ainda não há depositos! </center>
                    </div>
                  </div>
                ) : ""}
                {depositosFinanceiros.map((depositos) => (
                  <>
                    <div className="grid box-extrato-depositos">
                      <div className="col">
                        Valor:
                        <br />
                        <label className="label">
                          {formatarValor.format(depositos.valor)}
                        </label>
                      </div>

                      <div className="col">
                        Data:
                        <br />
                        <label className="label">
                          <i className='bx bx-calendar' /> {formatarData.format(new Date(depositos.data))}
                        </label>
                      </div>

                      <div className="col" >
                        Excluir
                        <br />
                        <button type="button" className="button" onClick={() => handleDelete(depositos.id, metaFinanceira.id)}><i className='bx bxs-trash' /></button>
                      </div>
                    </div>
                    <hr />

                  </>
                ))}
                <hr />

              </>
            )}
          </div>
        </>

      ) : ""
      }
    </div >
  );
}
