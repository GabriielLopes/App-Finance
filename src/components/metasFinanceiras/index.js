/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

import AddMetasFinanceiras from "../addMetasFinanceiras";
import './style.css';
import axios from "../../services/axios";
import history from "../../services/history";
import * as actionsMetas from '../../store/modules/editMetasFin/actions';
import EditMetasFinanceiras from "../editMetasFinanceiras";
import DepositarMetasFinanceiras from "../depositarMetasFinanceiras/index";
import DetalhesMetasFinanceiras from '../detalhesMetasFinanceiras/index';


export default function MetasFinanceiras() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [metasFinanceiras, setMetasFinanceiras] = useState([]);
  const [metasFinanceirasBase, setMetasFinanceirasBase] = useState([]);
  const [conta, setConta] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const formatarData = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  useEffect(() => {
    async function getData() {
      try {
        if (user.id) {
          setIsLoading(true)
          const response = await axios.get(`/metas-financeiras/${user.id}`)
          setMetasFinanceiras(response.data.filter(metaFinanceira => parseFloat(metaFinanceira.saldo_meta) < parseFloat(metaFinanceira.valor_meta)));
          setMetasFinanceirasBase(response.data);
          const responseConta = await axios.get(`/contas/index/${user.id}`);
          setConta(responseConta.data)
          setIsLoading(false)
        }
      } catch (error) {
        setMetasFinanceiras([]);
        setConta(0);
        setIsLoading(false);
      }
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const response = await axios.get('/categorias/');
        setCategorias(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setCategorias([]);
      }
    }
    getData();
  }, [])


  function handleDelete(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Você tem certeza?',
      text: 'Se continuar, você não poderá mais voltar atrás!',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`metas-financeiras/${id}`)
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Objetivo deletado com sucesso!',
          showConfirmButton: true,
        }).then((resul) => {
          if (resul.isConfirmed) {
            history.go('/');
          }
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="">
        <div className="grid">
          <div className="col" />
          <div className="col">
            <ClipLoader color="#0077b6" size={30} />
          </div>
        </div>
      </div>
    )
  }


  if (conta.length <= 0) {
    return (

      <>
        <div className="grid">
          <div className="col" >
            <p className="label">
              Cadastre sua conta para começar a definir seus objetivos financeiros!
              <br />
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="col" />
          <div className="col">
            <i className='bx bx-rocket' />
          </div>
          <div className="col" />
        </div>

      </>
    )
  }

  function handleFilterChange(e) {
    const valor = e.target.value;

    if (valor === 'Pendentes') {
      setMetasFinanceiras(metasFinanceirasBase.filter(metaFinanceira => parseFloat(metaFinanceira.saldo_meta) < parseFloat(metaFinanceira.valor_meta)));
    } else if (valor === 'Concluídas') {
      setMetasFinanceiras(metasFinanceirasBase.filter(metaFinanceira => parseFloat(metaFinanceira.saldo_meta) >= parseFloat(metaFinanceira.valor_meta)))
    } else if (valor === 'Todas') {
      setMetasFinanceiras(metasFinanceirasBase);
    }
  }
  return (
    <div>
      <EditMetasFinanceiras />
      <DepositarMetasFinanceiras />
      <DetalhesMetasFinanceiras />
      <AddMetasFinanceiras />
      <h1>Objetivos financeiros <i className='bx bx-bullseye' /> </h1>
      <hr />
      <div className="grid">
        <div className="col">
          <button type="button" className="button" onClick={() => dispatch(actionsMetas.novaMetaRequest())}>
            <i className='bx bx-plus' /> Novo
          </button>
        </div>

        <div className="col">
          <p className="control has-icons-left">
            <select className="input" onChange={handleFilterChange}>
              <option value="Pendentes">Pendentes</option>
              <option value="Concluídas">Concluídas</option>
              <option value="Todas">Todas</option>
            </select>
            <span className="icon is-large is-left"><i className="bx bx-filter" /></span>
          </p>
        </div>
      </div>
      <div className="grid">
        {metasFinanceiras.length <= 0 ? (

          <center>
            <p>Ainda não há objetivos para exibir! <i className='bx bx-confused' /></p>
          </center>

        ) : (
          <>
            {metasFinanceiras.map((metaFinanceira) => (
              <div className="col">
                <div className="box">
                  <div className="grid">
                    <div className="col">
                      <h4 className="title"><i className={categorias.filter(categoria => categoria.id === parseFloat(metaFinanceira.categoria_id))[0].icone} /> {metaFinanceira.descricao}</h4>
                    </div>

                    <div className="col">
                      <p>Data final do objetivo: <label className="label"> <i className='bx bx-calendar' /> {formatarData.format(new Date(metaFinanceira.data_alvo))}</label> </p>
                    </div>
                  </div>

                  < hr />
                  <div className="grid">
                    <div className="col">
                      {formatarValor.format(metaFinanceira.saldo_meta)} / {formatarValor.format(metaFinanceira.valor_meta)}
                    </div>
                  </div>

                  <label className="label">{((metaFinanceira.saldo_meta / metaFinanceira.valor_meta) * 100).toFixed(2)} %</label>
                  <progress value={metaFinanceira.saldo_meta} max={metaFinanceira.valor_meta} />

                  <br />
                  <div className="botoes-meta">
                    <button type="button" className="button" onClick={() => dispatch(actionsMetas.verMetasRequest({ metaFinanceira }))}><i className='bx bxs-pencil' />
                      <p className="tooltip">Editar</p>
                    </button>
                    <button type="button" className="button" onClick={() => dispatch(actionsMetas.depositarMetasRequest({ metaFinanceira }))}><i className='bx bx-plus' />
                      <label>
                        <p className="tooltip">Depositar</p>
                      </label>
                    </button>
                    <button type="button" className="button" onClick={() => handleDelete(metaFinanceira.id)}><i className='bx bxs-trash' />
                      <p className="tooltip">Excluir</p>
                    </button>
                    <button type="button" className="button" onClick={() => dispatch(actionsMetas.verDetalhesMetasRequest({ metaFinanceira }))}><i className='bx bx-detail' />
                      <p className="tooltip">Detalhes...</p>
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </>

        )}
      </div>
    </div>
  )
}
