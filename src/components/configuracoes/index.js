/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Swal from "sweetalert2";

import './style.css';
import * as actionsConfig from '../../store/modules/configuracoes/actions';

import axios from "../../services/axios";
import history from "../../services/history";
import Loading from "../Loading";

export default function Configuracoes() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const editConfig = useSelector((state) => state.configuracoes.editConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [editarConfig, setEditarConfig] = useState(false);
  const [idConfig, setIdConfig] = useState('');
  const [verGrafReceita, setVerGrafReceita] = useState('');
  const [verGrafDespesa, setVerGrafDespesa] = useState('');
  const [verBalanMensal, setVerBalanMensal] = useState('');
  const [verTotalDespesas, setVerTotalDespesas] = useState('');
  const [verTotalReceitas, setVerTotalReceitas] = useState('');
  const [verSaldo, setVerSaldo] = useState('');

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`/user-config/${user.id}`);
      setIdConfig(response.data[0].id)
      setVerGrafReceita(response.data[0].verGrafReceita)
      setVerGrafDespesa(response.data[0].verGrafDespesa)
      setVerBalanMensal(response.data[0].verBalanMensal)
      setVerTotalDespesas(response.data[0].verTotalDespesas)
      setVerTotalReceitas(response.data[0].verTotalReceitas)
      setVerSaldo(response.data[0].verSaldo)
    }
    getData()
  }, [])

  if (editConfig) {
    const divConfig = document.querySelector('.configuracoes');
    if (divConfig) {
      divConfig.classList = 'configuracoes active';
    }
  } else {
    const divConfig = document.querySelector('.configuracoes');
    if (divConfig) {
      divConfig.classList = 'configuracoes';
    }
  }

  // eslint-disable-next-line consistent-return
  async function handleSubmit() {
    try {
      setIsLoading(true)
      await axios.put(`/user-config/${idConfig}`, {
        verGrafReceita,
        verGrafDespesa,
        verBalanMensal,
        verTotalDespesas,
        verTotalReceitas,
        verSaldo
      })
      setIsLoading(false)
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Configurações alteradas!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          history.go('/');
          setEditarConfig(false);
        }
      })
    } catch (error) {
      return Swal.fire({ title: 'error', text: error })
    }
  }

  return (
    <div className="configuracoes">
      <div className='box'>
        <center><h1 className="title"><i className='bx bxs-cog' /> Configurações</h1></center>
        <Loading isLoading={isLoading} />
        <br />
        <div className="control">
          Ver gráfico de receitas por categorias: <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verGrafReceita} onChange={() => setVerGrafReceita(true)} checked={verGrafReceita === true} /> Sim
          </label>

          <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verGrafReceita} onChange={() => setVerGrafReceita(false)} checked={verGrafReceita === false} /> Não
          </label>
        </div>
        <hr className='hr' />

        <div className="control">
          Ver gráfico de despesas por categorias: <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verGrafDespesa} onChange={() => setVerGrafDespesa(true)} checked={verGrafDespesa === true} /> Sim
          </label>

          <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verGrafDespesa} onChange={() => setVerGrafDespesa(false)} checked={verGrafDespesa === false} name="answer" /> Não
          </label>
        </div>
        <hr className='hr' />

        <div className="control">
          Ver balanço mensal: <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verBalanMensal} onChange={() => setVerBalanMensal(true)} checked={verBalanMensal === true} /> Sim
          </label>
          <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verBalanMensal} onChange={() => setVerBalanMensal(false)} checked={verBalanMensal === false} /> Não
          </label>
        </div>
        <hr className='hr' />

        <div className="control">
          Ver total despesas: <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verTotalDespesas} onChange={() => setVerTotalDespesas(true)} checked={verTotalDespesas === true} /> Sim
          </label>

          <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verTotalDespesas} onChange={() => setVerTotalDespesas(false)} checked={verTotalDespesas === false} /> Não
          </label>
        </div>
        <hr className='hr' />

        <div className="control">
          Ver total receitas: <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verTotalReceitas} onChange={() => setVerTotalReceitas(true)} checked={verTotalReceitas === true} /> Sim
          </label>
          <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verTotalReceitas} onChange={() => setVerTotalReceitas(false)} checked={verTotalReceitas === false} /> Não
          </label>
        </div>
        <hr className='hr' />

        <div className="control">
          Ver saldo: <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verSaldo} onChange={() => setVerSaldo(true)} checked={verSaldo === true} /> Sim
          </label>

          <label className="radio">
            <input type="radio" disabled={!editarConfig} value={verSaldo} onChange={() => setVerSaldo(false)} checked={verSaldo === false} /> Não
          </label>
          <br />
          <br />

          {editarConfig ? (
            <div className="grid">
              <button type='button' className='button is-success' onClick={handleSubmit} >
                <i className='bx bxs-save' />
                Salvar alterações
              </button>

              <button type='button' className='button is-danger' onClick={() => setEditarConfig(!editarConfig)}>
                <i className='bx bx-x' />
                Cancelar
              </button>
            </div>
          ) : (
            <div className="grid">
              <button type='button' className='button is-primary' onClick={() => setEditarConfig(!editarConfig)}>
                <i className='bx bxs-edit' />
                Editar
              </button>

              <button type="button" className="button is-danger" onClick={() => dispatch(actionsConfig.editConfigRequest())}><i className="bx bx-x" /> Fechar</button>
            </div>

          )}

        </div>
      </div>
    </div>
  )
}
