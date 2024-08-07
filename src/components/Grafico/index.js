/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import PropTypes from 'prop-types';

import ClipLoader from "react-spinners/ClipLoader";

import './style.css';


export default function Grafico({ mes, transacoes }) {
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0)
  const [isLoading, setIsLoading] = useState(false);

  const formatarValor = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const ano = new Date().getFullYear()



  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        setTotalReceitas(transacoes.filter((transacao) => transacao.tipo === 'Receita').filter((transacao) => new Date(transacao.data).getUTCMonth() + 1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
        setTotalDespesas(transacoes.filter((transacao) => transacao.tipo === 'Despesa').filter((transacao) => new Date(transacao.data).getUTCMonth() + 1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
        setIsLoading(false);
      } catch (error) {
        setTotalReceitas(0);
        setTotalDespesas(0);
        setIsLoading(false)
      }
    }
    getData();
  }, [mes, transacoes])

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

Grafico.defaultProps = {
  mes: new Date().getUTCMonth() + 1,
  transacoes: []
}

Grafico.propTypes = {
  mes: PropTypes.number,
  transacoes: PropTypes.arrayOf,
}
