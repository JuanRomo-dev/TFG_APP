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

const ChartPuntosJump: React.FC<ChartComponentProps> = ({ juegos, juegoName }) => {
  const filteredJuegos = juegos.filter(juego => juego.name === juegoName);

  if (filteredJuegos.length === 0) {
    return <div>No existen datos</div>;
  }

  const dataForChart = {
    labels: filteredJuegos.map(juego => juego.dateTime),
    datasets: [
      {
        label: 'Puntuación total por sesión de juego',
        data: filteredJuegos.map(juego => juego.totalScore),
        borderColor: 'rgb(255, 255, 255)',
        backgroundColor: 'rgb(135, 206, 250)',
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Puntuación del paciente según la sesión',
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
          text: 'Puntuación total',
          color: 'white',
        },
      },
    },
  };

  return <Line data={dataForChart} options={options} />;
};

export default ChartPuntosJump;
