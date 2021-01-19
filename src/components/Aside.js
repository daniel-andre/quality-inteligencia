import React from 'react';
import './css/Aside.css';
import logo from '../logo.png';

const Aside = () => {
  return (
    <aside>
      <header>
        <div className="header-aside">
          <img src={logo} alt="Logo" />
          <p>Empresa A - Sala 210</p>
          <p>João Alves</p>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Agendamentos</a>
            </li>
            <li>
              <a href="#">Cadastros</a>
            </li>
            <li>
              <a href="#">Report</a>
            </li>
            <li>
              <a href="#">Sair</a>
            </li>
          </ul>
        </nav>
      </header>
    </aside>
  );
};

export default Aside;
