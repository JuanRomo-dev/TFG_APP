import React from 'react';
import { Line } from 'react-chartjs-2';

interface Juego {
  _id: string;
  angle: number;
  gameTime: number;
  name: string;
  playerId: string;
  totalReps: number;
  totalSeries: number;
  totalScore: number;
  totalBallHit?: number;
  totalBombHit?: number;
  rawInput: string[];
  completed: boolean;
  dateTime: string;
}

interface ChartComponentProps {
  juegos: Juego[];
  juegoName: string;
}

const ChartJump: React.FC<ChartComponentProps> = ({ juegos, juegoName }) => {
  const filteredJuegos = juegos.filter(juego => juego.name === juegoName);

  if (filteredJuegos.length === 0) {
    return <div>No existen datos</div>;
  }

  const dataForChart = {
    labels: filteredJuegos.map(juego => juego.dateTime),
    datasets: [
      {
        label: 'Número de Repeticiones Totales',
        data: filteredJuegos.map(juego => juego.totalReps),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Número de Repeticiones Totales - Jump Game',
        font: {
          size: 15,
        },
        color: 'white',
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
          color: 'white',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Repeticiones Totales',
          color: 'white',
        },
      },
    },
  };

  return <Line data={dataForChart} options={options} />;
};

export default ChartJump;
