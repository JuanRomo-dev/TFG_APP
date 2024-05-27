import { color } from 'chart.js/helpers';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

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

interface DatosCrudo {
  _id: string;
  angle: number;
  playerId: string;
  timeStamp: number;
}

interface ChartComponentProps {
  juegos: Juego[];
  juegoName: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  juegos,
  juegoName,
}) => {
  const [filteredJuegos, setFilteredJuegos] = useState<Juego[]>([]);
  const [rawData, setRawData] = useState<DatosCrudo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('useEffecttt');
    console.log('Juegos', juegos);
    const fetchRawData = async (rawInputIds: string[]) => {
      try {
        const response = await fetch('/api/mongodb/leer_datosCrudo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rawInputIds }),
        });

        console.log('response', response);
        const data = await response.json();
        console.log('Datos crudos', data);
        setRawData(data);
        setIsLoading(false);
      } catch (error) {
        console.log('Error al obtener los datos crudos', error);
      }
    };

    console.log('juegoss', juegos);
    console.log('juegoName', juegoName);
    const filtered = juegos.filter((juego) => juego.name === juegoName);
    console.log('filtered', filtered);
    setFilteredJuegos(filtered);

    if (filtered.length > 0) {
      const rawInputIds = filtered.flatMap((juego) => juego.rawInput);
      fetchRawData(rawInputIds);
    }
  }, [juegos, juegoName]);

  const dataForChart = {
    text: 'Ángulo vs Tiempo',
    labels: rawData.map((d) => Math.trunc(d.timeStamp)),
    datasets: [
      {
        label: 'Ángulo',
        data: rawData.map((d) => d.angle),
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
      text: 'Progresión del movimiento en el tiempo',
      font: {
        size: 15 
      },
      color: 'white'
    },
    legend: {
      display: false 
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Tiempo (En segundos)',
        color: 'white'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Ángulo (En grados)',
        color: 'white'
      }
    },
  
  }
};


  return isLoading ? <div>Cargando...</div> : <Line className='w-4/5 h-[400px] mr-8 text-white' data={dataForChart} options={options} />;
};

export default ChartComponent;
