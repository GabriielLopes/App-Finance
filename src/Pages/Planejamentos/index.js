import React from "react";

import MetasFinanceiras from "../../components/metasFinanceiras";
import PlanejamentoMensal from "../../components/planejamentoMensal";
import Footer from "../../components/Footer";

export default function Planejamentos() {

  return (
    <div className="pages_content">
      <h1 className='title'>Planejamentos <i className='bx bxs-directions' /></h1>
      <hr className='hr' />

      <div className='grid'>
        <div className='col'>
          <div className='box'>
            <MetasFinanceiras />
          </div>
        </div>
        <div className='col'>
          <PlanejamentoMensal />
        </div>
      </div>
      <Footer />
    </div>

  )
}
