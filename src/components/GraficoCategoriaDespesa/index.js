import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";
import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from 'prop-types';

import './style.css';

const ano = new Date().getFullYear()

export default function GraficoCategoriaDespesa({ mes, transacoes, categorias }) {
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dadosGraf, setDadosGraf] = useState([
    ['', 'Carregando...'],
    ['Carregando...', 0]
  ])

  function mesAtual() {
    switch (mes) {
      case 1: {
        return "Janeiro"
      }

      case 2: {
        return "Feveiro"
      }

      case 3: {
        return "Março"
      }

      case 4: {
        return "Abril"
      }

      case 5: {
        return "Maio"
      }

      case 6: {
        return "Junho"
      }

      case 7: {
        return "Julho"
      }

      case 8: {
        return "Agosto"
      }

      case 9: {
        return "Setembro"
      }

      case 10: {
        return "Outubro"
      }

      case 11: {
        return "Novembro"
      }

      case 12: {
        return "Dezembro"
      }

      default: {
        return mes
      }
    }
  }
  // Inserir dados no gráfico
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      // eslint-disable-next-line no-return-assign, no-param-reassign
      setTotalDespesas(transacoes.filter((transacao) => transacao.tipo === 'Despesa').filter((transacao) => new Date(transacao.data).getUTCMonth() + 1 === mes).map((transacao) => parseFloat(transacao.valor)).reduce((acumulador, valores) => acumulador += valores, 0))
      const objDespesa = transacoes.filter((transacao) => transacao.tipo === 'Despesa' && new Date(transacao.data).getUTCMonth() + 1 === mes && new Date(transacao.data)).filter((transacao) => new Date(transacao.data).getFullYear() === ano)
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
        categorias.forEach((categoria) => {
          if (categoria.id === despesa.id) {
            dados.push([`${categoria.nome}`, parseFloat(despesa.total)])

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
    backgroundColor: 'transparent',
    legendTextColor: document.querySelector('.theme-light') ? 'black' : 'white',
    pieSlice: 0.8,
    slices: {
      1: { offset: 0.1 },
      3: { offset: 0.2 },
      5: { offset: 0.2 },
      6: { offset: 0.1 },
    },
  }

  if (totalDespesas === 0) {
    return (
      <center>
        <p>Não há nenhuma despesa no mês {mesAtual()}.</p>
      </center>
    )
  }

  return (
    <div className="col">
      <div className="grid">
        <div className="col">
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

GraficoCategoriaDespesa.defaultProps = {
  mes: new Date().getUTCMonth() + 1,
  transacoes: [],
  categorias: []
}

GraficoCategoriaDespesa.propTypes = {
  mes: PropTypes.number,
  transacoes: PropTypes.arrayOf,
  categorias: PropTypes.arrayOf,
}
