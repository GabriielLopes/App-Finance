/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-google-charts";

import ClipLoader from "react-spinners/ClipLoader";

import './style.css';
import axios from "../../services/axios";


export default function Grafico() {
  const user = useSelector((state) => state.auth.user);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0)
  const [isLoading, setIsLoading] = useState(false);

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const mes = new Date().getMonth() + 1
  const ano = new Date().getFullYear()

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const responseConta = await axios.get(`/contas/index/${user.id}`);
        const responseTransacoes = await axios.get(`/transacoes/all/${responseConta.data[0].id}`);
        setTotalReceitas(responseTransacoes.data.filter((transacao) => transacao.tipo === 'Receita').filter((transacao) => new Date(transacao.data).getUTCMonth() +1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
        setTotalDespesas(responseTransacoes.data.filter((transacao) => transacao.tipo === 'Despesa').filter((transacao) => new Date(transacao.data).getUTCMonth() +1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false)
        setTotalReceitas(0);
        setTotalDespesas(0);
      }
    }
    getData();
  }, [totalDespesas, totalReceitas])

  if (isLoading === true) {
    return (
      <div className="box">
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
    colors: ["red", "blue"],
    legend: 'none',
    gridLines: {
      horizontal: false,
      vertical: false,
    },
    animation: {
      duration: 500,
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
              data={[
                ['Balanço mensal', 'Despesas', 'Receitas'],
                ['', parseFloat(parseFloat(totalDespesas).toFixed(2)), parseFloat(totalReceitas)],
              ]}
              options={options}
              width={300}
              height={180}
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
