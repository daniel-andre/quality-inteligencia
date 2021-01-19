import React from 'react';
import './css/Content.css';
import Chart from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faMapMarker,
  faClock,
  faUserFriends,
  faEye,
  faCar,
  faArrowUp,
  faArrowDown,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faMapMarker,
  faClock,
  faUserFriends,
  faEye,
  faCar,
  faArrowUp,
  faArrowDown,
  faExchangeAlt,
);

const Content = () => {
  const [aprovacao, setAprovacao] = React.useState(null);
  const [acessos, setAcessos] = React.useState(null);
  const [arrayDatas, setArrayDatas] = React.useState([]);
  const [arrayQuantidadeAcesso, setArrayQuantidadeAcesso] = React.useState([]);
  const [agenda, setAgenda] = React.useState(null);

  React.useEffect(() => {
    const agenda = async () => {
      try {
        const url = await fetch(
          'https://sagris.com.br/teste-front/api/scheduled',
        );
        const response = await url.json();
        setAgenda(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    agenda();
  }, []);

  React.useEffect(() => {
    const aprovacao = async () => {
      try {
        const url = await fetch(
          'https://sagris.com.br/teste-front/api/access-approval',
        );
        const response = await url.json();
        setAprovacao(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    aprovacao();
  }, []);

  React.useEffect(() => {
    const acessos = async () => {
      try {
        const url = await fetch(
          'https://sagris.com.br/teste-front/api/last-access',
        );
        const response = await url.json();
        setAcessos(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    acessos();
  }, []);

  React.useEffect(() => {
    const indicador = async () => {
      try {
        const url = await fetch(
          'https://sagris.com.br/teste-front/api/access-indicator',
        );
        const response = await url.json();
        const auxArray = Object.keys(response.data.access_indicator);
        setArrayDatas(auxArray);

        auxArray.map((item) => {
          return setArrayQuantidadeAcesso((items) => [
            ...items,
            response.data.access_indicator[item].length,
          ]);
        });
      } catch (error) {
        console.log(error);
      }
    };
    indicador();
  }, []);

  React.useEffect(() => {
    const ctx = document.getElementById('myChart').getContext('2d');
    ctx.height = 290;
    if (window.myCharts !== undefined) window.myCharts.destroy();
    window.myCharts = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...arrayDatas],
        datasets: [
          {
            lineTension: 0,
            label: 'Quantidade', // Name the series
            data: [...arrayQuantidadeAcesso], // Specify the data values array
            fill: true,
            borderColor: '#143047', // Add custom color border (Line)
            backgroundColor: '#1ad0d0', // Add custom color background (Points and Fill)
            borderWidth: 3, // Specify bar border width
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day',
                unitStepSize: 1,
                tooltipFormat: 'DD/MM',
                displayFormats: {
                  day: 'DD/MM',
                },
              },
            },
          ],
        },
      },
    });
  }, [arrayDatas, arrayQuantidadeAcesso]);

  function addZero(value) {
    let final;
    value < 10 ? (final = '0' + value) : (final = value);
    return final;
  }

  const limpaData = (data) => {
    const novaData = new Date(data);
    return (
      <>
        <span>
          {addZero(novaData.getHours())}:{addZero(novaData.getMinutes())}
        </span>
        <span>
          {addZero(novaData.getDate())}/{addZero(novaData.getMonth() + 1)}/
          {novaData.getFullYear()}
        </span>
      </>
    );
  };

  const limpaNome = (nome, length) => {
    const nomeLength = nome.split(' ').length;
    if (nomeLength >= length) {
      return nome
        .split(' ')
        .slice(0, length - 1)
        .join(' ');
    } else {
      return nome;
    }
  };

  const limpaStatus = (nome) => {
    const lowerCase = nome.toLowerCase();
    const firstLetterUpperCase = lowerCase.charAt(0).toUpperCase();
    return firstLetterUpperCase + lowerCase.slice(1);
  };

  const verificaStatus = (status) => {
    if (status === 'Entrega') {
      return (
        <>
          <FontAwesomeIcon icon={faCar} />
          {status}
        </>
      );
    } else if (status === 'Entrada_saida') {
      return (
        <>
          <FontAwesomeIcon icon={faExchangeAlt} />
          {status}
        </>
      );
    } else if (status === 'Saida') {
      return (
        <>
          <FontAwesomeIcon icon={faArrowDown} />
          {status}
        </>
      );
    } else if (status === 'Entrada') {
      return (
        <>
          <FontAwesomeIcon icon={faArrowUp} />
          {status}
        </>
      );
    } else {
      return status;
    }
  };

  return (
    <main>
      <h3 className="main-title">Home</h3>
      <section className="container">
        <table>
          <caption className="table-title">Aprovação de acesso</caption>
          <div>
            {aprovacao !== null &&
              aprovacao.access_approval.map(
                ({ id, name, avatar, room, type_user, dh_access }) => (
                  <tr key={id}>
                    <td>
                      <img src={avatar} alt={name} />
                    </td>
                    <td className="td-name">
                      <span className="table-name">{limpaNome(name, 4)}</span>
                      <span>{limpaStatus(type_user)}</span>
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon icon={faMapMarker} />
                      Sala {room}
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon icon={faClock} />
                      {limpaData(dh_access)}
                    </td>
                    <td className="text-right">
                      <button>DECIDIR</button>
                    </td>
                  </tr>
                ),
              )}
          </div>
        </table>
        <table>
          <caption className="table-title">Últimos Acessos</caption>
          <div>
            {acessos !== null &&
              acessos.last_access.map(
                ({
                  id,
                  name,
                  avatar,
                  approved_by,
                  status,
                  dependents,
                  dh_access,
                }) => (
                  <tr key={id}>
                    <td>
                      <img src={avatar} alt={name} />
                    </td>
                    <td className="td-name">
                      <span className="table-name">{limpaNome(name, 4)}</span>
                      <span>Aprovado por: {limpaNome(approved_by, 3)}</span>
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon icon={faUserFriends} />
                      {dependents.length ? dependents.length : '-'}
                    </td>
                    <td className="text-center">
                      {verificaStatus(limpaStatus(status))}
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon icon={faClock} />
                      {limpaData(dh_access)}
                    </td>
                    <td className="text-right">
                      <button>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                  </tr>
                ),
              )}
          </div>
        </table>
        <table>
          <caption className="table-title">Programados</caption>
          <div className="table-agenda">
            {agenda !== null &&
              agenda.scheduled.map(
                ({ id, name, avatar, type_user, dh_access }) => (
                  <tr key={id}>
                    <td>
                      <img src={avatar} alt={name} />
                    </td>
                    <td className="td-name">
                      <span className="table-name">{limpaNome(name, 4)}</span>
                      <span>{limpaStatus(type_user)}</span>
                    </td>
                    <td className="text-center">{limpaData(dh_access)}</td>
                  </tr>
                ),
              )}
          </div>
        </table>
        {arrayDatas && arrayQuantidadeAcesso && (
          <div className="table-canvas">
            <p className="table-title">Últimos Acessos</p>
            <canvas id="myChart"></canvas>
          </div>
        )}
      </section>
    </main>
  );
};

export default Content;
