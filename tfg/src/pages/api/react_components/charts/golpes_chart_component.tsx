import React from 'react';
import { Bar } from 'react-chartjs-2';

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

const ChartGolpesGolf: React.FC<ChartComponentProps> = ({ juegos, juegoName }) => {
  const filteredJuegos = juegos.filter(juego => juego.name === juegoName);

  if (filteredJuegos.length === 0) {
    return <div>No existen datos</div>;
  }

  const dataForChart = {
    labels: filteredJuegos.map(juego => juego.dateTime),
    datasets: [
      {
        label: 'Golpes totales pelota',
        data: filteredJuegos.map(juego => juego.totalBallHit || 0),
        backgroundColor: 'rgb(19, 172, 172)',
      },
      {
        label: 'Golpes totales bomba',
        data: filteredJuegos.map(juego => juego.totalBombHit || 0),
        backgroundColor: 'rgb(236, 83, 83)',
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Golpes totales pelota vs Golpes totales bomba',
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
      y: {
        title: {
          display: true,
          text: 'Número de golpeos',
          color: 'white',
        },
      },
    },
  };

  return <Bar data={dataForChart} options={options} />;
};

export default ChartGolpesGolf;
