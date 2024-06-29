/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";

import './style.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          <strong>App Finance</strong> desenvolvido por: <strong>Gabriel Costa Lopes</strong>
        </p>
        <hr />
        <p className=""><i className='bx bxl-instagram' /> Gabriel_costa_lopes | <i className='bx bxl-facebook' /> Gabriel Costa Lopes | <i className='bx bxs-envelope' /> Gabrielcostaplay@gmail.com | <i className='bx bxs-phone' /> 11 99343-5336</p>
      </div>
    </footer>
  )
}
