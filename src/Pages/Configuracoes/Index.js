/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';


import './style.css';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import CategoriaConfig from '../../components/categoriaConfig';
import ContaConfig from '../../components/contaConfig';
import axios from "../../services/axios";
import Loading from '../../components/Loading';
import Footer from '../../components/Footer/index';

export default function Configuracoes() {
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [configuracoesCategoria, setconfiguracoesCategoria] = useState(false);
  const [configuracoesConta, setConfiguracoesConta] = useState(false);
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
          setEditarConfig(false);
        }
      })
    } catch (error) {
      return Swal.fire({ title: 'error', text: error })
    }
  }

  return (
    <div className='pages_content'>
      <Loading isLoading={isLoading} />
      <h1 className='title'>Configurações e cadastros </h1>
      <div className='grid'>
        <div className='col'>
          <div className='box'>
            <h1>Cadastros</h1>
            <button className='button btnCategoria' type='button' onClick={() => setconfiguracoesCategoria(!configuracoesCategoria)}>Categorias</button>
            <button className='button btnConta' type='button' onClick={() => setConfiguracoesConta(!configuracoesConta)} >Conta bancária</button>
          </div>
        </div>

        <div className='col content'>

          <CategoriaConfig configuracoesCategoria={configuracoesCategoria} />

          <ContaConfig configuracoesConta={configuracoesConta} />

        </div>
      </div>
      <div className='grid'>
        <div className='col'>
          <div className='box'>
            <h1><i className='bx bxs-cog' /> Configurações</h1>
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
                <>
                  <button type='button' className='button is-success' onClick={handleSubmit} >
                    <i className='bx bxs-save' />
                    Salvar alterações
                  </button>

                  <button type='button' className='button is-danger' onClick={() => setEditarConfig(!editarConfig)}>
                    <i className='bx bx-x' />
                    Cancelar
                  </button>
                </>
              ) : (
                <button type='button' className='button is-primary' onClick={() => setEditarConfig(!editarConfig)}>
                  <i className='bx bxs-edit' />
                  Editar
                </button>

              )}

            </div>
          </div>
        </div>

        <div className='col' />
      </div>
      <Footer />
    </div>
  );
}
