/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import Swal from "sweetalert2";

import './style.css';
import axios from "../../services/axios";
import history from "../../services/history";
import * as actionsAuth from '../../store/modules/auth/actions'

const mes = new Date().getMonth() + 1
const ano = new Date().getFullYear()

export default function GraficoCategoriaDespesa() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [dadosGraf, setDadosGraf] = useState([
    ['', 'Carregando...'],
    ['Carregando...', 0]
  ])

  /* const formatarValor = new Intl.NumberFormat('pt-BR', {
     style: 'currency',
     currency: 'BRL',
   }) */


  if (user) {
    try {

      useEffect(() => {
        async function getData() {
          const responseConta = await axios.get(`/contas/index/${user.id}`).catch((err) => {
            if (err.response.status === 401) {
              dispatch(actionsAuth.loginFailure());
            }
          })
          if (responseConta.data.length > 0) {
            const responseTransacoes = await axios.get(`/transacoes/all/${responseConta.data[0].id}`)
            const responseCategorias = await axios.get("/categorias/");

            if (responseTransacoes.data <= 0) {
              setTotalDespesas(0)
            } else if (responseTransacoes.data.filter((transacao) => transacao.tipo === 'Despesa') <= 0) {
              setTotalDespesas(0)
            } else {
              // eslint-disable-next-line no-return-assign, no-param-reassign
              setTotalDespesas(responseTransacoes.data.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores))
            }


            const objDespesa = responseTransacoes.data.filter((transacao) => transacao.tipo === 'Despesa')
              .reduce((acumulador, despesa) => {
                const categoria = { categoria_id: despesa.categoria_id || 0 };

                if (!acumulador[categoria.categoria_id]) {
                  // eslint-disable-next-line no-param-reassign
                  acumulador[categoria.categoria_id] = { total: 0, id: categoria.categoria_id }

                }

                // eslint-disable-next-line no-param-reassign
                acumulador[categoria.categoria_id].total += parseFloat(despesa.valor);
                return acumulador
              }, [])


            const dados = [["Despesas", "Valores em reais"]];

            objDespesa.forEach((despesa) => {
              responseCategorias.data.forEach((categoria) => {
                if (categoria.id === despesa.id) {
                  dados.push([`${categoria.nome}`, parseFloat(despesa.total)])

                }
              })
            })
            setDadosGraf(dados)
          }
        }
        getData()
      }, [])
    } catch (error) {

      const { status } = error.response;

      if (status === 401) {

        dispatch(actionsAuth.loginFailure());
        Swal.fire({
          icon: 'error',
          title: 'Sessão expirada!',
          text: 'Seu login expirou, faça login novamente para acessar sua conta.'
        });
        history.go('/login');
      }
    }
  }

  const options = {
    pieSliceTextStyle: {
      color: document.querySelector('.theme-light') ? 'black' : 'white',
    },
    legend: 'true',
    backgroundColor: 'transparent',
    legendTextColor: document.querySelector('.theme-light') ? 'black' : 'white',
    is3d: true,
    pieHole: 0.5,
  }

  if (totalDespesas === 0) {
    return (
      <p>Cadastre sua conta e <br />faça movimentações para ver os relatórios!</p>
    )
  }

  return (
    <div className="col">
      <div className="grid">
        <div className="col">
          DESPESAS POR CATEGORIA
          <Chart
            chartType="PieChart"
            data={dadosGraf}
            options={options}
            width="auto"
            height="auto"
          />
        </div>
      </div>
    </div>
  )
}
