/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from 'prop-types';

import './style.css';

export default function GraficoCategoriaReceita({ mes, transacoes, categorias }) {
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dadosGraf, setDadosGraf] = useState([
    ['', 'Carregando...'],
    ['Carregando...', 0]
  ])

  const ano = new Date().getFullYear()

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      // eslint-disable-next-line no-return-assign, no-param-reassign
      setTotalReceitas(transacoes.filter((transacao) => transacao.tipo === 'Receita').filter((transacao) => new Date(transacao.data).getUTCMonth() + 1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
      const objReceita = transacoes.filter((transacao) => transacao.tipo === 'Receita' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano)
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
        categorias.forEach((categoria) => {
          if (categoria.id === receita.id) {
            dados.push([`${categoria.nome}`, parseFloat(receita.total)])

          }
        })
      })
      setDadosGraf(dados)
      setIsLoading(false);
    }
    getData()
  }, [mes, transacoes])

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

GraficoCategoriaReceita.defaultProps = {
  mes: new Date().getUTCMonth() + 1,
  transacoes: [],
  categorias: []
}

GraficoCategoriaReceita.propTypes = {
  mes: PropTypes.number,
  transacoes: PropTypes.arrayOf,
  categorias: PropTypes.arrayOf,
}
