/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-google-charts";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

import './style.css';
import axios from "../../services/axios";
import history from "../../services/history";
import * as actionsAuth from '../../store/modules/auth/actions'

export default function GraficoCategoriaReceita() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [dadosGraf, setDadosGraf] = useState([
    ['', 'Carregando...'],
    ['Carregando...', 0]
  ])


  const mes = new Date().getMonth() + 1
  const ano = new Date().getFullYear()

  if (user) {
    try {

      useEffect(() => {
        async function getData() {
          setIsloading(true);
          const responseConta = await axios.get(`/contas/index/${user.id}`).catch((err) => {
            if (err.response.status === 401) {
              dispatch(actionsAuth.loginFailure());
            }
          })
          if (responseConta.data.length > 0) {
            const responseTransacoes = await axios.get(`/transacoes/all/${responseConta.data[0].id}`)
            const responseCategorias = await axios.get("/categorias/");

            if (responseTransacoes.data <= 0) {
              setTotalReceitas(0);
              setDadosGraf([
                ['Receitas', 'Valores em reais'],
                ['', 0]
              ])
            } else {
              // eslint-disable-next-line no-return-assign, no-param-reassign, no-lonely-if
              if (responseTransacoes.data.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano).length <= 0) {
                setTotalReceitas(0);
                setDadosGraf([
                  ['Receitas', 'Valores em reais'],
                  ['', 0]
                ])
              } else {
                // eslint-disable-next-line no-return-assign, no-param-reassign
                setTotalReceitas(responseTransacoes.data.filter((transacao) => transacao.tipo === 'Receita').filter((transacao) => new Date(transacao.data).getUTCMonth() +1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
                const objReceita = responseTransacoes.data.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano)
                  .reduce((acumulador, receita) => {
                    const categoria = { categoria_id: receita.categoria_id || 0 };

                    if (!acumulador[categoria.categoria_id]) {
                      // eslint-disable-next-line no-param-reassign
                      acumulador[categoria.categoria_id] = { total: 0, id: categoria.categoria_id }

                    }

                    // eslint-disable-next-line no-param-reassign
                    acumulador[categoria.categoria_id].total += parseFloat(receita.valor);
                    return acumulador
                  }, [])


                const dados = [["Receitas", "Valores em reais"]];

                objReceita.forEach((receita) => {
                  responseCategorias.data.forEach((categoria) => {
                    if (categoria.id === receita.id) {
                      dados.push([`${categoria.nome}`, parseFloat(receita.total)])

                    }
                  })
                })
                setDadosGraf(dados)

              }

            }

          }
          setIsloading(false);
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

  if (isLoading === true) {
    return (
      <div className="col">
        <div className="grid">
          <div className="col" />
          <div className="col">
            <ClipLoader color="#0077b6" size={30} />
          </div>
        </div>
      </div>
    )
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

  if (totalReceitas === 0) {
    return (
      <p>Faça movimentações para visualizar o gráfico corretamente.</p>
    )
  }


  return (
    <div className="col">
      <div className="grid">
        <div className="col">
          RECEITAS POR CATEGORIA
          <center>
            <Chart
              chartType="PieChart"
              data={dadosGraf}
              options={options}
              width={350}
              height={180}
            />
          </center>
        </div>
      </div>

    </div>
  )
}
