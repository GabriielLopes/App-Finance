/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import Swal from "sweetalert2";

import './style.css';
import axios from "../../services/axios";
import history from "../../services/history";
import * as actionsAuth from '../../store/modules/auth/actions'

export default function Grafico() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0)
  const [dadosGraf, setDadosGraf] = useState([
    ['', 'Carregando...'],
    ['Carregando...', 0]
  ])

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const mes = new Date().getMonth() + 1
  const ano = new Date().getFullYear()

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
            if (responseTransacoes.data <= 0) {
              setTotalReceitas(0)
              setTotalDespesas(0)
              setDadosGraf([
                ['Financeiro', 'Receitas', 'Despesas'],
                ['', totalReceitas, totalDespesas]
              ])
            } else {
              if (responseTransacoes.data.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getMonth() + 1 === mes && new Date(transacao.data).getFullYear() === ano).length <= 0) {
                setTotalReceitas(0);
              } else {

                // eslint-disable-next-line no-return-assign, no-param-reassign
                setTotalReceitas(responseTransacoes.data.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores))
              }

              if (responseTransacoes.data.filter((transacao) => transacao.tipo === 'Despesa') <= 0) {
                setTotalDespesas(0);
              } else {
                // eslint-disable-next-line no-return-assign, no-param-reassign
                setTotalDespesas(responseTransacoes.data.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores))
              }

              setDadosGraf([
                ['Financeiro', 'Receitas', 'Despesas'],
                ['', parseFloat(totalReceitas), parseFloat(totalDespesas)],
              ])
            }
          }
        }
        getData()
      }, [totalReceitas, totalDespesas])
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
    colors: ["blue", "red"],
    legend: 'none',
    gridLines: {
      horizontal: false,
      vertical: false,
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true,
    },
    backgroundColor: 'transparent',
    titleColor: document.querySelector('.theme-light') ? 'black' : 'white',
    legendTextColor: document.querySelector('.theme-light') ? 'black' : 'white',
    title: `BALANÇO PATRIMONIAL ${mes}/${ano}`
  }

  if (totalDespesas === 0 && totalReceitas === 0) {
    return (<></>)
  }


  return (
    <div className="col">
      <div className="box">
        <div className="grid">
          <div className="col">
            <Chart
              chartType="ColumnChart"
              data={dadosGraf}
              options={options}
              width="auto"
              height="auto"
            />
          </div>
          <div className="col">
            <p className="p">
              Receitas: {formatarValor.format(totalReceitas)} <br />
              Despesas: {formatarValor.format(totalDespesas)}
              <hr className="hr" />
              <p className="label">
                Balanço: {formatarValor.format(totalReceitas - totalDespesas)}
              </p>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
